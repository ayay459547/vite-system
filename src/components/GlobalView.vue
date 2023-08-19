<script setup lang="ts">
import type { Ref } from 'vue'
import {
  ref,
  reactive,
  computed,
  provide,
  onMounted,
  onBeforeMount,
  nextTick,
  useSlots
} from 'vue'
// layout
import SideContent from '@/components/layout/SideContent/SideContent.vue'
import HeaderContent from '@/components/layout/HeaderContent/HeaderContent.vue'

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

import type { SweetAlertOptions } from 'sweetalert2'
import Swal from 'sweetalert2'

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const navIsOpen = ref(false)
const historyIsOpen = ref(false)
const changeHistory = (v: boolean) => historyIsOpen.value = v

// hook
const {
  t: i18nT,
  // locale: i18nLocale,
  te: i18nTe // 測試 key 是否存在
} = useI18n()

const customLoader: Ref<InstanceType<typeof HookLoader> | null> = ref(null)
const customPopover: Ref<InstanceType<typeof HookPopover> | null> = ref(null)

const queueId = ref(0)
const customPopoverQueue: CustomPopoverQueue[] = reactive([])
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
    swal: (options: SweetAlertOptions<any, any>) => {
      const defaultOPtions = {
        // info, warning, success, error, question
        // icon: 'info',
        reverseButtons: true,
        confirmButtonText: '確認',
        confirmButtonColor: '#409eff',
        showCancelButton: true,
        cancelButtonText: '取消',
        ...options
      }

      return Swal.fire({ ...defaultOPtions })
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
const envStore = useEnvStore()
const onRouteChange = (currentRoute: RouteLocationNormalized) => {
  if ([null, undefined, 'login'].includes(currentRoute.name as string)) return

  setModalView(currentRoute)
  setNavigationData(currentRoute)
  setLoading(currentRoute)
  setWebTitle()
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

// 如果是另開視窗 將選單縮起來
const setModalView = async (currentRoute: RouteLocationNormalized) => {
  const isModal = currentRoute?.query?.isModal ?? false

  if (isModal === 'true') {
    isShow.value = false
    await nextTick()

    navIsOpen.value = false
    historyIsOpen.value = false
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

  setTimeout(() => {
    loading(false, 'loading')
  }, 300)
}

onBeforeMount(() => {
  initNavigationRoutes()
})

onMounted(() => {
  const _navIsOpen = localStorage.getItem('navIsOpen')
  const _historyIsOpen = localStorage.getItem('historyIsOpen')

  navIsOpen.value = _navIsOpen === 'true'
  historyIsOpen.value = _historyIsOpen === 'true'

  loading(true, '系統初始化')
})

// 登出
const logout = async () => {
  loading(true, '登出中')
  clearToken()

  await initNavigationRoutes()
  router.push({ name: 'login' })
}
// 登入
const login = async (userId: number) => {
  loading(true, '系統初始化')
  setToken(userId)

  await initNavigationRoutes()
  router.push({ name: 'home' })
}

</script>

<template>
  <ElConfigProvider :locale="locale.el">
    <!-- layout -->
    <div class="layout-wrapper">
      <div
        v-show="isShow"
        class="layout-left layout-side"
        :class="navIsOpen ? 'is-open': 'is-close'"
      >
        <SideContent
          :is-open="navIsOpen"
          :show-routes="navigationRoutes"
          :current-route-name="currentRouteName"
          :breadcrumb-name="breadcrumbName"
        >
          <template #header="{ isShow }">
            <slot name="menu-header" :is-show="isShow"></slot>
          </template>
          <template #footer="{ isShow }">
            <slot name="menu-footer" :is-show="isShow"></slot>
          </template>
        </SideContent>
      </div>

      <div
        v-show="isShow"
        class="layout-right"
        :class="navIsOpen ? 'is-open': 'is-close'"
      >
        <div class="layout-header">
          <HeaderContent
            v-model:is-open="navIsOpen"
            :history-is-open="historyIsOpen"
            :auth-data="authData"
            :breadcrumb-title="breadcrumbTitle"
            @change-history="changeHistory"
            @logout="logout"
            @change-locale="setWebTitle"
          >
            <template v-if="hasSlot('header-left')" #header-left>
              <slot name="header-left"></slot>
            </template>
            <template v-if="hasSlot('header-right')" #header-right>
              <slot name="header-right"></slot>
            </template>
          </HeaderContent>
        </div>
        <div class="layout-view">
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
              />
            </template>

            <div v-i-loading="isLoading" class="layout-mask">
              <RouterView v-slot="{ Component, route }">
                <component
                  v-if="route.name === 'login'"
                  :is="Component"
                  @login="login"
                />
                <KeepAlive v-else-if="route.meta.keepAlive">
                  <component
                    :key="route.name"
                    :is="Component"
                  />
                </KeepAlive>
                <component
                  v-else
                  :key="route.name"
                  :is="Component"
                />
                <!-- 更換路由執行 -->
                <div style="display: none;">{{ onRouteChange(route) }}</div>
              </RouterView>
            </div>
          </PageContent>
        </div>
      </div>

      <!-- 路由切換時 開啟遮罩(使用者看不到) 不能點任何東西 -->
      <div v-show="isLoading" class="is-disabled"></div>
    </div>
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
  &-wrapper {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    display: flex;
    position: relative;

    .is-disabled {
      width: 100%;
      height: 100%;
      z-index: $global-disabled-index;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #00000000;
    }
  }

  &-left {
    z-index: $side-index;
    height: 100%;
    transition-duration: 0.3s;
    will-change: width;
    position: absolute;
    left: 0;
    top: 0;

    &.is-close,
    &.is-open {
      width: $side-width;
    }
    // 至少要 992px 才可以定住選單
    @media (min-width: 992px) {
      &.is-open {
        width: $nav-lg-width;
        @media (max-width: 768px) {
          width: $nav-md-width;
        }
      }
    }
  }

  &-right {
    position: relative;
    top: 0;
    transition-duration: 0.3s;
    will-change: width, left;

    &.is-close,
    &.is-open {
      width: calc(100% - $side-width);
      left: $side-width;
    }

    // 至少要 992px 才可以定住選單
    @media (min-width: 992px) {
      &.is-open {
        width: calc(100% - $nav-lg-width);
        left: $nav-lg-width;

        @media (max-width: 768px) {
          width: calc(100% - $nav-md-width);
          left: $nav-md-width;
        }
      }
    }

    display: flex;
    flex-direction: column;
    overflow: auto;
    background-color: lighten($system-bg-color, 60%);
  }
  &-header {
    width: 100%;
    height: fit-content;
  }
  &-view {
    width: 100%;
    height: 100%;
    flex: 1;
  }
  &-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: auto;
  }
}
</style>
