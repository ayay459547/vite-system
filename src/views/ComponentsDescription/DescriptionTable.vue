
<script setup lang="ts">
import {
  CustomDivider,
  CustomMarkdown,
  CustomTable
} from '@/components'

import type { TableParams } from '@/components'

import markdown from '@/components/feature/CustomTable/CustomTable.md?raw'

import { getTableSetting } from '@/lib/lib_columns'

const tableColumns1 = [
  { key: 'name', label: '名稱', sortable: 'coutom', prop: 'name', width: 150 },
  { key: 'age', label: '年齡', sortable: 'coutom', prop: 'age', width: 120 },
  { key: 'address', label: '地址', sortable: 'coutom', prop: 'address', minWidth: 200 }
]
const tableData1 = [
  { id: 1, name: 'Bret', age: 13, address: 'Apt. 556, Kulas Light, Gwenborough' },
  { id: 2, name: 'Antonette', age: 22, address: 'Suite 879, Victor Plains, Wisokyburgh' },
  { id: 3, name: 'Karianne', age: 34, address: 'Suite 847, Douglas Extension, McKenziehaven' },
  { id: 4, name: 'Samantha', age: 14, address: 'Apt. 692, Hoeger Mall, South Elvis' },
  { id: 5, name: 'Kamren', age: 56, address: 'Suite 351, Skiles Walks, Roscoeview' },
  { id: 6, name: 'Maxime_Nienow', age: 72, address: 'Suite 729, Ellsworth Summit, Aliyaview' }
]

const columnSetting = {
  name: {
    label: '姓名',
    table: { width: 200 }
  },
  date: {
    label: '生日',
    table: { width: 200, align: 'center' }
  },
  address: {
    label: '地址',
    table: {minWidth: 300 }
  }
}
const tableOptions = {
  title: '表格組件(使用 getTableSetting)',
  version: '1.0.0',
  settingKey: 'description-table-1',
  sorting: true
}
const { tableSetting, downloadExcel } = getTableSetting(columnSetting, 'table', tableOptions)

const tableData2 = [
  {
    id: 1,
    name: 'Dennis',
    date: '2016-05-03',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 2,
    name: 'Schulist',
    date: '2022-01-30',
    address: 'Apt. 950, South Christy, Norberto Crossing',
    children: [
      {
        id: 21,
        name: 'Lockman',
        date: '1995-10-22',
        address: 'Suite 280, Howemouth, Rex Trail'
      },
      {
        id: 22,
        name: 'Skiles',
        date: '1865-12-02',
        address: 'Suite 729, Aliyaview, Ellsworth Summit'
      }
    ]
  },
  {
    id: 3,
    name: 'Clementina',
    date: '2016-05-04',
    address: 'Suite 449, Bartholomebury, Dayna Park'
  },
  {
    id: 4,
    name: 'Delphine',
    date: '1998-04-01',
    address: 'Suite 198, Lebsackbury, Kattie Turnpike'
  }
]
const download = () => {
  downloadExcel(tableData2)
}

const onTableChange = ({ sortingList }: TableParams) => {
  console.log(sortingList)
}

</script>

<template>
  <div class="page">
    <div style="width: 100%; height: 400px;">
      <CustomTable
        :table-data="tableData2"
        :table-data-count="500"
        show-no
        v-bind="tableSetting"
        @excel="download"
        @show-change="onTableChange"
      >
        <template #header-all="{ column }">{{ `${column.label} { 可自訂 }` }}</template>
        <template #column-all="{ row, prop }">{{ `${row[prop]} { 可自訂 }` }}</template>
      </CustomTable>
    </div>

    <div style="width: 100%; height: 400px;">
      <CustomTable
        title="表格組件(不使用 getTableSetting)"
        version="1.0.0"
        setting-key="test-table-1"
        row-key="id"
        :table-data="tableData1"
        :table-data-count="300"
        :table-columns="tableColumns1"
      >
        <template #row-expand="{ rowIndex }">
          <div class="i-pa-xl">
            {{ `#${rowIndex + 1} { 可自訂 }` }}
          </div>
        </template>
      </CustomTable>
    </div>

    <CustomDivider>markdown</CustomDivider>
    <CustomMarkdown :text="markdown" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px;
}
</style>
