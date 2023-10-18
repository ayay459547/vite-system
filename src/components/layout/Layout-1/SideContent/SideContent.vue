<script setup lang="ts">
import type { Navigation } from '@/declare/routes'
import NavigationView from './NavigationView.vue'
import { CustomIcon } from '@/components'
import { computed } from 'vue'

const props = defineProps<{
  isOpen: boolean
  showRoutes: Navigation[]
  currentRouteName: string
  breadcrumbName: string[]
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()

const tempIsOpen = computed<boolean>({
  get () { return props.isOpen },
  set (value) {
    localStorage.setItem('navIsOpen', `${value}`)
    emit('update:isOpen', value)
  }
})

</script>

<template>
  <div class="side-container" :class="tempIsOpen ? 'is-open': 'is-close'">
    <div class="side-logo">
      <div class="side-logo-navigate open">
        <slot name="logo" :is-show="true"></slot>
      </div>
      <div class="side-logo-navigate close">
        <slot name="logo" :is-show="false"></slot>
      </div>

      <div class="side-logo-close" @click="tempIsOpen = false">
        <CustomIcon name="close"/>
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
@mixin navOpen () {
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

    &.is-open {
      box-shadow: 1px 0px 20px 0px #707070;
      @include navOpen();
    }

    @media (min-width: 992px) {
      &:hover,
      &.is-open {
        @include navOpen();
      }
    }
  }

  &-logo,
  &-footer {
    display: flex;
    align-items: center;

    color: #fff;
    transition-duration: 0.3s;
    width: 100%;

    &-navigate {
      display: flex;
      align-items: center;
      white-space: nowrap;
      cursor: default;
      flex: 1;
    }

    &-close {
      padding: 4px 8px;
      margin: 0 6px;
      cursor: pointer;
      font-size: 1.5em;
      // 大於 992px 不用顯示
      @media (min-width: 992px) {
        display: none;
      }
    }
  }

  &-nav {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}

</style>