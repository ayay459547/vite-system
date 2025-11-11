<script setup lang="ts">
import type { PropType } from 'vue'

import type { TableOptions } from '@/types/types_columnSetting' // 表格設定類型
import { CustomLink } from '@/components/feature' // 系統組件: 功能
import { WebViewTable } from '@/components/table' // 系統組件: 表格

import { useSpecTypeInfo } from '@/declare/declare_spec/specType/useSpecTypeInfo'
import { columnSetting, linkSetting } from '@/declare/declare_spec/specType/columns'

import { useModalSelectData } from '../hook'

const props = defineProps({
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否多選'
  },
  multipleLimit: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    description: 'multiple 屬性設定為 true 時，代表多重選擇場景下使用者最多可選擇的項目數， 為 0 則不限制'
  }
})

const {
  formatParams,
  formatExcel,
  formatTable
} = useSpecTypeInfo({
  i18nModule: 'fund_common'
})

const {
  WebViewTableRef,
  onWebViewTableMounted,
  toggleSelection,
  getSelectionRows,
  selectedValue,
  selectedSet,
  onSelect,
  onSelectAll
} = useModalSelectData(props)


// 表格設定
const tableOptions: TableOptions = {
  title: '規格類型管理',
  i18nTitle: 'fund-201',
  i18nModule: 'fund_common',
  version: '1.2.0',
  settingKey: 'ModalSelect_specType',
  rowKey: 'rowId',
  isSorting: true,
  selection: true,
  selectable: (row: any) => {
    if (
      !props.multiple ||
      props.multipleLimit === 0 ||
      selectedSet.value.has(row.rowId)
    ) return true

    return selectedValue.value.length < props.multipleLimit
  }
}

defineExpose({
  toggleSelection,
  getSelectionRows
})
</script>

<template>
  <div class="i-page">
    <WebViewTable
      ref="WebViewTableRef"
      webfuno="fund_201"
      designatedview="iPASPWebView_fund_201_SpecificationType"
      :table-options="tableOptions"
      :column-setting="columnSetting"
      :format-params="formatParams"
      :format-excel="formatExcel"
      :format-table="formatTable"
      :fake-data="[]"
      fake-data-path="/declare/spec/specType_fakeData.json"
      :is-mounted-init="false"
      @select="onSelect"
      @select-all="onSelectAll"
      @mounted="onWebViewTableMounted"
    >
      <!-- Redirect Link -->
      <template
        v-for="(item, columnKey) in linkSetting"
        :key="`link-${columnKey}`"
        #[`column-${columnKey}`]="{data}"
      >
        <CustomLink
          v-if="data"
          :label="data"
          :data="data"
          v-bind="item"
        />
      </template>
    </WebViewTable>
  </div>
</template>

<style lang="scss" scoped></style>
