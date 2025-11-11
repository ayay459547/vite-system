<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { CustomCharts } from '@/components/chart' // 系統組件: 圖表
import { machineOption, processOption } from './options'

const isLoading = ref(true)
onMounted(() => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

</script>

<template>
  <div v-loading="isLoading" class="dashboard-wrapper">
    <div class="dashboard-container grid-row">
      <div class="dashboard-chart grid-col-xl-12">
        <h3>機台</h3>
        <CustomCharts :options="machineOption"/>
      </div>
      <div class="dashboard-chart grid-col-xl-12">
        <h3>製程</h3>
        <CustomCharts :options="processOption"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  &-wrapper {
    width: 100%;
    height: 100%;
  }
  &-container {
    width: 100%;
    height: 100%;
    padding: 16px;
  }
  &-chart {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
  }
}
</style>
