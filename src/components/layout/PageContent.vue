<script setup lang="ts">
import type { PropType, VNode } from 'vue'
import { inject, nextTick, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import type { Navigation } from '@/declare/routes'
import { scrollToEl, hasOwnProperty } from '@/lib/lib_utils' // 工具
import { useEventBus } from '@/lib/lib_hook' // 自訂Composition API

import { useRoutesStore } from '@/stores/stores_routes'
import { defaultModuleType } from '@/i18n/i18n_setting'

import Async_Skeleton from '@/views/Common/Async_Skeleton.vue'
// import Async_Error from '@/views/Common/Async_Error.vue'

const useHook: UseHook = inject('useHook')
const { i18nTest, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps({
  isInitSystem: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  systemName: {
    type: String as PropType<string>,
    default: ''
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
  },
  isLoading: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const emit = defineEmits([
  'login',
  'setLayoutInfo',
  'initSystemData'
])

const pageScrollTop = () => {
  const el = document.querySelector('.__layout-scroll-top__')
  if (el) {
    scrollToEl(el, { behavior: 'auto' })
  }
}

/**
 * 設定網頁 title 優先順序
 * 1. i18n Excel 中 views 的名稱
 * 2. router 設定的 title
 * 3. 系統名稱
 */
 const setWebTitle = async () => {
  await nextTick()
  const currentTitle = (currentNavigation => {
    if (currentNavigation) {
      const {
        name,
        title,
        breadcrumbName,
        breadcrumbTitle
      } = currentNavigation

      const [name1, name2, name3] = breadcrumbName
      const [title1, title2, title3] = breadcrumbTitle

      // nav2 / nav3
      if(
        name1 && name2 && name3 &&
        title1 && title2 && title3
      ) {
        if (i18nTest(breadcrumbName)) {
          return [name2, name3].map(_name => {
            return i18nTranslate(_name, defaultModuleType)
          }).join(' / ')
        } else {
          return [title2, title3].join(' / ')
        }
      }

      // nav1 或 nav2 或 nav3
      if (i18nTest(name)) {
        return i18nTranslate(name, defaultModuleType)
      }

      if (title ?? false) return title
    }

    return props.systemName
  })(props.currentNavigation)

  document.title = currentTitle
}

const i18nBus = useEventBus<string>('i18n')
const i18nBusListener = (event: string) => {
  // 變更語言 設定網頁 title
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

const routesStore = useRoutesStore()
const {
  setBreadcrumbName, // 麵包屑(翻譯)
  setBreadcrumbTitle, // 麵包屑 沒有對應翻譯使用
  setCurrentNavigation // 設定當前路由
} = routesStore

// 當前路由
const route = useRoute()
const defaultRouter = {
  locatehome: '首頁',
  login: '登入'
}
const routeChange = () => {
  const { name } = props.currentNavigation ?? { name: '' }
  const routeName = route.name as string
  if ([null, undefined, name].includes(routeName as string)) return

  if (hasOwnProperty(defaultRouter, routeName)) {
    setBreadcrumbName([routeName])
    setBreadcrumbTitle([defaultRouter[routeName]])
    setCurrentNavigation(null)

  } else if (props.navigationMap.has(routeName)) {
    const currentRoute = props.navigationMap.get(routeName)
    const { breadcrumbName, breadcrumbTitle } = currentRoute

    setBreadcrumbName(breadcrumbName ?? [])
    setBreadcrumbTitle(breadcrumbTitle ?? [])
    setCurrentNavigation(currentRoute)
  }

  // 切換路由 設定網頁 title
  setTimeout(() => {
    setWebTitle()
  }, 80)

  // 換頁時 scrollbar 移動到最上面
  setTimeout(() => {
    pageScrollTop()
  }, 320)
}

const routerBus = useEventBus<string>('router')
const onVnodeMounted = (vNode: VNode) => {
  routerBus.emit('routerChange', vNode.key)

  setTimeout(() => {
    routeChange()
  }, 300)
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
  <div v-loading="props.isLoading" class="view-wrapper" :class="{'is-iframe': isIframe}">
    <main class="view-container">
      <!-- 滾動到最上方 -->
      <div class="view-scroll __layout-scroll-top__"></div>

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
          @vue:mounted="onVnodeMounted"
        />
        <component
          v-else-if="route.name === 'locatehome'"
          key="locatehome"
          :is="Component"
          @router-change="setLayoutInfo"
          @vue:mounted="onVnodeMounted"
        />
        <component
          v-else-if="route.name === 'nodoc-21'"
          key="nodoc-21"
          :is="Component"
          @init-system="initSystemData('nodoc-21')"
          @vue:mounted="onVnodeMounted"
        />
        <template v-else>
          <KeepAlive>
            <component
              v-if="(route?.meta?.keepAlive ?? false)"
              :key="route.name"
              :is="Component"
              @vue:mounted="onVnodeMounted"
            />
          </KeepAlive>
          <component
            v-if="!(route?.meta?.keepAlive ?? false)"
            :key="route.name"
            :is="Component"
            @vue:mounted="onVnodeMounted"
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
