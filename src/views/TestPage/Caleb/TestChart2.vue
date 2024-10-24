<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { CustomCharts } from '@/components' // 系統組件

const options = () => {
  return {
    title: {
      text: 'Basic Radar Chart'
    },
    legend: {
      data: ['Allocated Budget', 'Actual Spending']
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: 'Sales' },
        { name: 'Administration' },
        { name: 'Information Technology' },
        { name: 'Customer Support' },
        { name: 'Development' },
        { name: 'Marketing' }
      ]
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [420, 300, 2000, 3500, 5000, 1800],
            name: 'Allocated Budget'
          },
          {
            value: [500, 1400, 2800, 2600, 4200, 2100],
            name: 'Actual Spending'
          }
        ]
      }
    ]
  }
}

const isLoading = ref(true)

onMounted(() => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<template>
  <div v-loading="isLoading" class="page">
    <CustomCharts :options="options" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  gap: 16px;
}
</style>
