<script setup lang="ts">
import { CustomDividerView } from '@/components'


</script>

<template>
  <div class="page">
    <CustomDividerView>
      <template #left>
        <div class="page-left"></div>
      </template>
      <template #right>
        <div class="page-right"></div>
      </template>
    </CustomDividerView>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &-left {
    width: 1500px;
    height: 1500px;
    background-color: lightpink;
  }

  &-right {
    width: 100%;
    height: 100%;
    background-color: lightblue;
  }
}
</style>
