<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, nextTick, ref, onMounted } from 'vue'
// import type { RouteLocationNormalized } from 'vue-router'

import type { Navigation } from '@/declare/routes'
import type { AuthData } from '@/declare/hook' // 全域功能類型
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'
import { CustomDividerView } from '@/components' // 系統組件

import SideContent from './SideContent/SideContent.vue'
import HeaderContent from './HeaderContent/HeaderContent.vue'

const props = defineProps({
  isShow: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  showRoutes: {
    type: Array as PropType<Navigation[]>,
    default: () => {
      return []
    }
  },
  currentNavigation: {
    type: Object as PropType<Navigation>,
    default: () => {
      return {}
    }
  },
  currentRouteName: {
    type: Object as PropType<CurrentRouteName>,
    default: () => {
      return {
        level1: '',
        level2: '',
        level3: ''
      }
    }
  },
  authData: {
    type: Object as PropType<AuthData>,
    default: () => {
      return {
        user: {},
        role: {},
        roleFunction: [],
        groups: []
      } as AuthData
    }
  },
  breadcrumbName: {
    type: Array as PropType<string[]>,
    default: () => {
      return []
    }
  },
  breadcrumbTitle: {
    type: Array as PropType<string[]>,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits(['logout', 'preference'])

const sideRef = ref()

const init = async () => {
  await nextTick()

  sideRef.value?.init()
}

const onRouterChange = async () => {
  await nextTick()
  sideRef.value.setOpen(false)
}

defineExpose({
  init
})

const customDividerViewRef = ref(null)
let defaultLeftWidth = ref(350)
const setDefaultLeftWidth = (currentLeftWidth: number) => {
  defaultLeftWidth.value = currentLeftWidth
  customDividerViewRef.value?.initDefaultCenter()
}

const onBreadCrumbClick = (targetRoutePath: string[]) => {
  if (targetRoutePath.length === 0) {
    isNavOpen.value = false
    sideRef.value?.setOpen(false)
  }

  // level1 被點擊
  if (targetRoutePath.length === 1) {
    isNavOpen.value = true
    sideRef.value?.setOpen(false)
    // level2 被點擊
  } else if (targetRoutePath.length === 2) {
    isNavOpen.value = true
    sideRef.value?.breadCrumbSetLevel2(targetRoutePath)
    // level3 被點擊
  } else {
    isNavOpen.value = true
    sideRef.value?.breadCrumbSetLevel2(targetRoutePath)
  }
}

// 如果是另開視窗 將選單縮起來
// const setModalView = async (currentRoute: RouteLocationNormalized) => {
//   const isModal = currentRoute?.query?.isModal ?? 'false'

//   if (isModal === 'true') {
//     console.log()
//   }
// }

const _isNavOpen = ref('false')
const isNavOpen = computed({
  set: (isOpen: boolean) => {
    const temp = isOpen ? 'true' : 'false'
    _isNavOpen.value = temp
    localStorage.setItem('isNavOpen', temp)
  },
  get: () => {
    return _isNavOpen.value === 'true'
  }
})

let timeoutId: NodeJS.Timeout | null
const _isNavHover = ref('false')
const isNavHover = computed({
  set: (isHover: boolean) => {
    if (timeoutId) {
      clearInterval(timeoutId)
    }
    const temp = isHover ? 'true' : 'false'
    _isNavHover.value = temp
    localStorage.setItem('isNavHover', temp)

    // hover 一段時間 自動取消
    if (isHover) {
      timeoutId = setTimeout(() => {
        _isNavHover.value = 'false'
        localStorage.setItem('isNavHover', 'false')
      }, 2500)
    }
  },
  get: () => {
    return _isNavHover.value === 'true'
  }
})

onMounted(() => {
  const isNavOpenLocale = localStorage.getItem('isNavOpen')
  if ([null, undefined, ''].includes(isNavOpenLocale)) {
    localStorage.setItem('isNavOpen', 'false')
  }
  _isNavOpen.value = localStorage.getItem('isNavOpen')

  const isNavHoverLocale = localStorage.getItem('isNavHover')
  if ([null, undefined, ''].includes(isNavHoverLocale)) {
    localStorage.setItem('isNavHover', 'false')
  }
  _isNavHover.value = localStorage.getItem('isNavHover')
})

</script>

<template>
  <div class="layout-wrapper">
    <CustomDividerView
      ref="customDividerViewRef"
      v-show="props.isShow"
      :left-width="defaultLeftWidth"
      @change="setDefaultLeftWidth"
    >
      <template #left>
        <!-- 側邊選單 -->
        <div class="layout-left">
          <SideContent
            ref="sideRef"
            v-model:isNavOpen="isNavOpen"
            :isNavHover="isNavHover"
            :show-routes="props.showRoutes"
            :current-navigation="props.currentNavigation"
            :current-route-name="props.currentRouteName"
          >
            <template #logo="{ isOpen }">
              <slot name="logo" :is-open="isOpen"></slot>
            </template>
            <template #version="{ isOpen }">
              <slot name="version" :is-open="isOpen"></slot>
            </template>
          </SideContent>
        </div>
      </template>
      <template #right>
        <!-- header + view -->
        <div v-show="props.isShow" class="layout-right" :class="isNavOpen ? 'is-open' : 'is-close'">
          <div class="layout-header">
            <HeaderContent
              v-model:is-open="isNavOpen"
              :auth-data="props.authData"
              :breadcrumb-name="props.breadcrumbName"
              :breadcrumb-title="props.breadcrumbTitle"
              @logout="emit('logout')"
              @preference="emit('preference')"
              @router-change="onRouterChange"
              @set-router="onBreadCrumbClick"
            />
          </div>

          <div class="layout-view">
            <slot name="content"></slot>
          </div>
        </div>
      </template>
    </CustomDividerView>
  </div>
</template>

<style lang="scss" scoped>
$header-heigth: 48px;

.layout {
  &-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    background: inherit;
  }

  &-left,
  &-right {
    width: 100%;
    height: 100%;
    transition-duration: 0.3s;
    will-change: width;
    overflow: hidden;
  }
  &-header {
    width: 100%;
    height: $header-heigth;
  }
  &-view {
    width: 100%;
    height: calc(100% - $header-heigth);
  }
}
</style>
