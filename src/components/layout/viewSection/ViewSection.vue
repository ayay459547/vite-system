<script setup lang="ts">
import type { PropType } from 'vue'
import HistoryNavigation from './HistoryNavigation.vue'

defineProps({
  historyIsOpen: {
    type: Boolean as PropType<boolean>,
    default: true
  }
})

</script>

<template>
  <div class="view-wrapper">
    <div class="view-history" :class="historyIsOpen ? 'is-open' : 'is-close'">
      <HistoryNavigation></HistoryNavigation>
    </div>
    <main class="view-container">
      <slot></slot>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.view {
  &-wrapper {
    width: 100%;
    height: 100%;
    padding: 0 12px 12px;
    flex-direction: column;
    @extend %flex-center;
  }
  &-history {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    height: fit-content;
    transition-duration: 0.3s;

    &.is-open {
      max-height: 100px;
    }
    &.is-close {
      max-height: 0px;
      overflow: hidden;
    }
  }
  &-container {
    width: 100%;
    flex: 1;
    border-radius: 6px;
    background-color: #fff;
    box-sizing: border-box;
    position: relative;
  }
}
</style>