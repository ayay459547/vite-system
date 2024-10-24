<script setup lang="ts">
import type { PropType } from 'vue'

import {
  VxeTable,
  VxeColumn,
  VxeColgroup
} from '@/components' // 系統組件

import {
  // VxeTable,
  // VxeColumn,
  // VxeColgroup
} from 'vxe-table'

const props = defineProps({
  tableData: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '表格資料'
  },
  footerData: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '表尾資料'
  },
  tableColumns: {
    type: Object as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '表格欄位顯示用設定'
  },
  groupColumns: {
    type: Object as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '表格欄位顯示用設定'
  },
  totalColumns: {
    type: Object as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '表格欄位顯示用設定'
  }
})

</script>

<template>
  <div class="fill">
    <VxeTable
      show-overflow
      show-header-overflow
      show-footer-overflow
      show-footer
      :border="true"
      stripe
      :data="props.tableData"
      :row-config="{isCurrent: true, isHover: true}"
      :column-config="{resizable: true}"
      :scroll-y="{enabled: true, gt: 0}"
      :scroll-x="{enabled: true, gt: 0}"
      :footer-data="props.footerData"
    >
      <VxeColumn
        v-for="column in props.tableColumns"
        :key="column.key"
        :field="column.key"
        :width="column.width"
        :title="column.title"
        :fixed="column.fixed"
      >
        <template v-if="column.key === 'customerName'" #footer>
          <div>總和</div>
        </template>
      </VxeColumn>

      <VxeColgroup
        v-for="monthColumn in groupColumns"
        :key="monthColumn.key"
        :title="monthColumn.title"
      >
        <VxeColgroup
          v-for="weekColumn in monthColumn.columns"
          :key="weekColumn.key"
          :title="weekColumn.title"
        >
          <VxeColumn
            v-for="dateColumn in weekColumn.columns"
            :key="dateColumn.key"
            :field="dateColumn.field"
            :title="dateColumn.title"
            :width="dateColumn.width"
          ></VxeColumn>
        </VxeColgroup>
      </VxeColgroup>

      <VxeColumn
        key="empty"
        field="empty"
        :width="120"
        title="未排產"
      >
        <template #header>
          <div>未排產</div>
        </template>
      </VxeColumn>

      <VxeColgroup
        v-for="column in props.totalColumns"
        :key="column.key"
        :title="column.title"
      >
        <VxeColumn
          :key="column.key"
          :field="column.key"
          :width="column.width"
          :title="column.title"
        >
          <template #header>
            <div>總和</div>
          </template>
        </VxeColumn>
      </VxeColgroup>
    </VxeTable>
  </div>
</template>

<style></style>
