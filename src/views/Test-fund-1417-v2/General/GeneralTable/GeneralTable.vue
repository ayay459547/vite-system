<script setup lang="ts">
import { ref, inject } from 'vue'

import type { UseHook } from '@/declare/hook.ts'
import { WebViewTable } from '@/components'

import type { TableOptions } from '@/declare/columnSetting.ts'
import { formatParams, formatExcel, formatTable } from './api'
import { columnSetting } from './columns'
import { fakeTableData } from './fakeData'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})

// table
const tableOptions: TableOptions = {
  title: '全廠',
  i18nTitle: 'fund-1417-genral-title',
  i18nModule: 'system',
  version: '1.1.0',
  settingKey: 'fund-1417-General',
  isSorting: true
}

const tableRef = ref(null)
const init = () => {
  tableRef.value?.init()
}

defineExpose({ init })

</script>

<template>
  <WebViewTable
    ref="tableRef"
    webfuno="fund_1417"
    designatedview="iPASPWebView_fund_1417_gwt"
    i18n-module="system"
    :table-options="tableOptions"
    :column-setting="columnSetting"
    :format-params="formatParams"
    :format-excel="formatExcel"
    :format-table="formatTable"
    :fake-data="fakeTableData"
    is-hidden-prepend
  >
    <template #column-dayOfWeek="{ prop, data }">
      <span>{{ i18nTranslate(columnSetting[prop].getValue(data)) }}</span>
    </template>
  </WebViewTable>
</template>

<style lang="scss" scoped>
</style>
