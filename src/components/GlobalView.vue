<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, shallowReactive, computed, provide, onMounted, onBeforeMount, nextTick, useSlots } from 'vue'

import { swal, notification, message, isEmpty, scrollToEl } from '@/lib/lib_utils'
import throttle from '@/lib/lib_throttle'

// layout
import SystemLayout from '@/components/layout/SystemLayout.vue'

import PageContent from '@/components/layout/PageContent/PageContent.vue'
import NavigationTabs from '@/components/layout/PageContent/NavigationTabs.vue'

// element ui plus config
import { ElConfigProvider } from 'element-plus'

// locale
import { useLocaleStore } from '@/stores/stores_locale'

// system init
import { setCookie, removeCookie, setToken, clearToken, updateToken } from '@/lib/lib_cookie'
import { datetimeFormat } from '@/lib/lib_day'

import { useAuthStore } from '@/stores/stores_auth'
import { useRoutesStore } from '@/stores/stores_routes'
import { useEnvStore } from '@/stores/stores_env'
import { storeToRefs } from 'pinia'

import type { RouteLocationNormalized } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'

// idb
import { checkInitIdb } from '@/lib/lib_idb'

// hook
import type { UseHook, UseHookReturn, CustomPopoverQueue } from '@/declare/hook'
import HookLoader from './hook/HookLoader.vue'
import HookPopover from '@/components/hook/HookPopover.vue'

import { useGlobalI18n } from '@/i18n/i18n_excel'
import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

import { getPermission, defaultPermission } from '@/lib/lib_permission'

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

// hook
const customLoader: Ref<InstanceType<typeof HookLoader> | null> = ref(null)
const customPopover: Ref<InstanceType<typeof HookPopover> | null> = ref(null)

const queueId = ref(0)
const customPopoverQueue: CustomPopoverQueue[] = shallowReactive([])
const deleteCustomPopoverQueue = () => customPopoverQueue.pop()

const loading: UseHookReturn.loading = (isOpen, message) => {
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

const router = useRouter()

// store
const localeStore = useLocaleStore()
const locale = computed(() => localeStore.locale)
// @ts-ignore 更換語言
window.changeLang = localeStore.changeLang

const authStore = useAuthStore()
const { initSystemData } = authStore
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

// 翻譯檔
const { initModuleLangMap, setModuleType, i18nTest, i18nTranslate } = useGlobalI18n()

onMounted(() => {
  initModuleLangMap()
  setModuleType(defaultModuleType)
})

const isLoading = ref(false)
const componentIsShow = ref(true)

// 路由更換時執行
const onRouteChange = async (currentRoute: RouteLocationNormalized) => {
  if ([null, undefined, 'login'].includes(currentRoute.name as string)) return
  openLoading()
  setNavigationData(currentRoute)

  await nextTick()
  setTimeout(() => {
    setWebInfo()
    setModalView(currentRoute)
  }, 480)

  closeLoading()

  setTimeout(() => {
    updateToken()
  }, 2400)
}
// 打開 Loading
const openLoading = async () => {
  await nextTick()
  if (!isLoading.value) {
    isLoading.value = true
    componentIsShow.value = false
  }
}
// 關閉 Loading
const closeLoading = async () => {
  if (isLoading.value) {
    await nextTick()
    setTimeout(() => {
      componentIsShow.value = true
    }, 160)

    setTimeout(() => {
      pageScrollTop()
      isLoading.value = false
    }, 320)
  }
}
// 做節流 因為畫面更新 為觸發多次
const throttleOnRouteChange = throttle(onRouteChange, 80) as typeof onRouteChange

const route = useRoute()
const routeName = computed<any>(() => {
  throttleOnRouteChange(route)
  return route?.name ?? ''
})

// 設定 網頁 title
// 設定 使用中的翻譯檔模組
const setWebInfo = () => {
  const currentTitle = ((currentNavigation) => {
    if (currentNavigation) {
      const { name, title } = currentNavigation

      if (i18nTest(name)) {
        return i18nTranslate(name, defaultModuleType)
      }
      if (title ?? false) return title
    }
    return envStore.system
  })(currentNavigation.value)
  document.title = currentTitle

  setModuleType(currentNavigation?.value?.i18nModule ?? defaultModuleType)
}

// 換頁時 scrollbar 移動到最上面
const pageScrollTop = () => {
 const el = document.querySelector('.__layout-scroll-top__')
 if (el) {
   scrollToEl(el, { behavior: 'auto' })
 }
}

const systemLayoutRef = ref()

// 如果是另開視窗 將選單縮起來
const setModalView = async (currentRoute: RouteLocationNormalized) => {
  const isModal = currentRoute?.query?.isModal ?? false

  if (isModal === 'true') {
    layoutIsShow.value = false
    await nextTick()

    systemLayoutRef.value?.setModalView()
    layoutIsShow.value = true
  }
}

// 讀取當前路由變化 設置 麵包屑 + 當前路由 + 歷史紀錄
const setNavigationData = (currentRoute: RouteLocationNormalized) => {
  const routeName = currentRoute.name as string

  if (routeName === 'locatehome') {
    setBreadcrumbName(['locatehome'])
    setBreadcrumbTitle(['首頁'])

    setCurrentNavigation(null)
  } else if (navigationMap.value.has(routeName)) {
    const currentRoute = navigationMap.value.get(routeName)
    const {
      breadcrumbName: _breadcrumbName,
      breadcrumbTitle: _breadcrumbTitle
    } = currentRoute
    // 麵包屑
    setBreadcrumbName(_breadcrumbName ?? [])
    setBreadcrumbTitle(_breadcrumbTitle ?? [])
    // 當前路由
    setCurrentNavigation(currentRoute)
    // 歷史路由
    if (historyIsOpen.value) {
      setTimeout(() => {
        addHistoryNavigation(routeName, currentRoute)
      }, 1200)
    }
  }
}

const initSystem = async () => {
  await initSystemData()

  setNavigationRoutes(routesPermission.value)
}

/**
 * 初始化系統使用者 + 權限 + iDB
 * 用權限 設置路由選項
 */
const layoutIsShow = ref(false)
const initNavigationRoutes = async () => {
  layoutIsShow.value = false
  checkInitIdb()

  await initSystemData()

  setNavigationRoutes(routesPermission.value)
  router.push({ name: 'locatehome' })

  await nextTick()
  setTimeout(() => {
    layoutIsShow.value = true
  }, 120)

  // 給 900 毫秒 確保路由跳轉完成後 才執行
  setTimeout(() => {
    systemLayoutRef.value.init()
  }, 900)

  setTimeout(() => {
    loading(false, 'loading')
  }, 1200)
}

onBeforeMount(() => {
  initNavigationRoutes()
})

onMounted(() => {
  loading(true, i18nTranslate('systemInitialization', defaultModuleType))
})

// 路由切換
const onRouterChange = async () => {
  await nextTick()

  setTimeout(() => {
    systemLayoutRef.value.init()
  }, 100)
}

// 登出
const logout = async () => {
  await nextTick()
  loading(true, i18nTranslate('logout', defaultModuleType))
  clearToken()
  removeCookie('loginTime')

  await initNavigationRoutes()
  router.push({ name: 'login' })
}
// 登入
const login = async (userId: number) => {
  await nextTick()
  loading(true, i18nTranslate('systemInitialization', defaultModuleType))

  const loginTime = datetimeFormat(new Date(), 'YYYY-MM-DD_HH:mm:ss')
  setCookie('loginTime', loginTime)
  setToken(userId, loginTime)

  await initNavigationRoutes()
  router.push({ name: 'locatehome' })
}

// 歷史路由
const historyIsOpen = ref(false)
const historyChange = (v: boolean) => historyIsOpen.value = v

onMounted(() => {
  const _historyIsOpen = localStorage.getItem('historyIsOpen')
  historyIsOpen.value = _historyIsOpen === 'true'
})

// 向下傳送常用工具
provide<UseHook>('useHook', (options) => {
  const { i18nModule } = options ?? {}

  return {
    loading,
    i18nTranslate: (key: string, _i18nModule?: ScopeKey) => {
      return `${i18nTranslate(key, _i18nModule ?? i18nModule)}`
    },
    i18nTest: (key, _i18nModule?: ScopeKey) => {
      return i18nTest(key,  _i18nModule ?? i18nModule)
    },
    eventList: (click, eventList, options) => {
      click.preventDefault()
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
    swal: (sweetAlertOptions) => {
      return swal({
        confirmButtonText: i18nTranslate('confirm-yes'),
        showConfirmButton: true,
        cancelButtonText: i18nTranslate('confirm-no'),
        showCancelButton: true,
        ...sweetAlertOptions
      })
    },
    notification,
    message,
    permission: (routeName = null) => {
      if (!isEmpty(routeName)) {
        // 與路由守衛相同邏輯
        const userPermission = navigationMap.value.get(routeName)
        // pagePermission
        const pagePermission = [
          userPermission?.permission,
          defaultPermission,
          0
        ].find(_permission => typeof _permission === 'number')

        return getPermission(pagePermission)
      }

      const { permission = 0 } = currentNavigation?.value ?? {}
      return getPermission(permission)
    },
    env: () => {
      return envStore
    },
    auth: () => {
      return authData.value
    }
  }
})

</script>

<template>
  <ElConfigProvider :locale="locale.el">
    <!-- layout -->
    <SystemLayout
      ref="systemLayoutRef"
      :is-show="layoutIsShow"
      :show-routes="navigationRoutes"
      :current-navigation="currentNavigation"
      :current-route-name="routeName"
      :breadcrumbName="breadcrumbName"
      :history-is-open="historyIsOpen"
      :auth-data="authData"
      :breadcrumb-title="breadcrumbTitle"
      @logout="logout"
      @change-locale="setWebInfo"
      @history-change="historyChange"
      @change-page="openLoading"
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
              @router-change="onRouterChange"
            />
          </template>

          <div v-loading="isLoading" class="layout-mask">
            <div class="__layout-scroll-top__"></div>
            <RouterView v-slot="{ Component, route }">
              <component
                v-if="componentIsShow && route.name === 'login'"
                :key="route.name"
                :is="Component"
                @login="login"
              />
              <template v-else>
                <KeepAlive>
                  <component
                    v-if="componentIsShow && (route?.meta?.keepAlive ?? false)"
                    :key="route.name"
                    :is="Component"
                    @init-system="initSystem"
                  />
                </KeepAlive>
                <component
                  v-if="componentIsShow && !(route?.meta?.keepAlive ?? false)"
                  :key="route.name"
                  :is="Component"
                  @init-system="initSystem"
                />
              </template>
              <!-- 更換路由執行 -->
              <!-- <div style="display: none;">{{ throttleOnRouteChange(route) }}</div> -->
            </RouterView>
          </div>
        </PageContent>
      </template>

      <!-- 路由切換時 開啟遮罩(使用者看不到) 不能點任何東西 -->
      <div v-show="isLoading" class="is-disabled">
        <span class="hidden-text">{{ routeName }}</span>
      </div>
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

.is-disabled {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: var(--i-z-index-global-disabled);
}
</style>
