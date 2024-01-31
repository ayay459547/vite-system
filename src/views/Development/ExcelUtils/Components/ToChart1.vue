<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'

import { CustomButton, CustomUpload, CustomCharts, CustomInput } from '@/components'
import { isEmpty, downloadFile, swal } from '@/lib/lib_utils'

const barData = reactive({
  type: ['empty'],
  value: [0]
})
const chartType = ref('bar')
const chartOptions = [
  { label: '柱狀圖', value: 'bar' },
  { label: '折線圖', value: 'line' }
]

const options = () => {
  return {
    xAxis: {
      type: 'category',
      data: barData.type
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: barData.value,
        type: chartType.value
      }
    ]
  }
}
const excelRef = ref()
const chartRef = ref()
const excelToBar = () => {
  const files = excelRef.value.getFiles()
  if (isEmpty(files)) {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: '無檔案資料',
      showCancelButton: false
    })
    return
  }
  files.forEach((file) => {
    if (!isEmpty(file.excel)) {
      const _data = file.excel
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { map, matrix } = _data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [ column, type = [], value = [] ] = matrix

      barData.type = type
      barData.value = value
    }
  })

  init()
}

const isLoading = ref(true)

const init = () => {
  isLoading.value = true

  setTimeout(() => {
    chartRef.value.init()
  }, 0)

  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

onMounted(() => {
  init()
})

</script>

<template>
  <div v-loading="isLoading" class="page">
    <div class="flex-row content-between i-pb-sm">
      <label>Excel 轉 JSON</label>
      <CustomButton label="下載使用範例" type="info" icon-name="download" @click="downloadFile('/static/file', 'Excel轉柱狀圖.xlsx')"/>
    </div>

    <div>
      <CustomUpload ref="excelRef" type="excel" />
      <div class="fill-x i-mt-md flex-row-center i-ga-md">
        <CustomButton label="轉換" type="primary" icon-name="arrow-down" @click="excelToBar" />
        <CustomInput
          v-model="chartType"
          label="類型設定"
          type="radio"
          :options="chartOptions"
          hidden-label
        />
      </div>
    </div>

    <div class="page-chart">
      <CustomCharts ref="chartRef" :options="options" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  min-height: fit-content;

  &-chart {
    width: 100%;
    height: 400px;
  }
}
</style>
