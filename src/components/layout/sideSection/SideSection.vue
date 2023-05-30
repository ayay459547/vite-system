<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import type { Navigation } from '@/declare/routes'
import NavigationView from './NavigationView.vue'
import { useRoutesStore } from '@/stores/routes'
import { CustomIcon } from '@/components'

const routesStore = useRoutesStore()

const level1Routes: ComputedRef<Navigation[]> = computed(() => {
  return routesStore.navigationRoutes
})

const showRoutes: typeof level1Routes = computed(() => {
  return level1Routes.value.map(route => {
    return {
      ...route
    }
  })
})

</script>

<template>
  <div class="side-container">
    <RouterLink
      to="/home"
      class="side-logo"
      v-slot="{ navigate }"
    >
      <div class="side-logo-navigate" @click="navigate">
        <CustomIcon name="home" class="side-logo-icon"/>
        <slot name="logo">
          <div>LOGO</div>
        </slot>
      </div>
    </RouterLink>

    <div class="side-nav">
      <NavigationView :router="showRoutes"></NavigationView>
    </div>

    <div class="side-footer">
      <slot name="footer">
        <div>FOOTER</div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side {
  &-container {
    width: $nav-lg-width;
    height: 100%;
    background-color: $system-bg-color;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    transition-duration: 0.3s;
    will-change: width, margin-left;

    @media (max-width: 992px) {
      width: $nav-md-width;
    }
    @media (max-width: 576px) {
      width: $nav-xs-width;
      margin-left: -8px;

      .side-logo,
      .side-footer {
        visibility: hidden;
      }

      &:hover {
        width: $nav-md-width;
        margin-left: 0;

        .side-logo,
        .side-footer {
          visibility: visible;
        }
      }
    }
  }

  &-logo {
    color: #fff;
    transition-duration: 0.3s;

    &-navigate {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-evenly;
      white-space: nowrap;
      font-size: 2em;
      padding: 16px 0;
      cursor: pointer;
    }
    &-icon {
      font-size: 1em !important;
    }

    &:hover {
      color: $warning;
    }
  }

  &-nav {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &-footer {
    border-radius: 6px;
    padding: 6px 12px;
    margin: 6px;
    background-color: #e6e6e6;
    white-space: nowrap;
  }
}

</style>