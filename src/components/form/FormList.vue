<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import type { PropType } from 'vue'
import {
  ref,
  reactive,
  inject,
  onBeforeMount,
  nextTick,
  useSlots,
  computed
} from 'vue'

import { SimpleTable, CustomButton } from '@/components'
import { getSimpleTableSetting } from '@/lib/lib_columns'
import { scrollToEl, hasOwnProperty, getUuid } from '@/lib/lib_utils'

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty.call(slots, prop)
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
  return 'empty'
}
const getHeaderSlot = (slotKey: string): string => {
  return getSlot(slotKey, 'header')
}
const getColumnSlot = (slotKey: string): string => {
  return getSlot(slotKey, 'column')
}

const hook: Hook = inject('hook')
const { i18nTranslate, swal } = hook()

const props = defineProps({
  modelValue: {
    type: Array as PropType<any[]>,
    default () {
      return []
    }
  },
  label: {
    type: String as PropType<string>,
    required: false,
    default: ''
  },
  min: {
    type: Number as PropType<number>,
    required: false,
    default: 0
  },
  max: {
    type: Number as PropType<number>,
    required: false,
    default: Infinity
  },
  columnSetting: {
    type: Object as PropType<Record<string, any>>,
    required: true,
    default () {
      return {}
    }
  },
  tableKey: {
    type: String as PropType<string>,
    required: false,
    default: 'table'
  },
  itemKey: {
    type: String as PropType<string>,
    required: false,
    default: 'key'
  }
})

const emit = defineEmits([
  'add',
  'remove',
  'update:modelValue'
])

const tempValue = computed({
  get: () => props.modelValue,
  set: (value: any[]) => {
    emit('update:modelValue', value)
  }
})

const tableColumns = ref()
const showTableColumns = ref()

const add = () => {
  if (tempValue.value.length >= props.max) {
    return swal({
      icon: 'warning',
      title: '無法新增',
      text: `資料列表不能超過 ${props.max} 筆資料`
    })
  }

  emit('add')

  nextTick(() => {
    const newEl = document.querySelector(`.__form-list${scopedId} .list-group-item:last-child`)
    if (newEl) scrollToEl(newEl)
  })
}

const remove = (rowIndex: number) => {
  if (tempValue.value.length < props.min + 1) {
    return swal({
      icon: 'warning',
      title: '無法刪除',
      text: `資料列表至少要有 ${props.min} 筆資料`
    })
  }

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
    width: 90,
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

const scopedId = getUuid()

</script>

<template>
  <div class="form-container hover-card-info" :class="`__form-list${scopedId}`">
    <div class="form-label">
      <span>{{ props.label }}</span>
    </div>
    <SimpleTable
      v-model="tempValue"
      :item-key="props.itemKey"
      is-draggable
      :handle="`.form-item-move__${scopedId}`"
      :table-data="tempValue"
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
        <label>{{ data }}</label>
      </template>
      <template #column-row_index="{ rowIndex }">
        <span>{{ rowIndex + 1 }}</span>
      </template>
      <template #header-row_operations="{ data }">
        <span>{{ data }}</span>
      </template>
      <template #column-row_operations="{ rowIndex }">
        <div class="flex-row">
          <CustomButton
            type="danger"
            icon-name="trash-can"
            text
            @click="remove(rowIndex)"
          />
          <CustomButton
            type="info"
            icon-name="bars"
            text
            :class="`form-item-move__${scopedId}`"
          />
        </div>
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
  }

  &-label {
    width: 100%;
  }
}
</style>