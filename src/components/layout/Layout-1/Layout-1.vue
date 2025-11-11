<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, nextTick, ref, onMounted } from 'vue'
// import type { RouteLocationNormalized } from 'vue-router'

import type { Navigation } from '@/types/types_routes'
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'
import { setLocalStorage, getLocalStorage } from '@/lib/lib_storage'
import { isEmpty } from '@/lib/lib_utils'

import SideContent from './SideContent/SideContent.vue'
import HeaderContent from './HeaderContent.vue'

const props = defineProps({
  showRoutes: {
    type: Array as PropType<Navigation[]>,
    default: () => []
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
  }
})

const SideContentRef = ref<InstanceType<typeof SideContent>>()

const init = async () => {
  await nextTick()
  if (isEmpty(props.currentNavigation)) return
  SideContentRef.value?.init()
}

const onRouterChange = async () => {
  await nextTick()
  SideContentRef.value?.setOpen(false)
}

defineExpose({
  init
})

const onBreadCrumbClick = (targetRoutePath: string[]) => {
  if (targetRoutePath.length === 0) {
    isNavOpen.value = false
    SideContentRef.value?.setOpen(false)
  }

  // level1 被點擊
  if (targetRoutePath.length === 1) {
    isNavOpen.value = true
    SideContentRef.value?.setOpen(false)
    // level2 被點擊
  } else if (targetRoutePath.length === 2) {
    isNavOpen.value = true
    SideContentRef.value?.breadCrumbSetLevel2(targetRoutePath)
    // level3 被點擊
  } else {
    isNavOpen.value = true
    SideContentRef.value?.breadCrumbSetLevel2(targetRoutePath)
  }
}

const _isNavOpen = ref('false')
const isNavOpen = computed({
  set: (isOpen: boolean) => {
    const temp = isOpen ? 'true' : 'false'
    _isNavOpen.value = temp
    setLocalStorage('isNavOpen', temp)
  },
  get: () => {
    return _isNavOpen.value === 'true'
  }
})

let timeoutId: number | undefined
const _isNavHover = ref('false')
const isNavHover = computed({
  set: (isHover: boolean) => {
    if (timeoutId) {
      clearInterval(timeoutId)
    }
    const temp = isHover ? 'true' : 'false'
    _isNavHover.value = temp
    setLocalStorage('isNavHover', temp)

    // hover 一段時間 自動取消
    if (isHover) {
      timeoutId = setTimeout(() => {
        _isNavHover.value = 'false'
        setLocalStorage('isNavHover', 'false')
      }, 2500)
    }
  },
  get: () => {
    return _isNavHover.value === 'true'
  }
})

onMounted(() => {
  const isNavOpenLocale = getLocalStorage('isNavOpen')
  if ([null, undefined, ''].includes(isNavOpenLocale)) {
    setLocalStorage('isNavOpen', 'false')
  }
  _isNavOpen.value = getLocalStorage('isNavOpen') ?? ''

  const isNavHoverLocale = getLocalStorage('isNavHover')
  if ([null, undefined, ''].includes(isNavHoverLocale)) {
    setLocalStorage('isNavHover', 'false')
  }
  _isNavHover.value = getLocalStorage('isNavHover') ?? ''
})

</script>

<template>
  <div class="layout-wrapper">
    <div
      class="layout-left layout-side"
      :class="isNavOpen ? 'is-open' : 'is-close'"
    >
      <SideContent
        ref="SideContentRef"
        v-model:isNavOpen="isNavOpen"
        :isNavHover="isNavHover"
        :show-routes="props.showRoutes"
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

    <div class="layout-right" :class="isNavOpen ? 'is-open' : 'is-close'">
      <div class="layout-header">
        <HeaderContent
          v-model:is-open="isNavOpen"
          @router-change="onRouterChange"
          @set-router="onBreadCrumbClick"
        >
          <template #MenuUser>
            <slot name="MenuUser"></slot>
          </template>
        </HeaderContent>
      </div>

      <div class="layout-view">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './Layout-1.scss' as *;

.layout {
  &-wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    position: relative;
    background: inherit;
  }

  &-left {
    z-index: var(--i-z-index-side);
    height: 100%;
    transition-duration: 0.3s;
    will-change: width;
    position: absolute;
    top: 0;

    // 小螢幕 只移動不改變寬度
    &.is-close {
      left: -$nav-width;
      width: $nav-width;
    }
    &.is-open {
      left: 0;
      width: $nav-width;
    }
    // 大螢幕 指改變寬度
    @media (min-width: 992px) {
      &.is-close {
        left: 0;
        width: $side-width;
      }
      &.is-open {
        left: 0;
        width: $nav-width;
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
      width: 100%;
      left: 0;
    }

    // 至少要 992px 才可以定住選單
    @media (min-width: 992px) {
      &.is-close {
        width: calc(100% - $side-width);
        left: $side-width;
      }

      &.is-open {
        width: calc(100% - $nav-width);
        left: $nav-width;
      }
    }

    & {
      overflow: hidden;
    }
  }
  &-header {
    width: 100%;
    height: 48px;
    @media (max-width: 992px) {
      height: 40px;
    }
  }
  &-view {
    width: 100%;
    height: calc(100% - 48px);
    @media (max-width: 992px) {
      height: calc(100% - 40px);
    }
  }
}
</style>
