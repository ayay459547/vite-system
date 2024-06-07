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
import { useEventBus } from '@vueuse/core'

import {
  aesDecrypt,
  swal,
  notification,
  message,
  isEmpty,
  scrollToEl,
  tipLog,
  awaitTime
} from '@/lib/lib_utils'

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
import { storeToRefs } from 'pinia'

import type { RouteLocationNormalized } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'

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

// 切換頁面 打開遮罩
// 暫時不行點擊任何東西
const isDisabled = ref(false)
let timeoutId: NodeJS.Timeout | null
const _isLoading = ref(false)
const isLoading = computed({
  set (v: boolean) {
    if (timeoutId) {
      clearInterval(timeoutId)
    }
    _isLoading.value = v
    isDisabled.value = v

    // mask 一段時間 自動關閉
    if (v) {
      timeoutId = setTimeout(() => {
        isDisabled.value = false
      }, 300)
    }
  },
  get () {
    return _isLoading.value
  }
})

const bus = useEventBus<string>('routerChange')
const listener = (event: string) => {
  switch (event) {
    case 'routerChange':
      isLoading.value = true
      break
  }
}
bus.on(listener)

// 路由更換時執行
const onRouteChange = async (currentRoute: RouteLocationNormalized) => {
  bus.emit('routerChange')
  pageScrollTop()

  const { name } = currentNavigation?.value ?? { name: '' }
  if ([null, undefined, name, 'login'].includes(currentRoute.name as string)) return

  setNavigationData(currentRoute)
  await awaitTime(12)

  // 設定翻譯模組
  // setModuleType(i18nModule)
  // 設定網頁資訊
  setWebInfo()
  // 設定是否為 modal 模式
  setModalView(currentRoute)

  isLoading.value = false
  setTimeout(() => {
    updateToken()
  }, 2400)
}

const route = useRoute()
const routeName = computed<any>(() => {
  onRouteChange(route)
  return route?.name ?? ''
})

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
    systemLayoutRef.value?.setModalView()
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
    const { breadcrumbName: _breadcrumbName, breadcrumbTitle: _breadcrumbTitle } = currentRoute
    // 麵包屑
    setBreadcrumbName(_breadcrumbName ?? [])
    setBreadcrumbTitle(_breadcrumbTitle ?? [])
    // 當前路由
    setCurrentNavigation(currentRoute)
    // 歷史路由
    if (isHistoryOpen.value) {
      setTimeout(() => {
        addHistoryNavigation(routeName, currentRoute)
      }, 800)
    }
  }
}

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
  }

  setNavigationRoutes(routesPermission.value)

  await nextTick()
  loading(false, 'loading')

  await awaitTime(24)
  if (!isEmpty(routeName)) {
    router.push({ name: routeName })
  }
  layoutIsShow.value = true

  // 給 240 毫秒 確保路由跳轉完成後 才執行
  await nextTick()
  await awaitTime(240)
  setLayoutInfo()
}

onBeforeMount(() => {
  initNavigationRoutes()
})

onMounted(() => {
  loading(true, i18nTranslate('systemInitialization', defaultModuleType))
})

// 路由切換
const setLayoutInfo = async () => {
  await nextTick()
  await awaitTime(480)
  systemLayoutRef.value.init()
}

// 登出
const logout = async () => {
  await nextTick()
  loading(true, i18nTranslate('logout', defaultModuleType))

  clearToken()
  removeCookie('loginTime')
  initNavigationRoutes('login')

  // 移除 EventBus 監聽
  bus.off(listener)
}
// 登入
const login = async (userId: number) => {
  await nextTick()
  loading(true, i18nTranslate('login', defaultModuleType))

  const loginTime = datetimeFormat(new Date(), 'YYYY-MM-DD_HH:mm:ss')
  setCookie('loginTime', loginTime)
  setToken(userId, loginTime)
  initNavigationRoutes('locatehome')

  // 開啟 EventBus 監聽
  bus.on(listener)
}

// 歷史路由
const isHistoryOpen = ref(false)
const historyShowChange = (v: boolean) => (isHistoryOpen.value = v)

onMounted(() => {
  const _isHistoryOpen = localStorage.getItem('isHistoryOpen')
  isHistoryOpen.value = _isHistoryOpen === 'true'
})

// 向下傳送常用工具
provide<UseHook>('useHook', options => {
  const { i18nModule } = options ?? {}

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
        const pagePermission = [userPermission?.permission, defaultPermission, 0].find(
          _permission => typeof _permission === 'number'
        )

        const _pagePermission = getPermission(pagePermission)
        tipLog(`${routeName} 權限`, [routeName, _pagePermission])

        return _pagePermission
      }

      const { permission = 0 } = currentNavigation?.value ?? {}
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
      const fromQuery = route.query ?? {}
      const [fromPage = '', fromData = ''] = [
        Array.isArray(fromQuery.from) ? fromQuery.from.join(',') : fromQuery.from,
        Array.isArray(fromQuery.data) ? fromQuery.data.join(',') : fromQuery.data
      ]
      const queryData = isEmpty(fromData)
        ? ''
        : aesDecrypt(fromData as string, systemEnv.value.QUERY_KEY)

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
      :is-history-open="isHistoryOpen"
      :auth-data="authData"
      :breadcrumb-title="breadcrumbTitle"
      @logout="logout"
      @lang-change="setWebInfo"
      @history-show-change="historyShowChange"
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
        <PageContent :is-history-open="isHistoryOpen">
          <template #tabs>
            <NavigationTabs
              v-if="isHistoryOpen"
              :history-navigation="historyNavigation"
              :current-navigation="currentNavigation"
              @router-change="setLayoutInfo"
            />
          </template>

          <div v-loading="isLoading" class="layout-mask">
            <div class="__layout-scroll-top__"></div>
            <RouterView v-slot="{ Component, route }">
              <component v-if="route.name === 'login'" key="login" :is="Component" @login="login" />
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
              <!-- <div style="display: none;">{{ throttleOnRouteChange(route) }}</div> -->
            </RouterView>
          </div>
        </PageContent>
      </template>

      <!-- 路由切換時 開啟遮罩(使用者看不到) 不能點任何東西 -->
      <div v-show="isDisabled" class="is-disabled">
        <span class="hidden-text">{{ routeName }}</span>
      </div>
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
