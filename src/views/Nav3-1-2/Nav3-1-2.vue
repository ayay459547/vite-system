<script setup lang="tsx">
import type { FunctionalComponent } from 'vue'
import { cloneVNode } from 'vue'
import { CustomTableV2 } from '@/components'

import type { HeaderClassNameGetter, TableV2CustomizedHeaderSlotParam } from 'element-plus'
import { TableV2FixedDir, TableV2Placeholder } from 'element-plus'

const generateColumns = (length = 10, prefix = 'column-', props?: any) => {
  return  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150
  }))
}

const generateData = (columns: ReturnType<typeof generateColumns>, length = 200, prefix = 'row-') => {
  return Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null
      }
    )
  })
}

const columnTotal = 30
const columns = generateColumns(columnTotal)
const data = generateData(columns, 10000)

const CustomizedHeader: FunctionalComponent<TableV2CustomizedHeaderSlotParam> = (bindProps: any) => {
  const { cells, columns, headerIndex } = bindProps

  if (headerIndex === 2) return cells

  const groupCells = [] as typeof cells
  let width = 0
  let idx = 0

  columns.forEach((column, columnIndex) => {
    if (column.placeholderSign === TableV2Placeholder) {
      groupCells.push(cells[columnIndex])
    } else {
      width += cells[columnIndex].props!.column.width
      idx++

      const nextColumn = columns[columnIndex + 1]
      if (
        columnIndex === columns.length - 1 ||
        nextColumn.placeholderSign === TableV2Placeholder ||
        idx === (headerIndex === 0 ? 4 : 2)
      ) {
        groupCells.push(
          <div
            class="flex items-center justify-center custom-header-cell"
            role="columnheader"
            style={{
              ...cells[columnIndex].props!.style,
              width: `${width}px`
            }}
          >
            Group width {width}
          </div>
        )
        width = 0
        idx = 0
      }
    }
  })
  return groupCells
}

const rowSpanIndex = 0
columns[rowSpanIndex].rowSpan = ({ rowIndex }) => {
  return rowIndex % 2 === 0 && rowIndex <= data.length - 2 ? 2 : 1
}

const fixedColumns = columns.map((column, columnIndex) => {
  let fixed: TableV2FixedDir | undefined = undefined
  let width: number = 80
  if (columnIndex < 3) {
    fixed = TableV2FixedDir.LEFT
    width = 150
  }
  if (columnIndex > (columnTotal - 3)) {
    fixed = TableV2FixedDir.RIGHT
    width = 100
  }
  return {
    ...column,
    fixed,
    width,
    rowSpan: ({ rowIndex }) => {
      return rowIndex % 2 === 0 && rowIndex <= data.length - 2 ? 2 : 1
    }
    // headerCellRenderer
  }
})

const Row = (bindProps: any) => {
  const { rowData, rowIndex, cells, columns } = bindProps
  // console.log('Row => ', bindProps)

  const rowSpan = columns[rowSpanIndex].rowSpan({ rowData, rowIndex })
  if (rowSpan > 1) {
    const cell = cells[rowSpanIndex]
    const style = {
      ...cell.props.style,
      backgroundColor: 'var(--el-color-primary-light-3)',
      height: `${rowSpan * 50 - 1}px`,
      alignSelf: 'flex-start',
      zIndex: 1
    }
    cells[rowSpanIndex] = cloneVNode(cell, { style })
  }
  return cells
}

const headerClass = ({ headerIndex }: Parameters<HeaderClassNameGetter<any>>[0]) => {
  if (headerIndex === 1) return 'el-primary-color'
  return ''
}

</script>

<template>
  <div class="i-page">
    <CustomTableV2
      scrollbar-always-on
      fixed
      :columns="fixedColumns"
      :data="data"
      :header-height="[40, 40, 40]"
      :footer-height="40"
      :header-class="headerClass"
    >
      <template #header="props">
        <CustomizedHeader v-bind="props" />
      </template>

      <template #row="props">
        <Row v-bind="props" />
      </template>

      <template #footer>
        <div
          class="flex flex-center"
          style="
            justify-content: center;
            height: 100%;
            background-color: var(--el-color-primary-light-7);
          "
        >
          Display a message in the footer
        </div>
      </template>

      <!-- <template #overlay="scope">
        <div>{{ $log(scope) }} overlay</div>
      </template> -->
    </CustomTableV2>
  </div>
</template>

<style>
.el-table-v2__header-row .custom-header-cell,
.el-table-v2__header-cell,
.el-table-v2__row-cell {
  border-right: 1px solid var(--el-border-color);
  justify-content: center;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.el-table-v2__header-row .custom-header-cell:last-child {
  border-right: none;
}

.el-primary-color {
  background-color: var(--el-color-primary-light-7);
  font-size: 14px;
  font-weight: bold;
}

.el-primary-color
.custom-header-cell {
  padding: 0 4px;
}
</style>
