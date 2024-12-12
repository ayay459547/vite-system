<script setup lang="ts">
import type { Ref } from 'vue'
import {
  ref,
  shallowReactive,
  computed,
  provide,
  onBeforeMount, onMounted, onBeforeUnmount,
  nextTick,
  watch
} from 'vue'

import {
  aesDecrypt,
  swal, notification, message,
  isEmpty, tipLog, awaitTime
} from '@/lib/lib_utils' // 工具

import { useEventBus } from '@/lib/lib_hook' // 自訂Composition API

import { ElConfigProvider } from 'element-plus' // element ui plus config
import { useLocaleStore } from '@/stores/stores_locale' // locale

// system init
import { useAuthStore } from '@/stores/stores_auth'
import { useRoutesStore } from '@/stores/stores_routes'

import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// hook
import type { UseHook, UseHookReturn, CustomPopoverQueue } from '@/declare/hook' // 全域功能類型
import HookLoader from './hook/HookLoader.vue'
import HookPopover from '@/components/hook/HookPopover.vue'

import { useGlobalI18n } from '@/i18n/i18n_excel'
import { defaultModuleType } from '@/i18n/i18n_setting'

import { defaultPermission, getPermission } from '@/lib/lib_permission' // 權限

// layout
import SystemLayout from '@/components/layout/SystemLayout.vue'
import PageContent from '@/components/layout/PageContent.vue'

// 網路狀態
import NetworkView from '@/components/layout/NetworkView.vue'
// 開發測試用
import DevelopmentTest from '@/components/layout/DevelopmentTest/DevelopmentTest.vue'

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

    customer: _env.VITE_API_CUSTOMER,

    version: _env.VITE_API_VERSION,
    buildVersion: _env.VITE_API_BUILD_VERSION,
    baseUrl: _env.VITE_API_BASE_URL,

    QUERY_KEY: _env.VITE_API_QUERY_KEY,
    // PRIVATE_KEY: _env.VITE_API_PRIVATE_KEY,
    tokenTime: _env.VITE_API_TOKEN_TIME,

    // 只有 PageContent 不用 SystemLayout
    isIframe: (_env.VITE_API_IFRAME === 'true')

    // isSkipLogin: (_env.VITE_API_SKIP_LOGIN === 'true'),
    // isAllPermissionData: (_env.VITE_API_ALL_PERMISSION === 'true')
  }
})

// store
const localeStore = useLocaleStore()

const authStore = useAuthStore()
const { initAuthData, setAuthStatus, clearAuthStatus, checkAuthStatus } = authStore
const { isLogin, authData } = storeToRefs(authStore)

const routesStore = useRoutesStore()
const { setNavigationRoutes } = routesStore

const {
  navigationMap,
  navigationRoutes,

  breadcrumbName,
  breadcrumbTitle,
  currentNavigation
} = storeToRefs(routesStore)

const isDisabled = ref(false)
const isLoading = ref(false)
const routerBus = useEventBus<string>('router')
const routerBusListener = async (event: string) => {
  switch (event) {
    case 'beforeRouterChange':
      isLoading.value = true // 載入組件時 開啟

      isDisabled.value = true
      // 切換頁面 等待一段時間, 避免連點
      await awaitTime(800)
      isDisabled.value = false
      break
    case 'routerChange':
      isLoading.value = false // 載入組件後 關閉
      break
  }
}
onBeforeMount(() => {
  routerBus.on(routerBusListener)
})
onBeforeUnmount(() => {
  routerBus.off(routerBusListener)
})

const systemLayoutRef = ref()

// 翻譯檔
const { initModuleLangMap, i18nTest, i18nTranslate, langMap } = useGlobalI18n()
onMounted(() => {
  initModuleLangMap()
})

const isInitSystem = ref(false)

const router = useRouter()
/**
 * 初始化系統使用者 + 權限 + iDB
 * 用權限 設置路由選項
 */
const initSystemData = async (routeName?: string) => {
  isInitSystem.value = false
  await initAuthData()
  setNavigationRoutes(authData.value)

  if (!isEmpty(routeName)) {
    router.push({ name: routeName })
    setLayoutInfo()
  }

  await nextTick()
  loading(false, 'loading')
  isInitSystem.value = true
}

onMounted(() => {
  loading(true, i18nTranslate('system-initialization', defaultModuleType))
})
onBeforeMount(() => {
  initSystemData()
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

// 登入
const login = async (userId: number) => {
  if (isLogin.value) return

  await nextTick()
  loading(true, i18nTranslate('login', defaultModuleType))

  setAuthStatus(userId)
  initSystemData('locatehome')
}

// 登出
const logout = async () => {
  if (!isLogin.value) return

  await nextTick()
  loading(true, i18nTranslate('logout', defaultModuleType))

  clearAuthStatus()
  initSystemData('login')
}

// 保存時間 (分鐘)
const expiresTime = Number.parseInt(systemEnv.value.tokenTime) * 60 * 1000
// 保存時間: 測試(秒)
// const expiresTime = Number.parseInt(systemEnv.value.tokenTime) * 1000
let checkTimer: NodeJS.Timeout | number | undefined = null
// 定期檢查登入狀態
watch(isLogin, (newLogin, oldLogin) => {
  if (newLogin !== oldLogin && isLogin.value) {
    clearInterval(checkTimer)
    checkTimer = null

    checkTimer = setInterval(async () => {
      const authStatus = await checkAuthStatus()

      if (isEmpty(authStatus)) {
        // 清除登入資訊 強制登出
        // logout()

        // 清除登入資訊 頁面重整會登出
        clearAuthStatus()
        clearInterval(checkTimer)
      }
    }, expiresTime)
  }
}, { deep: false, immediate: true })

// 開發測試用 DevelopmentTest
const developmentTestRef = ref()
const isShowDevelopmentTest = ref(false)


/**
 * 按 Ctrl + Shift + Alt + -(數字鍵右上方)
 * 開啟開發用工具
 */
 const handleKeydown = (event: KeyboardEvent) => {
  if (event.shiftKey && event.ctrlKey && event.altKey && event.key === '-') {
    event.preventDefault()
    isShowDevelopmentTest.value = !isShowDevelopmentTest.value
  }
}
if (systemEnv.value.mode === 'development') {
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })
  onBeforeUnmount(() => {
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
      let _pageName: string | null = routeName
      let _pagePermission: number = defaultPermission

      // 指定路由
      if (!isEmpty(routeName)) {
        const routerPermission = navigationMap.value.get(routeName)
        _pagePermission = (routerPermission?.permission ?? defaultPermission) as number

      // 當前路由
      } else {
        const {
          name: routeName = '',
          permission: pagePermission = defaultPermission
        } = currentNavigation?.value ?? { name: '', permission: 0 }

        _pageName = routeName
        _pagePermission = pagePermission
      }

      const resPagePermission = getPermission(_pagePermission)
      tipLog(`${_pageName} 權限`, [
        routeName,
        resPagePermission,
        currentNavigation?.value
      ])
      return resPagePermission
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
    <!-- 路由切換時 開啟遮罩(使用者看不到) 不能點任何東西 -->
    <div v-show="isDisabled" class="is-disabled"></div>

    <!-- layout -->
    <SystemLayout
      ref="systemLayoutRef"
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
          :is-init-system="isInitSystem"
          :system-name="systemEnv.system"
          :is-iframe="systemEnv.isIframe"
          :current-navigation="currentNavigation"
          :navigation-map="navigationMap"
          :is-loading="isLoading"
          @login="login"
          @setLayoutInfo="setLayoutInfo"
          @initSystemData="initSystemData"
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

    <NetworkView />

    <DevelopmentTest
      ref="developmentTestRef"
      v-if="isShowDevelopmentTest"
      :lang-map="langMap"
    />

  </ElConfigProvider>
</template>

<style lang="scss" scoped>
.is-disabled {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: var(--i-z-index-global-disabled);
  color: #ffffff00;
}
</style>
