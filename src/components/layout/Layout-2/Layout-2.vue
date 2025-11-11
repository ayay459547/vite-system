<script setup lang="ts">
import type { PropType } from 'vue'
import { nextTick } from 'vue'

import type { Navigation } from '@/types/types_routes'

import MenuContent from './MenuContent.vue'

const props = defineProps({
  showRoutes: {
    type: Array as PropType<Navigation[]>,
    default: () => []
  },
  currentNavigation: {
    type: Object as PropType<Navigation>,
    default: () => {
      return {}
    }
  }
})

const init = async () => {
  await nextTick()
}

defineExpose({
  init
})
</script>

<template>
  <div class="layout-wrapper">
    <div class="layout-menu">
      <MenuContent
        :show-routes="props.showRoutes"
        :current-navigation="props.currentNavigation"
      >
        <template #logo>
          <slot name="logo"></slot>
        </template>
        <template #MenuUser>
          <slot name="MenuUser"></slot>
        </template>
      </MenuContent>
    </div>

    <div class="layout-view">
      <slot name="content"></slot>
    </div>
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
  }

  &-menu {
    width: 100%;
    height: fit-content;
  }

  &-view {
    width: 100%;
    height: calc(100% - 64px);
  }
}
</style>
