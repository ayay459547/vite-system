<script setup lang="ts">
import { type PropType, ref, computed, inject } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { useTableSetting } from '@/lib/lib_columns'
import { CustomPopover, CustomButton, CustomTable } from '@/components' // 系統組件
import { cutTableData } from '@/lib/lib_utils' // 工具

import type { TableOptions } from '@/types/types_columnSetting'
import { columnSetting } from '../columns'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})

const props = defineProps({
  tableData: {
    type: Array as PropType<any[]>,
    default: () => {
      return []
    }
  }
})

const tableOptions: TableOptions = {
  title: '甘特圖資料',
  i18nTitle: 'auto-33-title',
  i18nModule: 'system',
  version: '1.0.3',
  settingKey: 'auto-33'
}

const {
  tableSetting,
  downloadExcel
  // getParams,
  // changePage
} = useTableSetting(columnSetting, 'table', tableOptions)

const customPage = ref<number>(1)
const customSize = ref<number>(100)

const onTableChange = ({ page, size }) => {
  customPage.value = page
  customSize.value = size
}

const showData = computed(() => {
  return cutTableData(customPage.value, customSize.value, props.tableData)
})

const isVisible = ref(false)
</script>

<template>
  <CustomPopover
    :visible="isVisible"
    width="70vw"
    placement="bottom-end"
    popper-style="padding: 0px;"
  >
    <div class="table-container">
      <div class="flex-row content-end">
        <CustomButton icon-name="close" text @click="isVisible = false" />
      </div>

      <CustomTable
        ref="table"
        :table-data="showData"
        :table-data-count="props.tableData.length"
        v-bind="tableSetting"
        @excel="downloadExcel(props.tableData)"
        @show-change="onTableChange"
      >
        <template #header-all="{ column }">
          <div>{{ i18nTranslate(column.i18nLabel) }}</div>
        </template>

        <template #column-status="{ row }">
          <div>{{ row['statusStr'] }}</div>
        </template>
      </CustomTable>
    </div>

    <template #reference>
      <CustomButton
        icon-name="table-list"
        :label="i18nTranslate('auto-33-title')"
        @click.stop="isVisible = !isVisible"
      />
    </template>
  </CustomPopover>
</template>

<style lang="scss" scoped>
.table {
  &-container {
    width: 100%;
    height: 60vh;
    min-height: 200px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
