<script setup lang="ts">
import type { Navigation } from '@/declare/routes'
import type { AuthData } from '@/stores/api'

import MenuBreadcrumb from '@/components/layout/Menu/MenuBreadcrumb.vue'
import MenuRouter from '@/components/layout/Menu/MenuRouter.vue'
import MenuHome from '@/components/layout/Menu/MenuHome.vue'
import MenuUser from '@/components/layout/Menu/MenuUser.vue'

import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'

const props = defineProps<{
  showRoutes: Navigation[]
  currentNavigation: Navigation
  currentRouteName: CurrentRouteName

  historyIsOpen: boolean
  authData: AuthData
  breadcrumbTitle: string[]
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'changeHistory', value: boolean): void
  (e: 'preferences'): void
  (e: 'setLevel2Router', level2List: Navigation): void
  (e: 'changeRouter'): void
}>()

const onChangeHistory = ($event: boolean) => {
  emit('changeHistory', $event)
}

const setLevel2Router = (level2Router: Navigation) => {
  emit('setLevel2Router', level2Router)
}

const onChangeRouter = () => {
  emit('changeRouter')
}

</script>

<template>
  <div class="menu-container">
    <div class="menu-left">
      <slot name="logo"></slot>
      <div class="menu-left-effect">
        <MenuRouter
          :show-routes="showRoutes"
          :current-navigation="currentNavigation"
          :current-route-name="props.currentRouteName"
          @set-level2-router="setLevel2Router"
        />
      </div>
      <slot name="menu-left"></slot>
    </div>

    <div class="menu-center">
      <MenuBreadcrumb :breadcrumb-title="props.breadcrumbTitle" text-align="end"/>
    </div>

    <div class="menu-right">
      <div class="menu-right-effect">
        <MenuHome @change-router="onChangeRouter"/>
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
  &-container {
    width: 100%;
    height: 56px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    font-size: 1.2em;

    background-color: lighten($system-bg-color, 5%);

    color: #ffffff;
  }

  &-left {
    display: flex;
    align-items: center;
    height: fit-content;
    gap: 8px;

    &-effect {
      width: fit-content;
      display: flex;
      align-items: center;
    }
  }

  &-center {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 24px;
  }

  &-right {
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 8px;

    &-effect {
      display: flex;
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
