<script setup lang="ts">
// 布局2 選單在第2層
</script>

<template>
  <div class="layout-container">
    <div class="layout-header"></div>
    <div class="layout-menu"></div>
    <div class="layout-content"></div>
  </div>
</template>

<style lang="scss" scoped>
$border-style: 2px solid var(--el-text-color-primary);
$layout-width: 260px;
.layout {
  &-container {
    width: $layout-width;
    height: 180px;
    border: $border-style;
  }

  &-header {
    width: 100%;
    height: 30px;
    border-bottom: $border-style;
  }

  &-menu {
    width: 100%;
    height: 30px;
    border-bottom: $border-style;
  }
}
</style>
