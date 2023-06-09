<script setup lang="ts">
import type { Ref } from 'vue'
import {
  ref,
  reactive,
  computed,
  provide,
  onMounted,
  onBeforeMount,
  nextTick
} from 'vue'
// layout
import SideSection from '@/components/layout/sideSection/SideSection.vue'
import HeaderSection from '@/components/layout/headerSection/HeaderSection.vue'
import PageSection from '@/components/layout/pageSection/PageSection.vue'

// element ui plus config
import { ElConfigProvider } from 'element-plus'

// locale
import { useLocaleStore } from '@/stores/locale'

// system init
import { useAuthStore } from '@/stores/auth'
import { useRoutesStore } from '@/stores/routes'
import { useEnvStore } from '@/stores/env'
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

const navIsOpen = ref(true)
const historyIsOpen = ref(true)
const changeHistory = (v: boolean) => {
  historyIsOpen.value = v
}

const localeStore = useLocaleStore()
const locale = computed(() => {
  return localeStore.locale
})

// hook
const {
  t,
  te // 測試 key 是否存在
} = useI18n()

const customLoader: Ref<InstanceType<typeof HookLoader> | null> = ref(null)
const customPopover: Ref<InstanceType<typeof HookPopover> | null> = ref(null)

const queueId = ref(0)
const customPopoverQueue: CustomPopoverQueue[] = reactive([])
const deleteCustomPopoverQueue = () => {
  customPopoverQueue.pop()
}

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
    eventList: (click, eventList, options) => {
      const { clientX, clientY } = click

      customPopoverQueue.unshift({
        queueId: queueId.value,
        clientX, clientY, eventList, options
      })
      queueId.value++
    },
    i18nTranslate: (key) => {
      return `${t(key)}`
      // if (te(key)) return t(key)
      // return `N/A[${t(key)}]`
    },
    i18nTest: (key) => {
      return te(key)
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

      return Swal.fire({
        ...defaultOPtions
      })
    }
  }
})


// 路由更換時執行
const envStore = useEnvStore()
const onRouteChange = (currentRoute: RouteLocationNormalized) => {
  if ([null, undefined, 'login'].includes(currentRoute.name as string)) return

  nextTick(() => {
    const currentTitle = currentRoute.meta?.title ?? envStore.system
    document.title = currentTitle
  })

  setModalView(currentRoute)
  setLoading(currentRoute)
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

// 系統初始化
const isShow = ref(false)
const router = useRouter()

const authStore = useAuthStore()
const { setToken, clearToken, initSystemData } = authStore
const { authData, routesPermission } = storeToRefs(authStore)

const { setNavigationRoutes } = useRoutesStore()

/**
 * 初始化系統使用者 + 權限
 * 用權限 設置路由選項
 */
 const initNavigationRoutes = async () => {
  isShow.value = false

  await initSystemData()

  setNavigationRoutes(routesPermission.value)
  router.push({ name: 'home' })

  await nextTick()
  isShow.value = true
  loading(false, 'loading')
}

onBeforeMount(() => {
  initNavigationRoutes()
})

onMounted(() => {
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
    <div class="layout-wrapper">
      <div
        v-show="isShow"
        class="layout-left layout-side"
        :class="navIsOpen ? 'is-open': 'is-close'"
      >
        <SideSection>
          <template #logo>
            <slot name="logo">
              <div>LOGO</div>
            </slot>
          </template>
          <template #footer>
            <slot name="footer">
              <div>FOOTER</div>
            </slot>
          </template>
        </SideSection>
      </div>

      <div v-show="isShow" class="layout-right">
        <div class="layout-header">
          <HeaderSection
            v-model:isOpen="navIsOpen"
            :history-is-open="historyIsOpen"
            :auth-data="authData"
            @change-history="changeHistory"
            @logout="logout"
          />
        </div>
        <div class="layout-view">
          <PageSection :history-is-open="historyIsOpen">
            <div v-loading="isLoading" class="layout-mask">
              <RouterView v-slot="{ Component, route }">
                <KeepAlive>
                  <component
                    v-if="route.meta.keepAlive"
                    :key="route.name"
                    :is="Component"
                  />
                </KeepAlive>
                <component
                  v-if="!route.meta.keepAlive"
                  :key="route.name"
                  :is="Component"
                  @login="login"
                />

                <div style="display: none;">{{ onRouteChange(route) }}</div>
              </RouterView>
            </div>
          </PageSection>
        </div>
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
    </div>
  </ElConfigProvider>
</template>

<style lang="scss" scoped>
.layout {
  &-wrapper {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    display: flex;
  }

  &-left {
    width: fit-content;
    height: 100%;
    transition-duration: 0.3s;
    will-change: margin-left;
    &.is-open {
      margin-left: 0;
    }
    &.is-close {
      margin-left: -$nav-lg-width;

      @media (max-width: 992px) {
        margin-left: -$nav-md-width;
      }
      @media (max-width: 576px) {
        margin-left: -$nav-xs-width;
      }
    }
  }

  &-right {
    flex: 1;
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
