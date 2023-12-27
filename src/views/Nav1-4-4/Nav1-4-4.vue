<script setup lang="ts">
import { ElTableV2 } from 'element-plus'

import { CustomDivider, CustomTableV2 } from '@/components'

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    prop: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150
  }))

const generateData = (columns: ReturnType<typeof generateColumns>, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) => {
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

const columns = generateColumns(10)
const data = generateData(columns, 1000)
</script>

<template>
  <div class="page">
    Nav1-4-4
    <ElTableV2 :columns="columns" :data="data" :width="700" :height="400" fixed />

    <CustomDivider />

    <div class="page-table">
      <CustomTableV2 :data="data" :columns="columns">
        <template #header-all="{ column }">
          <label>{{ column.title }}</label>
        </template>
        <template #column-all="{ row, prop }">
          <span>{{ row[prop] }}</span>
        </template>
      </CustomTableV2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;

  &-table {
    width: 100%;
    height: 400px;
    border: 1px solid green;
  }
}
</style>
