<script setup lang="ts">
import type { Ref } from 'vue'
import {
  ref,
  shallowReactive,
  computed,
  provide,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  nextTick
} from 'vue'

import { aesDecrypt, swal, notification, message, isEmpty, tipLog, awaitTime } from '@/lib/lib_utils' // 工具

import { useEventBus } from '@/lib/lib_hook' // 自訂Composition API
// layout
import SystemLayout from '@/components/layout/SystemLayout.vue'
import PageContent from '@/components/layout/PageContent.vue'

// element ui plus config
import { ElConfigProvider } from 'element-plus'

// locale
import { useLocaleStore } from '@/stores/stores_locale'

// system init
import { setCookie, removeCookie, setToken, clearToken } from '@/lib/lib_cookie'
import { formatDatetime } from '@/lib/lib_format' // 格式化

import { useAuthStore } from '@/stores/stores_auth'
import { useRoutesStore } from '@/stores/stores_routes'
import { storeToRefs } from 'pinia'

import type { RouteLocationNormalized } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'

// hook
import type { UseHook, UseHookReturn, CustomPopoverQueue } from '@/declare/hook' // 全域功能類型
import HookLoader from './hook/HookLoader.vue'
import HookPopover from '@/components/hook/HookPopover.vue'

import { useGlobalI18n } from '@/i18n/i18n_excel'
import { defaultModuleType } from '@/i18n/i18n_setting'

import { totlaPermission, getPermission } from '@/lib/lib_permission' // 權限

// 開發測試使用
import DevelopmentTest from './DevelopmentTest/DevelopmentTest.vue'

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
    QUERY_KEY: _env.VITE_API_QUERY_KEY,

    // 只有 PageContent 不用 SystemLayout
    isIframe: (_env.VITE_API_IFRAME === 'true'),

    isSkipLogin: (_env.VITE_API_SKIP_LOGIN === 'true'),
    isAllPermissionData: (_env.VITE_API_ALL_PERMISSION === 'true')
  }
})

// store
const localeStore = useLocaleStore()

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
const { initModuleLangMap, i18nTest, i18nTranslate, langMap } = useGlobalI18n()

onMounted(() => {
  initModuleLangMap()
})

// 路由更換時執行
const routeChange = async (currentRoute: RouteLocationNormalized) => {
  const { name } = currentNavigation?.value ?? { name: '' }
  if ([null, undefined, name, 'login'].includes(currentRoute.name as string)) return

  setNavigationData(currentRoute)
  await awaitTime(120)

  // 設定網頁標籤名稱
  setWebTitle()
}

const i18nBus = useEventBus<string>('i18n')
const i18nBusListener = (event: string) => {
  switch (event) {
    case 'langChange':
      setWebTitle()
      break
  }
}
onBeforeMount(() => {
  i18nBus.on(i18nBusListener)
})
onBeforeUnmount(() => {
  i18nBus.off(i18nBusListener)
})
/**
 * 設定網頁 title 優先順序
 * 1. i18n Excel 中 views 的名稱
 * 2. router 設定的 title
 * 3. 系統名稱
 */
const setWebTitle = () => {
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

// 開發測試用 DevelopmentTest
const developmentTestRef = ref()
const isShowDevelopmentTest = ref(false)
const development = () => {
  if (systemEnv.value.mode === 'development') {
    isShowDevelopmentTest.value = !isShowDevelopmentTest.value

  } else {
    swal({
      title: 'Input System Title',
      input: 'text',
      showCancelButton: true,
      showConfirmButton: true
    }).then((result: any) => {
      const { isConfirmed, value } = result

      if (isConfirmed && value === systemEnv.value.system) {
        isShowDevelopmentTest.value = !isShowDevelopmentTest.value
      } else {
        isShowDevelopmentTest.value = false
      }
    })
  }
}
// @ts-ignore
window.development = development
/**
 * 按 Ctrl + Shift + -(數字鍵右上方)
 * 開啟開發用工具
 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.shiftKey && event.ctrlKey && event.key === '-') {
    development()
    event.preventDefault()
  }
}
if (systemEnv.value.mode === 'development') {
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })
  onBeforeMount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}

// 向下傳送常用工具
provide<UseHook>('useHook', (options = {}) => {
  const { i18nModule = defaultModuleType } = options

  return {
    loading,
    i18nTranslate: (key, _i18nModule?) => {
      if (isShowDevelopmentTest.value) {
        const { name } = currentNavigation?.value ?? { name: null }

        if (name) {
          developmentTestRef.value?.addI18nUsageRecord({
            routeName: name,
            i18nKey: key,
            i18nModule: _i18nModule ?? i18nModule
          })
        }
      }

      return `${i18nTranslate(key, _i18nModule ?? i18nModule)}`
    },
    i18nTest: (key, _i18nModule?) => {
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
    swal: (sweetAlertOptions = {}) => {
      return swal({
        confirmButtonText: i18nTranslate('confirm-yes', defaultModuleType),
        cancelButtonText: i18nTranslate('confirm-no', defaultModuleType),
        showConfirmButton: true,
        showCancelButton: true,
        ...sweetAlertOptions
      })
    },
    notification: (notificationProps = {}) => {
      return notification({
        ...notificationProps
      })
    },
    message: (options = {}) => {
      return message({
        duration: 10000,
        ...options
      })
    },
    permission: (routeName = null) => {
      if (systemEnv.value.isAllPermissionData) return getPermission(totlaPermission)

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
  <ElConfigProvider :locale="localeStore.elLocale">
    <!-- layout -->
    <SystemLayout
      ref="systemLayoutRef"
      :is-show="layoutIsShow"
      :show-routes="navigationRoutes"
      :current-navigation="currentNavigation"
      :breadcrumb-name="breadcrumbName"
      :breadcrumb-title="breadcrumbTitle"
      :auth-data="authData"
      :is-iframe="systemEnv.isIframe"
      @logout="logout"
    >
      <template #logo>
        <slot name="logo" :env="systemEnv"></slot>
      </template>
      <template #version>
        <slot name="version" :env="systemEnv"></slot>
      </template>

      <template #content>
        <PageContent
          ref="pageContentRef"
          :is-iframe="systemEnv.isIframe"
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

    <!-- 開發測試用 -->
    <DevelopmentTest
      ref="developmentTestRef"
      v-if="isShowDevelopmentTest"
      :lang-map="langMap"
    />

  </ElConfigProvider>
</template>

<style lang="scss" scoped></style>
