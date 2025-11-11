<script setup lang="ts">
import { CustomCharts } from '@/components/chart' // 系統組件
import { options } from './options'
</script>

<template>
  <div class="page">
    Feat-gantt
    <CustomCharts :options="options" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
