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

import { aesDecrypt, swal, notification, message, isEmpty, tipLog, awaitTime } from '@/lib/lib_utils.ts'

// layout
import SystemLayout from '@/components/layout/SystemLayout.vue'
import PageContent from '@/components/layout/PageContent.vue'

// element ui plus config
import { ElConfigProvider } from 'element-plus'

// locale
import { useLocaleStore } from '@/stores/stores_locale'

// system init
import { setCookie, removeCookie, setToken, clearToken } from '@/lib/lib_cookie.ts'
import { formatDatetime } from '@/lib/lib_format.ts'

import { useAuthStore } from '@/stores/stores_auth'
import { useRoutesStore } from '@/stores/stores_routes'
import { storeToRefs } from 'pinia'

import type { RouteLocationNormalized } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'

// hook
import type { UseHook, UseHookReturn, CustomPopoverQueue } from '@/declare/hook.ts'
import HookLoader from './hook/HookLoader.vue'
import HookPopover from '@/components/hook/HookPopover.vue'

import { useGlobalI18n } from '@/i18n/i18n_excel'
import type { ScopeKey } from '@/i18n/i18n_setting.ts'
import { defaultModuleType } from '@/i18n/i18n_setting.ts'

import { getPermission } from '@/lib/lib_permission.ts'

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

const loading: UseHookReturn.Loading = (isOpen, message) => {
  if (!customLoader.value) return

  if (isOpen) {
    const _message = message ?? 'loading'

    customLoader.value.openLoader(_message)
  } else {
    customLoader.value.closeLoader()
  }
}
// 系統參數
const systemEnv = computed(() => {
  const _env = (import.meta as any).env

  return {
    env: _env,
    mode: _env.MODE,
    system: _env.VITE_API_SYSTEM_TYPE,
    version: _env.VITE_API_VERSION,
    buildVersion: _env.VITE_API_BUILD_VERSION,
    baseUrl: _env.VITE_API_BASE_URL,
    // PRIVATE_KEY: _env.VITE_API_PRIVATE_KEY,
    QUERY_KEY: _env.VITE_API_QUERY_KEY
  }
})

// store
const localeStore = useLocaleStore()
const locale = computed(() => localeStore.locale)
// @ts-ignore TEST 更換語言
window.changeLang = localeStore.changeLang

const authStore = useAuthStore()
const { initSystemData } = authStore
const { authData, routesPermission } = storeToRefs(authStore)

const routesStore = useRoutesStore()
const {
  setNavigationRoutes,

  setBreadcrumbName,
  setBreadcrumbTitle,
  setCurrentNavigation
} = routesStore

const {
  navigationMap,
  navigationRoutes,

  breadcrumbName,
  breadcrumbTitle,
  currentNavigation
} = storeToRefs(routesStore)

// 翻譯檔
const { initModuleLangMap, setModuleType, i18nTest, i18nTranslate } = useGlobalI18n()

onMounted(() => {
  initModuleLangMap()
  setModuleType(defaultModuleType)
})

// 如果是另開視窗 將選單縮起來
const setModalView = async (currentRoute: RouteLocationNormalized) => {
  const isModal = currentRoute?.query?.isModal ?? 'false'

  if (isModal === 'true') {
    systemLayoutRef.value?.setModalView()
  }
}

// 路由更換時執行
const routeChange = async (currentRoute: RouteLocationNormalized) => {
  const { name } = currentNavigation?.value ?? { name: '' }
  if ([null, undefined, name, 'login'].includes(currentRoute.name as string)) return
  setNavigationData(currentRoute)
  await awaitTime(120)

  // 設定網頁標籤名稱
  setWebInfo()

  // 設定是否為 modal 模式
  setModalView(currentRoute)
}

// 設定 網頁 title
// 設定 使用中的翻譯檔模組
const setWebInfo = () => {
  const currentTitle = (currentNavigation => {
    if (currentNavigation) {
      const { name, title } = currentNavigation

      if (i18nTest(name)) {
        return i18nTranslate(name, defaultModuleType)
      }
      if (title ?? false) return title
    }
    return systemEnv.value.system
  })(currentNavigation.value)
  document.title = currentTitle
}

const systemLayoutRef = ref()

// 讀取當前路由變化 設置 麵包屑 + 當前路由 + 歷史紀錄
const setNavigationData = (currentRoute: RouteLocationNormalized) => {
  const routeName = currentRoute.name as string

  if (routeName === 'locatehome') {
    setBreadcrumbName(['locatehome'])
    setBreadcrumbTitle(['首頁'])

    setCurrentNavigation(null)
  } else if (navigationMap.value.has(routeName)) {
    const currentRoute = navigationMap.value.get(routeName)
    const { breadcrumbName: _breadcrumbName, breadcrumbTitle: _breadcrumbTitle } = currentRoute
    // 麵包屑
    setBreadcrumbName(_breadcrumbName ?? [])
    setBreadcrumbTitle(_breadcrumbTitle ?? [])
    // 當前路由
    setCurrentNavigation(currentRoute)
  }
}


const router = useRouter()
/**
 * 初始化系統使用者 + 權限 + iDB
 * 用權限 設置路由選項
 */
const layoutIsShow = ref(false)
const initNavigationRoutes = async (routeName?: string) => {
  layoutIsShow.value = false
  await nextTick()

  try {
    await initSystemData()
  } catch (e) {
    console.log(e)
    logout()

    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', defaultModuleType),
      text: e ?? i18nTranslate('warning-contactIT', defaultModuleType),
      showCancelButton: false
    })
  }

  setNavigationRoutes(routesPermission.value)

  await nextTick()
  loading(false, 'loading')

  await awaitTime(24)
  if (!isEmpty(routeName)) {
    router.push({ name: routeName })
  }
  layoutIsShow.value = true

  setLayoutInfo()
}

onBeforeMount(() => {
  initNavigationRoutes()
})

onMounted(() => {
  loading(true, i18nTranslate('system-initialization', defaultModuleType))
})

// 路由切換
const setLayoutInfo = async () => {
  await nextTick()
  // 給 480 毫秒 確保路由跳轉完成後 才執行
  await awaitTime(480)
  if (systemLayoutRef.value) {
    systemLayoutRef.value.init()
  }
}

const pageContentRef = ref()
// 登出
const logout = async () => {
  await nextTick()
  loading(true, i18nTranslate('logout', defaultModuleType))

  clearToken()
  removeCookie('loginTime')
  initNavigationRoutes('login')

  if (pageContentRef.value) {
    pageContentRef.value.busOff()
  }
}
// 登入
const login = async (userId: number) => {
  await nextTick()
  loading(true, i18nTranslate('login', defaultModuleType))

  const loginTime = formatDatetime(new Date(), 'YYYY-MM-DD_HH:mm:ss')
  setCookie('loginTime', loginTime)
  setToken(userId, loginTime)
  initNavigationRoutes('locatehome')

  if (pageContentRef.value) {
    pageContentRef.value.busOn()
  }
}

// 向下傳送常用工具
provide<UseHook>('useHook', options => {
  const { i18nModule = defaultModuleType } = options ?? {}

  return {
    loading,
    i18nTranslate: (key: string, _i18nModule?: ScopeKey) => {
      return `${i18nTranslate(key, _i18nModule ?? i18nModule)}`
    },
    i18nTest: (key, _i18nModule?: ScopeKey) => {
      return i18nTest(key, _i18nModule ?? i18nModule)
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
    swal: sweetAlertOptions => {
      return swal({
        confirmButtonText: i18nTranslate('confirm-yes', defaultModuleType),
        cancelButtonText: i18nTranslate('confirm-no', defaultModuleType),
        showConfirmButton: true,
        showCancelButton: true,
        ...sweetAlertOptions
      })
    },
    notification,
    message,
    permission: (routeName = null) => {
      if (!isEmpty(routeName)) {
        // 與路由守衛相同邏輯
        const routerPermission = navigationMap.value.get(routeName)
        const pagePermission = routerPermission?.permission ?? 0

        const _pagePermission = getPermission(pagePermission)
        tipLog(`${routeName} 權限`, [routeName, _pagePermission])

        return _pagePermission
      }

      const { meta } = currentNavigation?.value ?? { meta: { permission: 0 } }
      const { permission = 0 } = meta
      const _pagePermission = getPermission(permission)
      tipLog(`${currentNavigation?.value} 權限`, [currentNavigation?.value, _pagePermission])

      return getPermission(permission)
    },
    env: () => {
      return systemEnv.value
    },
    auth: () => {
      return authData.value
    },
    redirectInfo: () => {
      const route = useRoute()
      const fromQuery = route.query ?? {}
      const [fromPage = '', fromData = ''] = [
        Array.isArray(fromQuery.from) ? fromQuery.from.join(',') : fromQuery.from,
        Array.isArray(fromQuery.data) ? fromQuery.data.join(',') : fromQuery.data
      ]
      const queryData = isEmpty(fromData) ? '' : aesDecrypt(fromData as string, systemEnv.value.QUERY_KEY)

      return {
        fromPage,
        queryData
      }
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
      :breadcrumb-name="breadcrumbName"
      :breadcrumb-title="breadcrumbTitle"
      :auth-data="authData"
      @logout="logout"
      @lang-change="setWebInfo"
    >
      <template #logo="{ isShow }">
        <slot name="logo" :is-show="isShow" :env="systemEnv"></slot>
      </template>
      <template #menu-footer="{ isShow }">
        <slot name="menu-footer" :is-show="isShow" :env="systemEnv"></slot>
      </template>

      <template v-if="hasSlot('header-left')" #header-left>
        <slot name="header-left" :env="systemEnv"></slot>
      </template>
      <template v-if="hasSlot('header-right')" #header-right>
        <slot name="header-right" :env="systemEnv"></slot>
      </template>

      <template #content>
        <PageContent
          ref="pageContentRef"
          @routeChange="routeChange"
          @login="login"
          @setLayoutInfo="setLayoutInfo"
          @initNavigationRoutes="initNavigationRoutes"
        ></PageContent>
      </template>
    </SystemLayout>

    <!-- hook loading -->
    <HookLoader ref="customLoader" />
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

<style lang="scss" scoped></style>
