<script setup lang="ts">
import type { Navigation } from '@/declare/routes'
import NavigationView from './NavigationView.vue'

const props = defineProps<{
  isOpen: boolean
  showRoutes: Navigation[]
  currentRouteName: string
  breadcrumbName: string[]
}>()

</script>

<template>
  <div class="side-container" :class="props.isOpen ? 'is-open': 'is-close'">
    <div class="side-logo">
      <div class="side-logo-navigate open">
        <slot name="header" :is-show="true"></slot>
      </div>
      <div class="side-logo-navigate close">
        <slot name="header" :is-show="false"></slot>
      </div>
    </div>

    <div class="side-nav">
      <NavigationView
        :level1-list="props.showRoutes"
        :current-route-name="props.currentRouteName"
        :breadcrumb-name="props.breadcrumbName"
      />
    </div>

    <div class="side-footer">
      <div class="side-footer-navigate open">
        <slot name="footer" :is-show="true"></slot>
      </div>
      <div class="side-footer-navigate close">
        <slot name="footer" :is-show="false"></slot>
      </div>
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

    .side-logo .open,
    .side-footer .open {
      display: none;
    }

    .side-logo .close,
    .side-footer .close {
      display: block;
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

      .side-logo .open,
      .side-footer .open {
        display: block;
      }

      .side-logo .close,
      .side-footer .close {
        display: none;
      }
    }
  }

  &-logo,
  &-footer {
    color: #fff;
    transition-duration: 0.3s;
    width: 100%;

    &-navigate {
      display: flex;
      align-items: center;
      white-space: nowrap;
      cursor: default;
    }
  }

  &-nav {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}

</style>