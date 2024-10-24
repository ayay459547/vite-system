<script setup lang="ts">
import type { PropType } from 'vue'
import { useSlots } from 'vue'

import { ElTableColumn } from 'element-plus'

import { getUuid } from '@/lib/lib_utils' // 工具

import type { Props } from '../CustomTableInfo'

const scopedId = getUuid('__column__')

const props = defineProps({
  showColumns: {
    type: Array as PropType<Props.TableColumns>,
    required: false,
    default: () => {
      return []
    },
    description: '顯示欄位'
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

</script>

<template>
  <ElTableColumn
    v-for="column in props.showColumns"
    :key="`column-${column.prop}-${scopedId}`"
    :prop="column.prop"
    :label="column.label"
    :sortable="column.sortable"
    v-bind="column"
  >
    <template v-if="hasSlot(`header-${column.slotKey}`)" #header="scope">
      <div :class="column.sortable ? 'header-slot' : ''">
        <slot
          :name="`header-${column.slotKey}`"
          :label="column.label"
          :row-index="scope.$index"
          :column="column"
          :prop="column.prop"
        ></slot>
      </div>
    </template>
    <template v-else-if="hasSlot('header-all')" #header="scope">
      <div :class="column.sortable ? 'header-slot' : ''">
        <slot
          name="header-all"
          :label="column.label"
          :row-index="scope.$index"
          :column="column"
          :prop="column.prop"
        ></slot>
      </div>
    </template>

    <template
      v-if="hasSlot(`column-${column.slotKey}`)"
      #default="scope"
    >
      <slot
        :name="`column-${column.slotKey}`"
        :label="column.label"
        :data="scope.row[column.key]"
        :row="scope.row"
        :row-index="scope.$index"
        :column="column"
        :prop="column.prop"
      ></slot>
    </template>
    <template v-else-if="hasSlot(`column-all`)" #default="scope">
      <slot
        :name="`column-all`"
        :label="column.label"
        :data="scope.row[column.key]"
        :row="scope.row"
        :row-index="scope.$index"
        :column="column"
        :prop="column.prop"
      ></slot>
    </template>

    <TableMainColumn
      v-if="Array.isArray(column.columns) && column.columns.length > 0"
      :show-columns="column.columns"
    />
  </ElTableColumn>
</template>

<style lang="scss" scoped>

</style>
