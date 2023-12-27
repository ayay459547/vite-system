<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  historyIsOpen: {
    type: Boolean as PropType<boolean>,
    required: true
  }
})

</script>

<template>
  <div class="view-wrapper">
    <div class="view-history" :class="props.historyIsOpen ? 'is-open' : 'is-close'">
      <slot name="tabs" :is-show="props.historyIsOpen"></slot>
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
    transition-duration: 0.3s;
    &.is-open {
      height: fit-content;
      max-height: 100px;
    }
    &.is-close {
      height: 40px;
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
