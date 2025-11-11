<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount, onMounted, inject } from 'vue'
import type { VxeTableInstance } from 'vxe-table'
import { VxeTable } from 'vxe-table'
import { VxeUI, VxeTooltip } from 'vxe-pc-ui'

import { ElAutoResizer } from 'element-plus'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { useEventBus } from '@/lib/lib_hook' // 自訂Composition API
import { useLayoutStore } from '@/stores/useLayoutStore'
import { defaultModuleType } from '@/declare/declare_i18n'

import { getUuid } from '@/lib/lib_utils' // 工具
import type { Types, Expose } from './VxeTableInfo'
import { version, props as vxeTableProps } from './VxeTableInfo'

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

VxeUI.component(VxeTooltip)

const layoutStore = useLayoutStore()
const { isDark } = storeToRefs(layoutStore)

const colorToneBus = useEventBus<string>('colorTone')
const colorToneBusListener = (event: string, colorTone: string) => {
  switch (event) {
    case 'colorToneChange':
      if (colorTone === 'dark') {
        VxeUI.setTheme('dark')
      } else {
        VxeUI.setTheme('light')
      }
      break
  }
}
onBeforeMount(() => {
  colorToneBus.on(colorToneBusListener)
})
onBeforeUnmount(() => {
  colorToneBus.off(colorToneBusListener)
})

onMounted(() => {
  if (isDark.value) {
    VxeUI.setTheme('dark')
  }
})

const scopedId = getUuid(version)

const props = defineProps(vxeTableProps)

const VxeTableRef = ref<VxeTableInstance>()

const refreshColumn: Expose['refreshColumn'] = () => VxeTableRef.value?.refreshColumn()
const updateData: Expose['updateData'] = () => VxeTableRef.value?.updateData()
const setMergeCells: Expose['setMergeCells'] = (merges: Types['merges']) => VxeTableRef.value?.setMergeCells(merges)
const removeMergeCells: Expose['removeMergeCells'] = (merges: Types['merges']) => VxeTableRef.value?.removeMergeCells(merges)
const clearMergeCells: Expose['clearMergeCells'] = () => VxeTableRef.value?.clearMergeCells()

const clearScroll: Expose['clearScroll'] = () => VxeTableRef.value?.clearScroll()
const scrollTo: Expose['scrollTo'] = (scrollLeft, scrollTop) => VxeTableRef.value?.scrollTo(scrollLeft, scrollTop)
const scrollToRow: Expose['scrollToRow'] = (row, fieldOrColumn) => VxeTableRef.value?.scrollToRow(row, fieldOrColumn)
const scrollToColumn: Expose['scrollToColumn'] = fieldOrColumn => VxeTableRef.value?.scrollToColumn(fieldOrColumn)

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
          ref="VxeTableRef"
          :height="height ?? 0"
          :max-height="9999"
          :id="props.id ?? scopedId"
          :data="props.data"
          :empty-text="props.emptyText ?? i18nTranslate('empty-data', defaultModuleType)"
          :footer-data="props.footerData"
          :row-class-name="props.rowClassName"
          :cell-class-name="props.cellClassName"
          :header-row-class-name="props.headerRowClassName"
          :header-cell-class-name="props.headerCellClassName"
          :footer-row-class-name="props.footerRowClassName"
          :footer-cell-class-name="props.footerCellClassName"
          :column-config="props.columnConfig"
          :virtual-y-config="props.virtualYConfig"
          :virtual-x-config="props.virtualXConfig"
          :row-config="props.rowConfig"
          :filter-config="props.filterConfig"
          :scroll-y="props.scrollY"
          :scroll-x="props.scrollX"
          :show-header="props.showHeader"
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
:global(.vxe-table .vxe-table--body-wrapper) {
  background-color: transparent !important;
}

:global(div.vxe-cell) {
  .vxe-cell--title,
  .vxe-cell--label {
    color: var(--el-text-color-primary);
  }
}
</style>
