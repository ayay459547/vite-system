<script setup lang="ts">
import type { PropType, WritableComputedRef } from 'vue'
import { computed, nextTick, ref } from 'vue'

import type { Navigation } from '@/declare/routes'
import type { AuthData } from '@/declare/hook'
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'

import SideContent from './SideContent/SideContent.vue'
import HeaderContent from './HeaderContent/HeaderContent.vue'

const props = defineProps({
  isNavOpen: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  isNavHover: {
    type: Boolean as PropType<boolean>,
    default: false
  },
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

const emit = defineEmits(['logout', 'update:isNavOpen', 'preference'])

const tempIsOpen: WritableComputedRef<boolean> = computed({
  get() {
    return props.isNavOpen
  },
  set(value) {
    emit('update:isNavOpen', value)
  }
})

const sideRef = ref()

const init = async () => {
  await nextTick()

  sideRef.value?.init()
}

// 回首頁
const onRouterChange = async () => {
  await nextTick()
  sideRef.value.setOpen(false)
}

defineExpose({
  init
})

const onBreadCrumbClick = (targetRoutePath: string[]) => {
  if (targetRoutePath.length === 0) {
    tempIsOpen.value = false
    sideRef.value?.setOpen(false)
  }

  // level1 被點擊
  if (targetRoutePath.length === 1) {
    tempIsOpen.value = true
    sideRef.value?.setOpen(false)
    // level2 被點擊
  } else if (targetRoutePath.length === 2) {
    tempIsOpen.value = true
    sideRef.value?.breadCrumbSetLevel2(targetRoutePath)
    // level3 被點擊
  } else {
    tempIsOpen.value = true
    sideRef.value?.breadCrumbSetLevel2(targetRoutePath)
  }
}
</script>

<template>
  <div class="layout-wrapper">
    <div
      v-show="props.isShow"
      class="layout-left layout-side"
      :class="tempIsOpen ? 'is-open' : 'is-close'"
    >
      <SideContent
        ref="sideRef"
        v-model:isNavOpen="tempIsOpen"
        :isNavHover="props.isNavHover"
        :show-routes="props.showRoutes"
        :current-navigation="props.currentNavigation"
        :current-route-name="props.currentRouteName"
        @close="emit('update:isNavOpen', false)"
      >
        <template #logo="{ isShow }">
          <slot name="logo" :is-show="isShow"></slot>
        </template>
        <template #footer="{ isShow }">
          <slot name="menu-footer" :is-show="isShow"></slot>
        </template>
      </SideContent>
    </div>

    <div v-show="props.isShow" class="layout-right" :class="tempIsOpen ? 'is-open' : 'is-close'">
      <div class="layout-header">
        <HeaderContent
          v-model:is-open="tempIsOpen"
          :auth-data="props.authData"
          :breadcrumb-name="props.breadcrumbName"
          :breadcrumb-title="props.breadcrumbTitle"
          @logout="emit('logout')"
          @preference="emit('preference')"
          @router-change="onRouterChange"
          @set-router="onBreadCrumbClick"
        >
          <template #header-left>
            <slot name="header-left"></slot>
          </template>
          <template #header-right>
            <slot name="header-right"></slot>
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
    height: $header-heigth;
  }
  &-view {
    width: 100%;
    height: calc(100% - $header-heigth);
  }
}
</style>
