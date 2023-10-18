<script setup lang="ts">
import type { Navigation } from '@/declare/routes'
import type { AuthData } from '@/stores/stores_api'

import MenuBreadcrumb from '@/components/layout/Menu/MenuBreadcrumb.vue'
import MenuHome from '@/components/layout/Menu/MenuHome.vue'
import MenuUser from '@/components/layout/Menu/MenuUser.vue'

import { computed } from 'vue'

const props = defineProps<{
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

const onChangeHistory = ($event: boolean) => {
  emit('changeHistory', $event)
}

</script>

<template>
  <div class="menu-wrapper">
    <div class="menu-left">
      <slot name="logo"></slot>
      <MenuBreadcrumb :breadcrumb-title="props.breadcrumbTitle" />
      <slot name="menu-left"></slot>
    </div>

    <div class="menu-right">
      <div class="menu-right-effect">
        <MenuHome />
      </div>
      <div class="menu-right-effect">
        <MenuUser
          :auth-data="props.authData"
          :history-is-open="props.historyIsOpen"
          @change-history="onChangeHistory"
          @logout="emit('logout')"
          @preferences="emit('preferences')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  &-wrapper {
    width: 100%;
    height: 64px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    font-size: 1.2em;

    background-color: lighten($system-bg-color, 5%);

    color: #ffffff;
  }

  &-left {
    width: 100%;
    height: fit-content;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &-right {
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 8px;

    &-effect {
      display: flex;
      justify-content: flex-start;
      width: fit-content;
      align-items: center;
      padding: 8px;
      gap: 8px;
      overflow: hidden;
      white-space: nowrap;

      transition-duration: 0.3s;
      color: #ffffff;

      &:hover {
        color: $warning;
      }
    }
  }
}
</style>
