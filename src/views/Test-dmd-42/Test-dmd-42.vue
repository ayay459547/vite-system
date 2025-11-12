<script setup lang="ts">
import { onMounted, ref, inject, nextTick } from 'vue'

// 全域功能類型
import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { useSimpleTableSetting, useFormSetting } from '@/lib/lib_columns'

import { formatDatetime } from '@/lib/lib_format' // 格式化
import { hasOwnProperty, isEmpty } from '@/lib/lib_utils' // 工具
import dayjs, { getWeekOfMonth } from '@/lib/lib_day'
import { throttle } from '@/lib/lib_lodash'

import { CustomDividerView, CustomEmpty } from '@/components/feature'
import { CustomInput } from '@/components/input'
import { useAsyncComponent } from '@/lib/lib_hook' // 自訂Composition API

import type { FilterData } from './api'
import { getData } from './api'
import { columnSetting } from './columns'

const VirtualTable = useAsyncComponent(() => import('./Components/VirtualTable.vue'), 'rect')

const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: 'system'
})

const isLoading = ref(true)

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

const init = async () => {
  isLoading.value = true

  dateGroup.value = {}
  const _dateGroup = {}
  const _totalColumns = []
  const _footerData = {
    rowkey: 'footer',
    customerName: '',
    productId: '',
    deliveryType: '',
    empty: 0
  }

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

    const oldData = resMap.get(rowkey) ?? {}
    const newData = {
      ...oldData,
      rowkey,
      customerName,
      productId,
      deliveryType
      // deliveryDate,
      // quantity
    }

    if (![null, undefined, '', 'null'].includes(deliveryDate)) {
      let tempRef = null
      // 月
      const columnMonth = formatDatetime(deliveryDate, 'YYYY-MM')
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
      if (!hasOwnProperty(newData, columnMonth)) {
        newData[columnMonth] = 0
      }
      newData[columnMonth] += quantity // 月資料加總
      newData[columnDate] = quantity // 日資料

      // footer 總和
      if (!hasOwnProperty(_footerData, columnDate)) {
        _footerData[columnDate] = 0
      }
      _footerData[columnDate] += quantity
    } else {
      // 未排產
      newData['empty'] = quantity

      _footerData.empty += quantity
    }

    resMap.set(rowkey, newData)

    return resMap
  }, new Map())

  // 中間
  dateGroup.value = _dateGroup

  const monthList: any[] = Object.entries(_dateGroup)

  groupColumns.value = monthList.sort((a, b) => {
    const [a_monthColumn] = a
    const [b_monthColumn] = b
    return dayjs(`${a_monthColumn}-01`).valueOf() - dayjs(`${b_monthColumn}-01`).valueOf()

  }).map(([monthColumn, weekGroup]) => {
    const weekList: any[] = Object.entries(weekGroup)
    // header 第一階資料
    return {
      key: monthColumn,
      title: monthColumn,
      columns: weekList.sort((a, b) => {
        const [a_weekColumn] = a
        const [b_weekColumn] = b
        return Number.parseInt(a_weekColumn) - Number.parseInt(b_weekColumn)

      }).map(([weekColumn, dateGroup]) => {
        const dateList = Object.keys(dateGroup)
        // header 第二階資料
        return {
          key: `${weekColumn}`,
          title: `W${weekColumn}`,
          columns: dateList.sort((a_dateColumn, b_dateColumn) => {
            return dayjs(a_dateColumn).valueOf() - dayjs(b_dateColumn).valueOf()

          }).map(dateColumn => {
            // header 第三階資料
            return {
              key: dateColumn,
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
  monthList.forEach(([monthColumn]) => {
    _totalColumns.push({
      key: monthColumn,
      title: monthColumn,
      width: 120
    })
  })

  totalColumns.value = _totalColumns
  footerData.value = [_footerData]

  await nextTick()
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}


const {
  columns: filterColumn,
  forms: filter
} = useFormSetting<FilterData>(columnSetting, 'filter')

const throttleInit = throttle<typeof init>(init, 200, {
  // leading: false,
  trailing: false
})

onMounted(() => {
  throttleInit()
})

</script>

<template>
  <div v-loading="isLoading" class="page">
    <CustomDividerView :left-width="280">
      <template #left>
        <div class="page-left">
          <CustomInput
            v-model="filter.deliveryDate"
            v-bind="filterColumn.deliveryDate"
            @change="throttleInit"
          />
          <CustomInput
            v-model="filter.customerName"
            v-bind="filterColumn.customerName"
            @change="throttleInit"
          />
          <CustomInput
            v-model="filter.productId"
            v-bind="filterColumn.productId"
            @change="throttleInit"
          />
          <CustomInput
            v-model="filter.deliveryType"
            v-bind="filterColumn.deliveryType"
            @change="throttleInit"
          />
        </div>
      </template>
      <template #right>
        <div class="page-right">
          <VirtualTable
            v-if="!isEmpty(tableData)"
            :tableData="tableData"
            :tableColumns="tableColumns"
            :groupColumns="groupColumns"
            :totalColumns="totalColumns"
            :footerData="footerData"
          />
          <CustomEmpty v-else />
        </div>
      </template>
    </CustomDividerView>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;

  &-left {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-right: 16px;
  }
  &-right {
    width: 100%;
    height: 100%;
  }
}
</style>
