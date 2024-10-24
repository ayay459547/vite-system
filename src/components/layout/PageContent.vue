<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, computed, onBeforeMount } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { useRoute } from 'vue-router'

import { useEventBus } from '@/lib/lib_hook' // 自訂Composition API
import { scrollToEl } from '@/lib/lib_utils' // 工具

import Async_Skeleton from '@/views/Common/Async_Skeleton.vue'

const props = defineProps({
  isIframe: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const emit = defineEmits([
  'routeChange',
  'login',
  'setLayoutInfo',
  'initNavigationRoutes'
])

const pageScrollTop = () => {
  if (props.isIframe) return

  const el = document.querySelector('.__layout-scroll-top__')
  if (el) {
    scrollToEl(el, { behavior: 'auto' })
  }
}

// 切換頁面 打開遮罩
// 暫時不行點擊任何東西
const isDisabled = ref(false)
let disabledTimeoutId: NodeJS.Timeout | null
let loadingTimeoutId: NodeJS.Timeout | null

const _isLoading = ref(false)
const isLoading = computed({
  set (v: boolean) {
    if (disabledTimeoutId) {
      clearInterval(disabledTimeoutId)
    }
    if (loadingTimeoutId) {
      clearInterval(loadingTimeoutId)
    }
    _isLoading.value = v
    isDisabled.value = v

    // isDisabled 一段時間 自動關閉
    if (v) {
      disabledTimeoutId = setTimeout(() => {
        isDisabled.value = false
      }, 320)
    }
    // _isLoading 一段時間 自動關閉
    if (v) {
      loadingTimeoutId = setTimeout(() => {
        _isLoading.value = false
      }, 4800)
    }
  },
  get () {
    return _isLoading.value
  }
})

const routeChange = (currentRoute: RouteLocationNormalized) => {
  emit('routeChange', currentRoute)

  setTimeout(() => {
    // 換頁時 scrollbar 移動到最上面
    pageScrollTop()

    isLoading.value = false
  }, 320)
}

const route = useRoute()
const routeName = computed<any>(() => {
  routeChange(route)
  return route?.name ?? ''
})

const routerBus = useEventBus<string>('router')
const routerBusListener = (event: string) => {
  switch (event) {
    case 'busRouterChange':
      isLoading.value = true
      break
  }
}
onBeforeMount(() => {
  routerBus.on(routerBusListener)
})

const login = (userId: number) => {
  routerBus.on(routerBusListener)
  emit('login', userId)
}

defineExpose({
  busOn () {
    // 開啟 EventBus 監聽
    routerBus.on(routerBusListener)
  },
  busOff () {
    // 移除 EventBus 監聽
    routerBus.off(routerBusListener)
  }
})

const setLayoutInfo = () => {
  emit('setLayoutInfo')
}

const initNavigationRoutes = (routeName: string) => {
  emit('initNavigationRoutes', routeName)
}

</script>

<template>
  <div class="view-wrapper" :class="{'is-iframe': isIframe}">
    <!-- 路由切換時 開啟遮罩(使用者看不到) 不能點任何東西 -->
    <div v-show="isDisabled" class="is-disabled">{{ routeName }}</div>
    <main v-loading="isLoading" class="view-container">
      <!-- 滾動到最上方 -->
      <div class="__layout-scroll-top__"></div>

      <!-- 頁面功能 -->
      <Suspense>
        <template #default>
          <RouterView v-slot="{ Component, route }">
            <component
              v-if="route.name === 'login'"
              key="login"
              :is="Component"
              @login="login"
            />
            <component
              v-else-if="route.name === 'locatehome'"
              key="locatehome"
              :is="Component"
              @router-change="setLayoutInfo"
            />
            <component
              v-else-if="route.name === 'nodoc-21'"
              key="nodoc-21"
              :is="Component"
              @init-system="initNavigationRoutes('nodoc-21')"
            />
            <template v-else>
              <KeepAlive>
                <component
                  v-if="(route?.meta?.keepAlive ?? false)"
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
          </RouterView>
        </template>
        <template #fallback>
          <Async_Skeleton />
        </template>
      </Suspense>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.view {
  &-wrapper {
    width: 100%;
    height: 100%;
    padding: 2px 12px 8px;

    &.is-iframe {
      padding: 0;
    }
  }
  &-container {
    width: 100%;
    height: 100%;
    flex: 1;
    border-radius: 6px;
    background-color: var(--i-color-system-page);
    box-sizing: border-box;
    position: relative;
    overflow: auto;
  }
}

.is-disabled {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: var(--i-z-index-global-disabled);
  color: #ffffff00;
}
</style>
