<script setup lang="ts">
import type { PropType } from 'vue'
// import { ref, onMounted, nextTick } from 'vue'

import { VxeColgroup, VxeColumn } from '@/components'

const props = defineProps({
  groupDateColumns: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '日期欄位群組資料'
  },
  dateColumns: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '日期線顯示欄位資料'
  },
  baseWidth: {
    type: Number as PropType<number>,
    required: false,
    default: 80,
    description: '表格欄位基本寬度'
  }
})
// GroupDateColumn
</script>

<template>
  <VxeColgroup
    v-for="groupDateColumn in props.groupDateColumns"
    :key="groupDateColumn.key"
    :title="groupDateColumn.title"
  >
    <GroupDateColumn
      v-if="Array.isArray(groupDateColumn.columns) && groupDateColumn.columns.length > 0"
      :group-date-columns="groupDateColumn.columns"
      :date-columns="props.dateColumns"
      :base-width="props.baseWidth"
    />
    <template v-else>
      <VxeColumn
        v-for="column in props.dateColumns"
        :key="column.key"
        :field="`${groupDateColumn.key}-${column.key}`"
        :width="column?.width ?? props.baseWidth"
        :min-width="column?.minWidth ?? props.baseWidth"
        :title="column.title"
      ></VxeColumn>
    </template>
  </VxeColgroup>
</template>

<style lang="scss" scoped>

</style>
