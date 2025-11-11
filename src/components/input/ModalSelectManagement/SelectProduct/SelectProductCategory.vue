<script setup lang="ts">
import type { PropType } from 'vue'

import type { TableOptions } from '@/types/types_columnSetting' // 表格設定類型
import { WebViewTable } from '@/components/table' // 系統組件: 表格

import { useProductCategoryInfo } from '@/declare/declare_product/category/useProductCategoryInfo'
import { columnSetting } from '@/declare/declare_product/category/columns'

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
} = useProductCategoryInfo({
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
  title: '產品類別基本資訊',
  i18nTitle: 'fund-117',
  i18nModule: 'fund_common',
  version: '1.2.0',
  settingKey: 'ModalSelect_productCategory',
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
      webfuno="fund_117"
      :table-options="tableOptions"
      :column-setting="columnSetting"
      :format-params="formatParams"
      :format-excel="formatExcel"
      :format-table="formatTable"
      :fake-data="[]"
      fake-data-path="/declare/productCategory_fakeData.json"
      :is-mounted-init="false"
      @select="onSelect"
      @select-all="onSelectAll"
      @mounted="onWebViewTableMounted"
    />
  </div>
</template>

<style lang="scss" scoped></style>
