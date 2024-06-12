<script setup lang="ts">
// Composition API
import { inject } from 'vue'
// 引入組件
import { WebViewTable, CustomButton, CustomTooltip } from '@/components'
// 全域功能類型
import type { UseHook } from '@/declare/hook'

// 引入表格設定類型
import type { TableOptions } from '@/lib/lib_columns'
// 引入資料格式化
import type { TableData } from './api'
import { formatParams, formatExcel, formatTable } from './api'
// 引入欄位設定
import { columnSetting } from './columns'
// 引入假資料
import { fakeTableData } from './fakeData'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})

// 表格設定
const tableOptions: TableOptions = {
  title: '機台資訊呈現',
  i18nTitle: 'fund-1413-title',
  i18nModule: 'system',
  version: '1.0.2',
  settingKey: 'fund-1417-Machine',
  isSorting: true,
  isHiddenExcel: true
}

const emit = defineEmits(['setMachineWeekSchedule', 'copyMachineWeekSchedule'])
const setMachineWeekSchedule = (row: TableData) => {
  emit('setMachineWeekSchedule', row.machineId)
}
const copyMachineWeekSchedule = (row: TableData) => {
  emit('copyMachineWeekSchedule', row.machineId)
}
</script>

<template>
  <WebViewTable
    ref="webViewTableRef"
    webfuno="fund_1413"
    :table-options="tableOptions"
    :column-setting="columnSetting"
    :format-params="formatParams"
    :format-excel="formatExcel"
    :format-table="formatTable"
    :fake-data="fakeTableData"
    is-hidden-prepend
  >
    <template #header-operations="{ column }">
      <div class="fill-y flex-row-center">{{ i18nTranslate(column.i18nLabel) }}</div>
    </template>
    <template #column-operations="scope">
      <div class="fill-y flex-row-center i-ga-md">
        <CustomTooltip :show-after="300">
          <CustomButton
            type="primary"
            text
            circle
            icon-name="circle-right"
            @click="setMachineWeekSchedule(scope.row)"
          />
          <template #content>{{ `${i18nTranslate('setting')} ${scope.row.machineId}` }}</template>
        </CustomTooltip>
        <CustomTooltip :show-after="300">
          <CustomButton
            text
            circle
            icon-name="copy"
            @click="copyMachineWeekSchedule(scope.row)"
          />
          <template #content>{{ `${i18nTranslate('copy')} ${scope.row.machineId}` }}</template>
        </CustomTooltip>
      </div>
    </template>
  </WebViewTable>
</template>

<style lang="scss" scoped></style>
