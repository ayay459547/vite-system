<script setup lang="ts">
import type { WritableComputedRef } from 'vue'
import { computed, nextTick, ref } from 'vue'

import type { Navigation } from '@/declare/routes'
import type { AuthData } from '@/declare/hook'
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'

import SideContent from './SideContent/SideContent.vue'
import HeaderContent from './HeaderContent/HeaderContent.vue'

const props = defineProps<{
  isOpen: boolean
  isShow: boolean

  showRoutes: Navigation[]
  currentNavigation: Navigation
  currentRouteName: CurrentRouteName

  historyIsOpen: boolean
  authData: AuthData
  breadcrumbName: string[]
  breadcrumbTitle: string[]
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'update:isOpen', value: boolean): void
  (e: 'historyChange', value: boolean): void
  (e: 'preference'): void
}>()

const tempIsOpen: WritableComputedRef<boolean> = computed({
  get () { return props.isOpen },
  set (value) {
    emit('update:isOpen', value)
  }
})

const onHistoryChange = (v: boolean) => {
  emit('historyChange', v)
}

const sideRef = ref()

const init = async () => {
  await nextTick()

  sideRef.value.init()
}

// 回首頁
const onRouterChange = async () => {
  await nextTick()
  sideRef.value.setOpen(false)
}

defineExpose({
  init
})

</script>

<template>
  <div class="layout-wrapper">
    <div
      v-show="props.isShow"
      class="layout-left layout-side"
      :class="tempIsOpen ? 'is-open': 'is-close'"
    >
      <SideContent
        ref="sideRef"
        v-model:is-open="tempIsOpen"
        :show-routes="props.showRoutes"
        :current-navigation="props.currentNavigation"
        :current-route-name="props.currentRouteName"
        @close="emit('update:isOpen', false)"
      >
        <template #logo="{ isShow }">
          <slot name="logo" :is-show="isShow"></slot>
        </template>
        <template #footer="{ isShow }">
          <slot name="menu-footer" :is-show="isShow"></slot>
        </template>
      </SideContent>
    </div>

    <div
      v-show="props.isShow"
      class="layout-right"
      :class="tempIsOpen ? 'is-open': 'is-close'"
    >
      <div class="layout-header">
        <HeaderContent
          v-model:is-open="tempIsOpen"
          :history-is-open="props.historyIsOpen"
          :auth-data="props.authData"
          :breadcrumb-name="props.breadcrumbName"
          :breadcrumb-title="props.breadcrumbTitle"
          @history-change="onHistoryChange"
          @logout="emit('logout')"
          @preference="emit('preference')"
          @router-change="onRouterChange"
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

    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
@import './Layout-1.scss';

.layout {
  &-wrapper {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    display: flex;
    position: relative;
  }

  &-left {
    z-index: $side-index;
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

    display: flex;
    flex-direction: column;
    overflow: auto;
    background-color: lighten($system-bg-color, 48%);
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
}
</style>
