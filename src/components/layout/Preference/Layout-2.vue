<script setup lang="ts">
// 布局2
</script>

<template>
  <div class="layout-container">
    <div class="layout-header"></div>
    <div class="layout-content"></div>
  </div>
</template>

<style lang="scss" scoped>
$border-style: 2px solid var(--el-text-color-primary);
$layout-width: 240px;
.layout {
  &-container {
    width: $layout-width;
    height: 160px;
    border: $border-style;
  }

  &-header {
    width: 100%;
    height: 40px;
    border-bottom: $border-style;
  }
}
</style>
