<script setup lang="ts">
import { ref } from 'vue'
import { VxeTable } from 'vxe-table'
import { VxeUI, VxeTooltip } from 'vxe-pc-ui'
import 'vxe-pc-ui/styles/cssvar.scss'
import 'vxe-table/styles/cssvar.scss'

import zhTW from 'vxe-table/lib/locale/lang/zh-TW'
// import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
// import enUS from 'vxe-table/lib/locale/lang/en-US'

// import zhHK from 'vxe-table/lib/locale/lang/zh-HK'
// import zhMO from 'vxe-table/lib/locale/lang/zh-MO'
// import jaJP from 'vxe-table/lib/locale/lang/ja-JP'
// import esES from 'vxe-table/lib/locale/lang/es-ES'
// import ptBR from 'vxe-table/lib/locale/lang/pt-BR'

import { ElAutoResizer } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'
import type { Types, Expose } from './VxeTableInfo'
import { version, props as VxeCustomTableProps } from './VxeTableInfo'

VxeUI.setI18n('zh-TW', zhTW)
VxeUI.setLanguage('zh-TW')
VxeUI.component(VxeTooltip)

const scopedName = '__vxe-table__'
const scopedId = getUuid(scopedName)

const props = defineProps(VxeCustomTableProps)

const vxeTableRef = ref()

const refreshColumn: Expose.RefreshColumn = () => {
  vxeTableRef.value?.refreshColumn()
}
const updateData: Expose.UpdateData = () => {
  console.log('updateData => ')
  vxeTableRef.value?.updateData()
}

const setMergeCells: Expose.SetMergeCells = (merges: Types.Merges) => {
  console.log('setMergeCells => ')
  vxeTableRef.value?.setMergeCells(merges)
}

defineExpose({
  refreshColumn,
  updateData,
  setMergeCells
})

</script>

<template>
  <div class="fill" :class="[`VxeTable_${version}`, scopedId, scopedName]">
    <ElAutoResizer>
      <template #default="{ height }">
        <VxeTable
          ref="vxeTableRef"
          :height="height ?? 0"
          :max-height="9999"
          :id="props.id"
          :data="props.data"
          :footer-data="props.footerData"
          :row-config="props.rowConfig"
          :column-config="props.columnConfig"
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
:global(.__vxe-table__) {
  .vxe-table--tooltip-wrapper {
    z-index: 9999 !important;
  }
}
</style>

<style lang="scss" scoped>
.vxe-table--tooltip-wrapper {
  z-index: 9999 !important;
}
</style>
