<script setup lang="tsx">
import { onMounted, ref, inject, nextTick } from 'vue'

// 全域功能類型
import type { UseHook } from '@/declare/hook'
import { useSimpleTableSetting } from '@/lib/lib_columns'
import { getData } from './api'
import { columnSetting } from './columns'
import { formatDatetime } from '@/lib/lib_format'
import { hasOwnProperty } from '@/lib/lib_utils' // 工具
import dayjs, { getWeekOfMonth } from '@/lib/lib_day'
import { useAsyncComponent } from '@/lib/lib_hook' // 自訂Composition API

const VirtualTable = useAsyncComponent(() => import('./Components/VirtualTable.vue'), 'rect')

const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: 'system'
})

const isLoading = ref(false)

// 左
const { tableColumns } = useSimpleTableSetting(columnSetting, 'table')
// 中
const dateGroup = ref({})
const groupColumns = ref([])
// 右
const totalColumns = ref([])

// 顯示資料
const tableData = ref([])
const footerData = ref([])

const initData = async () => {
  isLoading.value = true

  dateGroup.value = {}
  const _dateGroup = {}

  const { status, msg, data: resTableData } = await getData()
  if (status !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }
  console.log('resTableData => ', resTableData)

  const mapData = resTableData.reduce((resMap, item) => {
    const { customerName, productId, deliveryType, deliveryDate, quantity } = item
    const rowkey = `${customerName}-${productId}-${deliveryType}`

    const newData = {
      rowkey,
      customerName,
      productId,
      deliveryType
      // deliveryDate,
      // quantity
    }

    if (![null, undefined, '', 'null'].includes(deliveryDate)) {
      // 月
      const columnMonth = formatDatetime(deliveryDate, 'YYYY-MM')

      let tempRef = null
      if (!hasOwnProperty(_dateGroup, columnMonth)) {
        _dateGroup[columnMonth] = {}
      }
      tempRef = _dateGroup[columnMonth]

      // 周
      const columnWeek = `${getWeekOfMonth(deliveryDate)}`
      if (!hasOwnProperty(tempRef, columnWeek)) {
        tempRef[columnWeek] = {}
      }
      tempRef = tempRef[columnWeek]

      // 日
      const columnDate = formatDatetime(deliveryDate, 'YYYY-MM-DD')
      if (!hasOwnProperty(tempRef, columnDate)) {
        tempRef[columnDate] = 0
      }
      tempRef = tempRef[columnDate]

      tempRef = quantity
      // 顯示資料
      newData[columnDate] = quantity
    } else {
      // 未排產
      newData['empty'] = quantity
    }

    if (!resMap.has(rowkey)) {
      resMap.set(rowkey, newData)
    } else {
      const oldData = resMap.get(rowkey)
      resMap.set(rowkey, { ...oldData, ...newData })
    }

    return resMap
  }, new Map())

  // 中間
  dateGroup.value = _dateGroup

  const monthList: any[] = Object.entries(_dateGroup)

  groupColumns.value = monthList.sort((a, b) => (dayjs(a).valueOf() - dayjs(b).valueOf())).map(([monthColumn, weekGroup]) => {
    const weekList: any[] = Object.entries(weekGroup)

    return {
      key: `key-${monthColumn}`,
      title: monthColumn,
      columns: weekList.sort((a, b) => (a - b)).map(([weekColumn, dateGroup]) => {
        const dateList = Object.keys(dateGroup)

        return {
          key: `key-${weekColumn}`,
          title: `W${weekColumn}`,
          columns: dateList.sort((a, b) => (dayjs(a).valueOf() - dayjs(b).valueOf())).map(dateColumn => {

            return {
              key: `key-${dateColumn}`,
              field: dateColumn,
              title: formatDatetime(dateColumn, 'MM-DD'),
              width: 120
            }
          })
        }
      })
    }
  })

  tableData.value = Array.from(mapData.values())

  console.log('groupColumns => ', groupColumns.value)
  console.log('tableData => ', tableData.value)

  // 右
  totalColumns.value.push({
    key: 'empty',
    label: '未排產',
    title: '未排產',
    width: 120
  })

  await nextTick()
  isLoading.value = false
}

onMounted(() => {
  initData()
})

</script>

<template>
  <div v-loading="isLoading" class="i-page">
    <VirtualTable
      :tableData="tableData"
      :tableColumns="tableColumns"
      :groupColumns="groupColumns"
      :totalColumns="totalColumns"
      :footerData="footerData"
    />
  </div>
</template>

<style>

</style>
