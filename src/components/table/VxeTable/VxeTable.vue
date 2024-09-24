<script setup lang="ts">
import { ref } from 'vue'
import { VxeTable } from 'vxe-table'
import { VxeUI, VxeTooltip } from 'vxe-pc-ui'
import 'vxe-pc-ui/styles/cssvar.scss'
import 'vxe-table/styles/cssvar.scss'

import zhTW from 'vxe-table/lib/locale/lang/zh-TW'
// import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
// import enUS from 'vxe-table/lib/locale/lang/en-US'

import { ElAutoResizer } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'
import type { Types, Expose } from './VxeTableInfo'
import { version, props as vxeTableProps } from './VxeTableInfo'

VxeUI.setI18n('zh-TW', zhTW)
VxeUI.setLanguage('zh-TW')
VxeUI.component(VxeTooltip)

const scopedId = getUuid(version)

const props = defineProps(vxeTableProps)

const vxeTableRef = ref()

const refreshColumn: Expose.RefreshColumn = () => {
  return vxeTableRef.value?.refreshColumn()
}
const updateData: Expose.UpdateData = () => {
  return vxeTableRef.value?.updateData()
}
const setMergeCells: Expose.SetMergeCells = (merges: Types.Merges) => {
  return vxeTableRef.value?.setMergeCells(merges)
}
const removeMergeCells: Expose.RemoveMergeCells = (merges: Types.Merges) => {
  return vxeTableRef.value?.removeMergeCells(merges)
}
const clearMergeCells: Expose.ClearMergeCells = () => {
  return vxeTableRef.value?.clearMergeCells()
}

const clearScroll: Expose.ClearScroll = () => {
  return vxeTableRef.value?.clearScroll()
}
const scrollTo: Expose.ScrollTo = (scrollLeft, scrollTop) => {
  return vxeTableRef.value?.scrollTo(scrollLeft, scrollTop)
}
const scrollToRow: Expose.ScrollToRow = (row, fieldOrColumn) => {
  return vxeTableRef.value?.scrollToRow(row, fieldOrColumn)
}
const scrollToColumn: Expose.ScrollToColumn = fieldOrColumn => {
  return vxeTableRef.value?.scrollToColumn(fieldOrColumn)
}

defineExpose({
  refreshColumn,
  updateData,
  setMergeCells,
  removeMergeCells,
  clearMergeCells,

  clearScroll,
  scrollTo,
  scrollToRow,
  scrollToColumn
})

</script>

<template>
  <div class="fill" :class="scopedId">
    <ElAutoResizer>
      <template #default="{ height }">
        <VxeTable
          ref="vxeTableRef"
          :height="height ?? 0"
          :max-height="9999"
          :id="props.id"
          :data="props.data"
          :footer-data="props.footerData"
          :row-class-name="props.rowClassName"
          :cell-class-name="props.cellClassName"
          :header-row-class-name="props.headerRowClassName"
          :header-cell-class-name="props.headerCellClassName"
          :footer-row-class-name="props.footerRowClassName"
          :footer-cell-class-name="props.footerCellClassName"
          :column-config="props.columnConfig"
          :row-config="props.rowConfig"
          :filter-config="props.filterConfig"
          :scroll-y="props.scrollY"
          :scroll-x="props.scrollX"
          :show-overflow="props.showOverflow"
          :show-header-overflow="props.showHeaderOverflow"
          :show-footer-overflow="props.showFooterOverflow"
          :show-footer="props.showFooter"
          :border="props.border"
          :stripe="props.stripe"
          :mergeCells="props.mergeCells"
        >
          <slot></slot>
        </VxeTable>
      </template>
    </ElAutoResizer>
  </div>
</template>

<style lang="scss" scoped>
:global(div[class*="__VxeTable"]) {
  div.vxe-table--tooltip-wrapper {
    z-index: 9999 !important;
  }
}
</style>

<style lang="scss">
div.vxe-table--tooltip-wrapper {
  z-index: 9999 !important;
}
</style>
