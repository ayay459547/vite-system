<script setup lang="ts">
// Composition API
import { onMounted, ref, inject, nextTick } from 'vue'

// 全域功能類型
import type { UseHook } from '@/declare/hook'
import { useSimpleTableSetting } from '@/lib/lib_columns'
import { getData } from './api'
import { columnSetting } from './columns'
import { formatDatetime } from '@/lib/lib_format'
import { isEmpty } from '@/lib/lib_utils'
import type { DateType } from '@/lib/lib_day'
import dayjs from '@/lib/lib_day'

import VirtualTable from './Components/VirtualTable.vue'
// const isLoading = ref(false)

const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: 'system'
})

const isLoading = ref(false)
const tableData = ref([])
const { tableColumns } = useSimpleTableSetting(columnSetting, 'table')
const dateColumns = ref([])

const rowKeySet: Set<string> = new Set() // 行資料(客戶名稱+產品型號+達交類型)
const dateSet: Set<DateType> = new Set() // 列資料(日)
const monthSet: Set<DateType> = new Set() // 列總和(月)

const initData = async () => {
  isLoading.value = true
  rowKeySet.clear()
  dateSet.clear()

  const { status, msg, data: resTableData } = await getData()
  if (status !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'sytem'),
      text: msg ?? i18nTranslate('warning-contactIT', 'sytem'),
      showCancelButton: false
    })
  }

  tableData.value = resTableData
  console.log('resTableData => ', resTableData)

  const _tableData = resTableData.reduce((res, item) => {
    const { customerName, productId, deliveryType, deliveryDate } = item
    const rowkey = `${customerName}-${productId}-${deliveryType}`

    if (!isEmpty(deliveryDate)) {
      const cellDate = formatDatetime(deliveryDate, 'YYYY-MM-DD')
      if (cellDate !== 'Invalid Date' && !dateSet.has(cellDate)) {
        dateSet.add(cellDate)
      }
      const totalMonth = formatDatetime(deliveryDate, 'YYYY-MM')
      if (totalMonth !== 'Invalid Date' && !monthSet.has(totalMonth)) {
        monthSet.add(totalMonth)
      }
    }

    if (!rowKeySet.has(rowkey)) {
      res.push(item)
      rowKeySet.add(rowkey)
    }

    return res
  }, [])

  const cellDateList = [...dateSet.values()].sort((a: DateType, b: DateType) => {
    return dayjs(a).valueOf() - dayjs(b).valueOf()
  })
  cellDateList.forEach(dateItem => {
    dateColumns.value.push({
      label: dateItem,
      title: dateItem,
      width: 120
    })
  })

  dateColumns.value.push({
    label: '未排產',
    title: '未排產',
    width: 120
  })

  const totalMonthList = [...monthSet.values()].sort((a: DateType, b: DateType) => {
    return dayjs(a).valueOf() - dayjs(b).valueOf()
  })
  totalMonthList.forEach(dateItem => {
    dateColumns.value.push({
      label: dateItem,
      title: dateItem,
      width: 120
    })
  })

  console.log('_tableData => ', _tableData)
  await nextTick()
  isLoading.value = false
}

onMounted(() => {
  initData()
})

</script>

<template>
  <div v-loading="isLoading" class="page">
    <VirtualTable
      :tableData="tableData"
      :tableColumns="tableColumns"
      :dateColumns="dateColumns"
    />
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
