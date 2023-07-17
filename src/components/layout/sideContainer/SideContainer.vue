<script setup lang="ts">
import type { Navigation } from '@/declare/routes'
import NavigationView from './NavigationView.vue'
import { CustomIcon } from '@/components'

const props = defineProps<{
  isOpen: boolean
  showRoutes: Navigation[]
  currentRouteName: string
  breadcrumbName: string[]
}>()

</script>

<template>
  <div class="side-container" :class="props.isOpen ? 'is-open': 'is-close'">
    <RouterLink
      to="/home"
      class="side-logo"
      v-slot="{ navigate }"
    >
      <div class="side-logo-navigate" @click="navigate">
        <CustomIcon name="home" class="side-logo-icon"/>
        <slot name="logo"></slot>
      </div>
    </RouterLink>

    <div class="side-nav">
      <NavigationView
        :level1-list="props.showRoutes"
        :current-route-name="props.currentRouteName"
        :breadcrumb-name="props.breadcrumbName"
      />
    </div>

    <div class="side-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side {
  &-container {
    width: 100%;
    min-width: $side-width;
    height: 100%;
    background-color: $system-bg-color;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    transition-duration: 0.3s;
    will-change: min-width;
    overflow: hidden;

    .side-logo,
    .side-footer {
      visibility: hidden;
    }

    &:hover.is-close {
      box-shadow: 1px 0px 20px 0px #707070;
    }

    &:hover,
    &.is-open {
      min-width: $nav-lg-width;

      @media (max-width: 768px) {
        min-width: $nav-md-width;
      }

      .side-logo,
      .side-footer {
        visibility: visible;
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