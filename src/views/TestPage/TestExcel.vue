<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import { CustomButton, CustomCharts } from '@/components'
import { downloadExcel } from '@/lib/lib_files'
import { onMounted, ref, inject } from 'vue'
// import { storeToRefs } from 'pinia'
// import { useRoutesStore } from '@/stores/stores_routes'
// import { getPermission } from '@/lib/lib_permission'

const hook: Hook = inject('hook')
const { permission, loading } = hook()

onMounted(() => {
  loading(true, 'test')

  const mission = permission(9)

  console.log('mission => ', mission)

  setTimeout(() => {
    loading(false, '')
  }, 1000)
})

const chartsOptions = () => {
  return {
    title: {
      text: 'Funnel'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}%'
    },
    toolbox: {
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    legend: {
      data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order']
    },
    series: [
      {
        name: 'Funnel',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: [
          { value: 60, name: 'Visit' },
          { value: 40, name: 'Inquiry' },
          { value: 20, name: 'Order' },
          { value: 80, name: 'Click' },
          { value: 100, name: 'Show' }
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

const matrix = [
  ['S', 'h', 'e', 'e', 't', 'J', 'S'],
  [1, 2, '5761243', 'ttt', 5, 6, 7],
  [2, 3, '', '', 6, 7, 8],
  [3, 4, '', '', 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 0]
]

const merge = [
  {
    s: { r: 1, c: 0 },
    e: { r: 2, c: 0 }
  },
  { s: { r: 3, c: 0 }, e: { r: 4, c: 0 } }
]

const download = () => {
  console.log('download')

  downloadExcel(matrix, {
    name: '測試',
    merge
  })
}
</script>

<template>
  <div v-loading="isLoading" class="page">
    <CustomButton label="下載Excel" @click="download" />

    <CustomCharts :options="chartsOptions" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
