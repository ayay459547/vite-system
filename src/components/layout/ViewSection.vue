<script setup lang="ts">
import HistoryNavigation from './HistoryNavigation.vue'

</script>

<template>
  <div class="view-wrapper">
    <div class="view-history">
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
    background-color: #e6e6e6;
    flex-direction: column;
    @extend %flex-center;
  }
  &-history {
    width: 100%;
    height: fit-content;
  }
  &-container {
    width: 100%;
    flex: 1;
    overflow: auto;
    border-radius: 6px;
    background-color: #fff;
    box-sizing: border-box;
  }
}
</style>