<script setup lang="ts">
// import type { PropType } from 'vue'
import { inject } from 'vue'
import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { VxeTable, VxeColumn } from '@/components/table' // 系統組件: 表格
// import { duration } from 'dayjs'

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})

const props = defineProps({
  tableData: {
    type: Object as any,
    required: true
  },
  columns: {
    type: Object as  any,
    required: true
  },
  translate: {
    type: Function as any,
    required: true
  }
})

const emit = defineEmits(['scrollToTime'])
const scrollToTimeUnix = (time:number) => emit('scrollToTime', time)

</script>

<template>
  <VxeTable
    ref="vxeTableRef"
    show-overflow
    show-header-overflow
    :border="true"
    :data="props.tableData"
    stripe
    header-row-class-name="data-header-row"
    header-cell-class-name="data-header-cell"
    :column-config="{useKey: true,resizable: true}"
    :row-config="{isCurrent: true, isHover: true}"
    :scroll-y="{enabled: true, gt: 0}"
  >
    <VxeColumn
      v-for="columnItem in props.columns"
      v-bind="columnItem"
      :key="columnItem.key"
      :field="columnItem.key"
      :title="columnItem.title"
    >
      <template #header>
        <div class="fill">
          <div> {{ i18nTranslate(columnItem.i18nLabel) }} </div>
        </div>
      </template>

      <template #default="{ column, row }">
        <template v-if="column.field === 'start'">
          <span
            class="table-click"
            @click="scrollToTimeUnix(row.startUnix)"
          >
            {{ row[column.field] }}
          </span>
        </template>
        <template v-else-if="column.field === 'end'">
          <span
            class="table-click"
            @click="scrollToTimeUnix(row.endUnix)"
          >
            {{ row[column.field] }}
          </span>
        </template>
        <template v-else>
          <span>
            {{ props.translate(row[column.field]) }}
          </span>
        </template>
      </template>
    </VxeColumn>
  </VxeTable>
</template>

<style lang="scss" scoped>
  .table {
    &-click {
      cursor: pointer;
      // &:hover {
      //   background-color: var(--i-color-row-even);
      // }
    }
  }
</style>
