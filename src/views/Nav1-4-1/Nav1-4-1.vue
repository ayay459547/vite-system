<script setup lang="ts">
import { GanttChart } from '@/components/chart' // 系統組件
</script>

<template>
  <div class="page">
    <GanttChart />
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-x: hidden;
}
</style>
