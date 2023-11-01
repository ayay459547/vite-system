<script setup lang="ts">
import type { Ref } from 'vue'
import {
  ref,
  shallowReactive,
  computed,
  provide,
  onMounted,
  onBeforeMount,
  nextTick,
  useSlots
} from 'vue'

import { isEmpty, scrollToEl } from '@/lib/lib_utils'

// layout
import SystemLayout from '@/components/layout/SystemLayout.vue'

import PageContent from '@/components/layout/PageContent/PageContent.vue'
import NavigationTabs from '@/components/layout/PageContent/NavigationTabs.vue'

// element ui plus config
import { ElConfigProvider } from 'element-plus'

// locale
import { useLocaleStore } from '@/stores/stores_locale'

// system init
import { useAuthStore } from '@/stores/stores_auth'
import { useRoutesStore } from '@/stores/stores_routes'
import { useEnvStore } from '@/stores/stores_env'
import { storeToRefs } from 'pinia'

import type { RouteRecordName, RouteLocationNormalized } from 'vue-router'
import { useRouter } from 'vue-router'

// hook
import type { Hook, HookList, CustomPopoverQueue } from '@/declare/hook'
import HookLoader from './hook/HookLoader.vue'
import HookPopover from '@/components/hook/HookPopover.vue'

import { useI18n } from 'vue-i18n'

import Swal from 'sweetalert2'
import type { NotificationOptionsTyped } from 'element-plus'
import { ElNotification } from 'element-plus'

import { getPermission } from '@/lib/lib_permission'

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

// hook
const {
  t: i18nT,
  // locale: i18nLocale,
  te: i18nTe // 測試 key 是否存在
} = useI18n()

const customLoader: Ref<InstanceType<typeof HookLoader> | null> = ref(null)
const customPopover: Ref<InstanceType<typeof HookPopover> | null> = ref(null)

const queueId = ref(0)
const customPopoverQueue: CustomPopoverQueue[] = shallowReactive([])
const deleteCustomPopoverQueue = () => customPopoverQueue.pop()

const loading: HookList.loading = (isOpen, message) => {
  if (!customLoader.value) return

  if (isOpen) {
    const _message = message ?? 'loading'

    customLoader.value.openLoader(_message)
  } else {
    customLoader.value.closeLoader()
  }
}
// 系統參數
const envStore = useEnvStore()

provide<Hook>('hook', () => {
  return {
    loading,
    i18nTranslate: (key) => `${i18nT(key)}`,
    i18nTest: (key) => i18nTe(key),
    eventList: (click, eventList, options) => {
      const { clientX, clientY } = click

      customPopoverQueue.unshift({
        queueId: queueId.value,
        clientX,
        clientY,
        eventList,
        options
      })
      queueId.value++
    },
    swal: (options) => {
      const defaultOPtions = {
        // 'info' | 'warning' | 'success' | 'error' | 'question'
        // icon: 'info',
        reverseButtons: true,
        confirmButtonText: '確認',
        confirmButtonColor: '#409eff',
        showCancelButton: true,
        cancelButtonText: '取消'
      }

      return Swal.fire({
        ...defaultOPtions,
        ...options
      })
    },
    notification: (options) => {
      const defaultOPtions = {
        // 'success' | 'warning' | 'info' | 'error' | ''
        type: '',
        icon: '',
        title: '',
        message: ''
      } as Partial<NotificationOptionsTyped>

      return ElNotification({
        ...defaultOPtions,
        ...options
      })
    },
    permission: (permissionTotal = null) => {
      if (!isEmpty(permissionTotal)) return getPermission(permissionTotal)

      const { permission } = currentNavigation.value
      return getPermission(permission)
    },
    getEnv: () => {
      return envStore
    }
  }
})

const router = useRouter()

// store
const localeStore = useLocaleStore()
const locale = computed(() => localeStore.locale)

const authStore = useAuthStore()
const { setToken, clearToken, initSystemData } = authStore
const { authData, routesPermission } = storeToRefs(authStore)

const routesStore = useRoutesStore()
const {
  setNavigationRoutes,

  setBreadcrumbName,
  setBreadcrumbTitle,
  setCurrentNavigation,
  addHistoryNavigation
} = routesStore
const {
  navigationMap,
  navigationRoutes,

  breadcrumbName,
  breadcrumbTitle,
  currentNavigation,

  historyNavigation
} = storeToRefs(routesStore)

const currentRouteName = computed<string>(() => {
  return currentNavigation.value?.name ?? ''
})

// 路由更換時執行
const onRouteChange = (currentRoute: RouteLocationNormalized) => {
  if ([null, undefined, 'login'].includes(currentRoute.name as string)) return

  setModalView(currentRoute)
  setNavigationData(currentRoute)

  setLoading(currentRoute)

  setTimeout(() => {
    pageScrollTop()
    setWebTitle()
  }, 0)
}
// 設置 網頁 title
const setWebTitle = () => {
  const currentTitle = ((currentNavigation) => {
    if (currentNavigation) {
      const { name, title } = currentNavigation
      if (i18nTe(name)) return i18nT(name)
      if (title ?? false) return title
    }
    return envStore.system
  })(currentNavigation.value)

  document.title = currentTitle
}

// 換頁時 scrollbar 移動到最上面
const pageScrollTop = () => {
 const el = document.querySelector('.layout-scroll-top')
 if (el) {
   scrollToEl(el, { behavior: 'auto' })
 }
}


const systemLayoutRef = ref()

// 如果是另開視窗 將選單縮起來
const setModalView = async (currentRoute: RouteLocationNormalized) => {
  const isModal = currentRoute?.query?.isModal ?? false

  if (isModal === 'true') {
    isShow.value = false
    await nextTick()

    systemLayoutRef.value?.setModalView()
    isShow.value = true
  }
}

// 切換路由時 要有loading
const isLoading = ref(false)
const prevRoute = ref<RouteRecordName>('')
const setLoading = (currentRoute: RouteLocationNormalized) => {
  if (prevRoute.value !== currentRoute.name) {
    isLoading.value = true

    setTimeout(() => {
      prevRoute.value = currentRoute.name

      isLoading.value = false
    }, 560)
  }
}

// 讀取當前路由變化 設置 麵包屑 + 當前路由 + 歷史紀錄
const setNavigationData = (currentRoute: RouteLocationNormalized) => {
  const routeName = currentRoute.name as string

  if (routeName === 'home') {
    setBreadcrumbName(['home'])
    setBreadcrumbTitle(['首頁'])

    setCurrentNavigation(null)
  } else if (navigationMap.value.has(routeName)) {
    const currentRoute = navigationMap.value.get(routeName)
    const {
      breadcrumbName: _breadcrumbName,
      breadcrumbTitle: _breadcrumbTitle
    } = currentRoute

    setBreadcrumbName(_breadcrumbName ?? [])
    setBreadcrumbTitle(_breadcrumbTitle ?? [])

    setCurrentNavigation(currentRoute)
    addHistoryNavigation(routeName, currentRoute)
  }
}

/**
 * 初始化系統使用者 + 權限
 * 用權限 設置路由選項
 */
const isShow = ref(false)
const initNavigationRoutes = async () => {
  isShow.value = false

  await initSystemData()

  setNavigationRoutes(routesPermission.value)
  router.push({ name: 'home' })

  await nextTick()

  setTimeout(() => {
    isShow.value = true
  }, 100)
}

onBeforeMount(async () => {
  await initNavigationRoutes()
  await nextTick()
  loading(true, '系統初始化')

  setTimeout(() => {
    loading(false, 'loading')
  }, 500)
  // 給 800 毫秒 確保路由跳轉完成後 才執行
  setTimeout(() => {
    systemLayoutRef.value.init()
  }, 800)
})

// 路由切換
const onChangeRouter = async () => {
  await nextTick()

  setTimeout(() => {
    systemLayoutRef.value.init()
  }, 100)
}

// 登出
const logout = async () => {
  loading(true, '登出中')
  clearToken()

  await initNavigationRoutes()
  router.push({ name: 'login' })

  setTimeout(() => {
    loading(false)
  }, 300)
}
// 登入
const login = async (userId: number) => {
  loading(true, '系統初始化')
  setToken(userId)

  await initNavigationRoutes()
  router.push({ name: 'home' })

  setTimeout(() => {
    loading(false)
  }, 300)
}

// 歷史路由
const historyIsOpen = ref(false)
const changeHistory = (v: boolean) => historyIsOpen.value = v

onMounted(() => {
  loading(true, '系統初始化')
  const _historyIsOpen = localStorage.getItem('historyIsOpen')
  historyIsOpen.value = _historyIsOpen === 'true'
})

</script>

<template>
  <ElConfigProvider :locale="locale.el">
    <!-- layout -->
    <SystemLayout
      ref="systemLayoutRef"
      :is-show="isShow"
      :show-routes="navigationRoutes"
      :current-navigation="currentNavigation"
      :current-route-name="currentRouteName"
      :breadcrumbName="breadcrumbName"
      :history-is-open="historyIsOpen"
      :auth-data="authData"
      :breadcrumb-title="breadcrumbTitle"
      @logout="logout"
      @change-locale="setWebTitle"
      @change-history="changeHistory"
    >
      <template #logo="{ isShow }">
        <slot name="logo" :is-show="isShow"></slot>
      </template>
      <template #menu-footer="{ isShow }">
        <slot name="menu-footer" :is-show="isShow"></slot>
      </template>

      <template v-if="hasSlot('header-left')" #header-left>
        <slot name="header-left"></slot>
      </template>
      <template v-if="hasSlot('header-right')" #header-right>
        <slot name="header-right"></slot>
      </template>

      <template #content>
        <PageContent
          :history-is-open="historyIsOpen"
          :history-navigation="historyNavigation"
          :current-navigation="currentNavigation"
        >
          <template #tabs="{ isShow }">
            <NavigationTabs
              v-if="isShow"
              :history-navigation="historyNavigation"
              :current-navigation="currentNavigation"
              @change-router="onChangeRouter"
            />
          </template>

          <div v-loading="isLoading" class="layout-mask">
            <div class="layout-scroll-top"></div>
            <RouterView v-slot="{ Component, route }">
              <component
                v-if="route.name === 'login'"
                :key="route.name"
                :is="Component"
                @login="login"
              />
              <template v-else>
                <KeepAlive>
                  <component
                    v-if="route?.meta?.keepAlive ?? false"
                    :key="route.name"
                    :is="Component"
                  />
                </KeepAlive>
                <component
                  v-if="!(route?.meta?.keepAlive ?? false)"
                  :key="route.name"
                  :is="Component"
                />
              </template>
              <!-- 更換路由執行 -->
              <div style="display: none;">{{ onRouteChange(route) }}</div>
            </RouterView>
          </div>
        </PageContent>
      </template>

      <!-- 路由切換時 開啟遮罩(使用者看不到) 不能點任何東西 -->
      <div v-show="isLoading" class="is-disabled"></div>
    </SystemLayout>

    <!-- hook loading -->
    <HookLoader ref="customLoader"/>
    <!-- hook popover -->
    <template v-if="customPopoverQueue.length > 0">
      <HookPopover
        v-for="popover in customPopoverQueue"
        :key="popover.queueId"
        ref="customPopover"
        v-bind="popover"
        @close="deleteCustomPopoverQueue"
      />
    </template>
  </ElConfigProvider>
</template>

<style lang="scss" scoped>
.layout {
  &-mask {
    width: 100%;
    min-height: fit-content;
    height: 100%;
    position: absolute;
    overflow: auto;
  }

  &-scroll-top {
    width: 100%;
  }
}
</style>
