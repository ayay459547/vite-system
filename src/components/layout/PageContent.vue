<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { useRoute } from 'vue-router'

import type { Navigation } from '@/declare/routes'
import { scrollToEl } from '@/lib/lib_utils' // 工具

import { useRoutesStore } from '@/stores/stores_routes'

import Async_Skeleton from '@/views/Common/Async_Skeleton.vue'
// import Async_Error from '@/views/Common/Async_Error.vue'

const props = defineProps({
  isInitSystem: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  isIframe: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  currentNavigation: {
    type: Object as PropType<Navigation | null>,
    default: null
  },
  navigationMap: {
    type: Object as PropType<Map<string, Navigation>>,
    default: () => {
      return new Map()
    }
  }
})

const emit = defineEmits([
  'login',
  'setLayoutInfo',
  'initSystemData'
])

const pageScrollTop = () => {
  if (props.isIframe) return

  const el = document.querySelector('.__layout-scroll-top__')
  if (el) {
    scrollToEl(el, { behavior: 'auto' })
  }
}

const routesStore = useRoutesStore()
const {
  setBreadcrumbName,
  setBreadcrumbTitle,
  setCurrentNavigation
} = routesStore

const route = useRoute()
const routeName = computed<any>(() => {
  routeChange(route)
  return route?.name ?? ''
})

// 讀取當前路由變化 設置 麵包屑 + 當前路由
const routeChange = (currentRoute: RouteLocationNormalized) => {
  const { name } = props.currentNavigation ?? { name: '' }
  if ([null, undefined, name, 'login'].includes(currentRoute.name as string)) return

  const routeName = currentRoute.name as string

  if (routeName === 'locatehome') {
    setBreadcrumbName(['locatehome'])
    setBreadcrumbTitle(['首頁'])

    setCurrentNavigation(null)
  } else if (props.navigationMap.has(routeName)) {
    const currentRoute = props.navigationMap.get(routeName)
    const { breadcrumbName: _breadcrumbName, breadcrumbTitle: _breadcrumbTitle } = currentRoute
    // 麵包屑
    setBreadcrumbName(_breadcrumbName ?? [])
    setBreadcrumbTitle(_breadcrumbTitle ?? [])
    // 當前路由
    setCurrentNavigation(currentRoute)
  }

  setTimeout(() => {
    // 換頁時 scrollbar 移動到最上面
    pageScrollTop()
  }, 320)
}

const login = (userId: number) => {
  emit('login', userId)
}

const setLayoutInfo = () => {
  emit('setLayoutInfo')
}

const initSystemData = (routeName: string) => {
  emit('initSystemData', routeName)
}

</script>

<template>
  <div class="view-wrapper" :class="{'is-iframe': isIframe}">
    <main class="view-container">
      <!-- 滾動到最上方 -->
      <div class="view-scroll __layout-scroll-top__">{{ routeName }}</div>

      <!-- 頁面功能 -->
      <RouterView v-slot="{ Component, route }">
        <div v-if="!props.isInitSystem" class="view-init">
          <Async_Skeleton />
        </div>
        <component
          v-else-if="route.name === 'login'"
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
          @init-system="initSystemData('nodoc-21')"
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
  &-scroll {
    width: 100%;
    height: 0px;
    overflow: hidden;
  }
  &-init {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--i-z-index-login);
  }
}
</style>
