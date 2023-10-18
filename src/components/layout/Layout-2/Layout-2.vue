<script setup lang="ts">
import MenuContent from './MenuContent.vue'

import type { Navigation } from '@/declare/routes'
import type { AuthData } from '@/stores/stores_api'

const props = defineProps<{
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
  (e: 'changeHistory', value: boolean): void
  (e: 'preferences'): void
}>()

const onChangeHistory = (v: boolean) => {
  emit('changeHistory', v)
}

</script>

<template>
  <div class="layout-wrapper">
    <div class="layout-menu">
      <MenuContent
        :show-routes="props.showRoutes"
        :current-route-name="props.currentRouteName"
        :breadcrumb-name="props.breadcrumbName"
        :history-is-open="props.historyIsOpen"
        :auth-data="props.authData"
        :breadcrumb-title="props.breadcrumbTitle"
        @change-history="onChangeHistory"
        @logout="emit('logout')"
        @preferences="emit('preferences')"
      >
        <template #logo>
          <slot name="logo"></slot>
        </template>
        <template #menu-left>
          <slot name="menu-left"></slot>
        </template>
        <template #menu-right>
          <slot name="menu-right"></slot>
        </template>
      </MenuContent>
    </div>
    <div class="layout-view">
      <slot name="content"></slot>
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
    flex-direction: column;
    position: relative;

    gap: 8px;
    background-color: lighten($system-bg-color, 60%);
  }

  &-menu {
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
