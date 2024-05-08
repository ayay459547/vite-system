<script setup lang="ts">
// 布局1 選單在左側
</script>

<template>
  <div class="layout-container">
    <div class="layout-left"></div>
    <div class="layout-right">
      <div class="layout-header"></div>
      <div class="layout-content"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$border-style: 2px solid #000000;
$layout-width: 260px;
$left-width: 50px;
.layout {
  &-container {
    width: $layout-width;
    height: 180px;
    border: $border-style;
    display: flex;
  }

  &-left {
    width: $left-width;
    height: 100%;
    border-right: $border-style;
  }

  &-header {
    width: calc($layout-width - $left-width);
    height: 40px;
    border-bottom: $border-style;
  }
}
</style>
