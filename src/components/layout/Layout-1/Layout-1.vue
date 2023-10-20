<script setup lang="ts">
import type { WritableComputedRef } from 'vue'
import { computed } from 'vue'

import type { Navigation } from '@/declare/routes'
import SideContent from './SideContent/SideContent.vue'
import type { AuthData } from '@/stores/stores_api'
import HeaderContent from './HeaderContent/HeaderContent.vue'

const props = defineProps<{
  isOpen: boolean
  isShow: boolean

  showRoutes: Navigation[]
  currentRouteName: string
  breadcrumbName: string[]

  historyIsOpen: boolean
  authData: AuthData
  breadcrumbTitle: string[]
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'update:isOpen', value: boolean): void
  (e: 'changeHistory', value: boolean): void
  (e: 'preferences'): void
}>()

const tempIsOpen: WritableComputedRef<boolean> = computed({
  get () { return props.isOpen },
  set (value) {
    emit('update:isOpen', value)
  }
})

const onChangeHistory = (v: boolean) => {
  emit('changeHistory', v)
}

const init = () => {
  console.log('layout1 init')
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
        v-model:is-open="tempIsOpen"
        :show-routes="props.showRoutes"
        :current-route-name="props.currentRouteName"
        :breadcrumb-name="props.breadcrumbName"
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
          :breadcrumb-title="props.breadcrumbTitle"
          @change-history="onChangeHistory"
          @logout="emit('logout')"
          @preferences="emit('preferences')"
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
    left: 0;
    top: 0;

    &.is-close,
    &.is-open {
      width: $side-width;
    }
    // 至少要 992px 才可以定住選單
    @media (min-width: 992px) {
      &.is-open {
        width: $nav-lg-width;
        @media (max-width: 768px) {
          width: $nav-md-width;
        }
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
      width: calc(100% - $side-width);
      left: $side-width;
    }

    // 至少要 992px 才可以定住選單
    @media (min-width: 992px) {
      &.is-open {
        width: calc(100% - $nav-lg-width);
        left: $nav-lg-width;

        @media (max-width: 768px) {
          width: calc(100% - $nav-md-width);
          left: $nav-md-width;
        }
      }
    }

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
}
</style>
