<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import type { PropType } from 'vue'
import {
  ref,
  reactive,
  inject,
  onBeforeMount,
  nextTick,
  useSlots
} from 'vue'

import { SimpleTable, CustomButton } from '@/components'
import { getSimpleTableSetting } from '@/lib/lib_columns'
import { scrollToEl } from '@/lib/lib_utils'

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return Object.prototype.hasOwnProperty.call(slots, prop)
}

const getSlot = (slotKey: string, type: ('header' | 'column')): string => {
  switch (type) {
    case 'header':
      if (hasSlot(`header-${slotKey}`)) return `header-${slotKey}`
      if (hasSlot('header-all')) return 'header-all'
      break
    case 'column':
      if (hasSlot(`column-${slotKey}`)) return `column-${slotKey}`
      if (hasSlot('column-all')) return 'column-all'
      break
  }
  return 'null'
}
const getHeaderSlot = (slotKey: string): string => {
  return getSlot(slotKey, 'header')
}
const getColumnSlot = (slotKey: string): string => {
  return getSlot(slotKey, 'column')
}

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const props = defineProps({
  columnSetting: {
    type: Object as PropType<Record<string, any>>,
    required: true,
    default () {
      return {}
    }
  },
  tableData: {
    type: Array as PropType<any[]>,
    default () {
      return []
    }
  },
  tableKey: {
    type: String as PropType<string>,
    required: false,
    default: 'table'
  }
})

const emit = defineEmits(['add', 'remove'])

const tableColumns = ref()
const showTableColumns = ref()

const add = () => {
  emit('add')

  nextTick(() => {
    const newEl = document.querySelector('.__data-table-row:last-child')
    if (newEl) scrollToEl(newEl)
  })
}

const remove = (rowIndex: number) => {
  emit('remove', rowIndex)
}

const beforeColumn = reactive({})
const afterColumn = reactive({})

onBeforeMount(() => {
  beforeColumn['row_index'] = { label: '#' }
  beforeColumn['row_index'][props.tableKey] = {
    width: 40,
    align: 'center'
  }

  afterColumn['row_operations'] = { label: '操作' }
  afterColumn['row_operations'][props.tableKey] = {
    width: 80,
    align: 'center',
    isOperations: true
  }

  // 依原來欄位設定跑 slot 迴圈
  const {
    tableColumns: _tableColumns
  } = getSimpleTableSetting(props.columnSetting, props.tableKey)
  tableColumns.value = _tableColumns

  // 顯示的欄位 + #序號 + 操作(delete)
  const {
    tableColumns: _showTableColumns
  } = getSimpleTableSetting({
    ...beforeColumn,
    ...props.columnSetting,
    ...afterColumn
  }, props.tableKey)

  showTableColumns.value = _showTableColumns
})

</script>

<template>
  <div class="form-container">
    <SimpleTable
      :table-data="props.tableData"
      :table-columns="showTableColumns"
    >
      <template
        v-for="column in tableColumns"
        :key="column.prop"
        v-slot:[getHeaderSlot(column.slotKey)]="{ key, rowIndex, data, column: _column }"
      >
        <slot
          :name="getHeaderSlot(column.slotKey)"
          :label="data"
          :row-index="rowIndex"
          :column="_column"
          :prop="key"
        ></slot>
      </template>

      <template
        v-for="column in tableColumns"
        :key="column.prop"
        v-slot:[getColumnSlot(column.slotKey)]="{ key, row, rowIndex, data, column: _column }"
      >
        <slot
          :name="getColumnSlot(column.slotKey)"
          :data="data"
          :row="row"
          :row-index="rowIndex"
          :column="_column"
          :prop="key"
        ></slot>
      </template>

      <template #header-row_index="{ data }">
        <span>{{ data }}</span>
      </template>
      <template #column-row_index="{ rowIndex }">
        <span>{{ rowIndex + 1 }}</span>
      </template>
      <template #header-row_operations="{ data }">
        <span>{{ data }}</span>
      </template>
      <template #column-row_operations="{ rowIndex }">
        <CustomButton
          type="danger"
          icon-name="trash-can"
          text
          @click="remove(rowIndex)"
        />
      </template>
    </SimpleTable>

    <CustomButton
      type="primary"
      :label="i18nTranslate('create')"
      icon-name="plus"
      icon-move="rotate"
      @click="add"
    />
  </div>
</template>

<style lang="scss" scoped>
.form {
  &-container {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 8px;
    transition-duration: 0.3s;

    position: sticky;
    left: 0;
    &:hover {
      box-shadow: 1px 1px 6px 2px #c6e2ff;
    }
  }
}
</style>