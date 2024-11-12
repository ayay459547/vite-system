<script setup lang="ts">
import { inject, useSlots, computed, reactive } from 'vue'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { CustomDraggable, CustomScrollbar, CustomIcon } from '@/components' // 系統組件
import { getUuid, isEmpty } from '@/lib/lib_utils' // 工具

import type { Types, Emits, Expose } from './SimpleTableInfo'
import { version, props as simpleCustomTableProps } from './SimpleTableInfo'

const scopedId = getUuid(version)

const props = defineProps(simpleCustomTableProps)

const emit = defineEmits([
  'update:modelValue',
  'expand-change'
])

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: props.i18nModule
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const tempValue = computed({
  get: () => {
    if(!isEmpty(props.modelValue)) {
      return props.modelValue
    }
    return props.tableData
  },
  set: (value: any[]) => {
    emit('update:modelValue', value)
  }
})

// 顯示欄位
const showTableColumns = computed(() => {
  const showColumns = [...props.tableColumns]

  if (hasSlot('row-expand')) {
    showColumns.unshift({
      width: 40,
      align: 'center',
      key: 'row-expand',
      slotKey: 'row-expand',
      isOperations: true
    })
  }

  return showColumns
})

// slot
const getSlot = (slotKey: string, isHeader: boolean) => {
  if (slotKey === 'row-expand') return null

  if (isHeader) {
    if (hasSlot(`header-${slotKey}`)) return `header-${slotKey}`
    if (hasSlot('header-all')) return 'header-all'

  } else {
    if (hasSlot(`column-${slotKey}`)) return `column-${slotKey}`
    if (hasSlot('column-all')) return 'column-all'
  }

  return null
}

const getRowStyle = (options: any) => {
  const { rowData, rowIndex } = options

  let rowStyle = {}
  if (typeof props.rowStyle === 'function') {
    rowStyle = props.rowStyle({
      row: rowData,
      rowIndex
    }, [])
  }

  return rowStyle
}

const getRowClass = (options: any) => {
  const { rowData, rowIndex } = options

  let rowClass = ''
  if (typeof props.rowClassName === 'function') {
    rowClass = props.rowClassName({
      row: rowData,
      rowIndex
    }, [])
  }

  return [
    rowIndex % 2 === 0 ? 'is-even' : '',
    rowClass
  ]
}

// 綁定欄位 style
const getCellStyle = (options: any) => {
  const { rowData, rowIndex, column, columnIndex } = options
  const { width = 0, minWidth = 0 } = column ?? {}

  let cellStyle = {}
  // body 限定, header: -1
  if (rowIndex >= 0 && typeof props.cellStyle === 'function') {
    cellStyle = props.cellStyle({
      row: rowData,
      rowIndex,
      column,
      columnIndex
    }, [])
  }

  let showStyle = {...cellStyle}
  if (width > 0) {
    showStyle['width'] = `${width}px`
    showStyle['max-width'] = `${width}px`
    showStyle['min-width'] = `${width}px`
  }
  if (minWidth > 0) {
    showStyle['width'] = `${minWidth}px`
    showStyle['min-width'] = `${width}px`
  }
  return showStyle
}

// 綁定欄位 class
const getCellClass = (options: any) => {
  const { rowData, rowIndex, column, columnIndex } = options

  let cellClass: any = []
  // body 限定, header: -1
  if (rowIndex >= 0 && typeof props.cellClassName === 'function') {
    cellClass = props.cellClassName({
      row: rowData,
      rowIndex,
      column,
      columnIndex
    }, [])
  }

  const showClass = Array.isArray(cellClass) ? cellClass : [cellClass]
  return [
    ...showClass,
    `column-${column?.align ?? 'left'}`
  ]
}

// expand
const expandSet = reactive(new Set())

const changeExpand = (options: Types.ExpandOptions) => {
  const { rowKey, row, rowIndex } = options
  if (!expandSet.has(rowKey)) {
    expandSet.add(rowKey)
  } else {
    expandSet.delete(rowKey)
  }

  onExpandChange(row, expandSet.has(rowKey), rowIndex, rowKey)
}
const onExpandChange: Emits.ExpandChange = (row: any, expanded: boolean, rowIndex: number, rowKey: any) => {
  emit('expand-change', row, expanded, rowIndex, rowKey)
}

const setExpand: Expose.SetExpand = (options?: Types.ExpandOptions, expanded?: boolean) => {
  console.log({ options, expanded })
}
// const toggleRowExpansion = (row: any, expanded?: boolean) => {
//   const tempRow = row[props.itemKey] ??
// }
defineExpose({ setExpand })

</script>

<template>
  <div class="simple-table" :class="scopedId">
    <CustomScrollbar>
      <div class="simple-table-container">
        <!-- header -->
        <div v-if="!props.hideHeader" class="simple-table-header">
          <div
            v-for="(column, columnIndex) in showTableColumns"
            :key="`header-${column.key}`"
            :style="getCellStyle({ rowData: {}, rowIndex: -1, column, columnIndex })"
            :class="getCellClass({ rowData: {}, rowIndex: -1, column, columnIndex })"
            class="simple-table-column"
          >
            <slot
              :name="getSlot((column?.slotKey ?? column.key), true)"
              :key="column.key"
              :prop="column.key"
              :row="[]"
              :row-index="-1"
              :column="column"
              :column-index="columnIndex"
              :data="i18nTranslate(column?.i18nLabel ?? column.label)"
            >
              {{ i18nTranslate(column?.i18nLabel ?? column.label) }}
            </slot>
          </div>
        </div>
        <!-- body -->
        <CustomDraggable
          v-if="Array.isArray(tempValue) && tempValue.length > 0"
          v-model="tempValue"
          :handle="props.handle"
          :group="props.group"
          :itemKey="props.itemKey"
          :move="props.move"
          :disabled="props.isDraggable ? props.disabled : true"
          class="simple-table-body"
        >
          <template #item="{ element: rowData, index: rowIndex }">
            <div class="simple-table-row-container">
              <div
                class="simple-table-row"
                :style="getRowStyle({ rowData, rowIndex })"
                :class="getRowClass({ rowData, rowIndex })"
              >
                <div
                  v-for="(column, columnIndex) in showTableColumns"
                  :key="`column-${column.key}`"
                  :style="getCellStyle({ rowData, rowIndex, column, columnIndex })"
                  :class="getCellClass({ rowData, rowIndex, column, columnIndex })"
                  class="simple-table-column"
                >
                  <slot
                    :name="getSlot((column?.slotKey ?? column.key), false)"
                    :key="column.key"
                    :prop="column.key"
                    :row="rowData"
                    :row-index="rowIndex"
                    :column="column"
                    :column-index="columnIndex"
                    :data="rowData[column.key]"
                  >
                    {{ rowData[column.key] }}
                  </slot>
                  <div
                    v-if="column.key === 'row-expand'"
                    class="row-expand"
                    @click="changeExpand({
                      rowKey: rowData[props.itemKey],
                      row: rowData,
                      rowIndex
                    })"
                  >
                    <CustomIcon
                      name="angle-right"
                      class="arrow"
                      :class="expandSet.has(rowData[props.itemKey]) ? 'is-open' : ''"
                    />
                  </div>
                </div>
              </div>
              <div v-if="expandSet.has(rowData[props.itemKey])" class="simple-table-row-expand">
                <slot
                  name="row-expand"
                  :row-key="rowData[props.itemKey]"
                  :row="rowData"
                  :row-index="rowIndex"
                  :expanded="expandSet.has(rowData[props.itemKey])"
                ></slot>
              </div>
            </div>
          </template>
        </CustomDraggable>
        <div v-else class="simple-table-emtpy">{{ i18nTranslate('empty-data') }}</div>
      </div>
    </CustomScrollbar>
  </div>
</template>

<style lang="scss" scoped>
div[class*="__SimpleTable"] {
  &.simple-table {
    border-radius: 6px;
    border: 1px solid var(--el-border-color);
    width: 100%;
    height: 100%;
    // overflow: auto;
  }
  .simple-table {
    &-container {
      width: fit-content;
      min-width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    &-header {
      height: fit-content;
      display: flex;
      background-color: var(--i-color-table-thead);
      color: var(--el-table-header-text-color);
      border-bottom: 1px solid var(--el-table-border-color);
      z-index: 1;
      position: sticky;
      top: 0;
      transform: translateY(-1px);
      color: var(--el-text-color-primary);
    }

    &-emtpy {
      padding: 12px 16px;
      font-size: 1.2em;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-row {
      &-container {
        width: 100%;
      }

      & {
        width: 100%;
        display: flex;
        background-color: var(--i-color-table-odd);
        transition-duration: 0.3s;
        border-bottom: 1px solid var(--el-border-color);
        // content-visibility: auto;
      }
      &:hover {
        background-color: var(--i-color-table-odd-hover);
      }
      &.is-even {
        background-color: var(--i-color-table-even);
        &:hover {
          background-color: var(--i-color-table-even-hover);
        }
      }

      &-expand {
        border-bottom: 1px solid var(--el-border-color);
      }
    }

    &-column {
      flex: 1;
      padding: 8px;
      background-color: inherit;
      border-left: 1px solid var(--el-border-color);

      display: flex;
      justify-content: flex-start;
      align-items: center;

      .row-expand {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        cursor: pointer;

        & > .arrow {
          transition-duration: 0.2s;
        }
        & > .is-open {
          transform: rotateZ(90deg);
        }
      }

      &.column {
        &-left { justify-content: flex-start; }
        &-center { justify-content: center; }
        &-right { justify-content: flex-end; }
      }

      &:nth-child(1) {
        border-left: none;
      }
    }
  }
}
</style>
