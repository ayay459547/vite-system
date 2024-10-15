<script setup lang="ts">
// 布局3 選單在左側
import { CustomIcon } from '@/components'
</script>

<template>
  <div class="layout-container">
    <div class="layout-left"></div>
    <CustomIcon class="layout-arrow" name="left-right"/>
    <div class="layout-right">
      <div class="layout-header"></div>
      <div class="layout-content"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$border-style: 2px solid var(--el-text-color-primary);
$layout-width: 240px;
$left-width: 50px;
$layout-height: 160px;

.layout {
  &-container {
    width: $layout-width;
    height: $layout-height;
    border: $border-style;
    display: flex;
    position: relative;
  }

  &-left {
    width: $left-width;
    height: 100%;
    border-right: $border-style;
  }

  &-arrow {
    position: absolute;
    left: calc($left-width - 16px);
    top: calc($layout-height / 2);
  }

  &-header {
    width: calc($layout-width - $left-width);
    height: 40px;
    border-bottom: $border-style;
  }
}
</style>
