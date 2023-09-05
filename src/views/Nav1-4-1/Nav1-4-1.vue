<script setup lang="ts">
import { GanttChart } from '@/components'


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
