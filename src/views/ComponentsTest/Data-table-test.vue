<script setup lang="ts">
import { DataTable } from '@/components'
import { getDataTableSetting } from '@/lib/columns'

const columnsSetting = {
  date: {
    label: '生日',
    table: {
      width: 150,
      align: 'center'
    },
    form: {
      default: null,
      validate: [],
      required: true
    }
  },
  name: {
    label: '姓名',
    table: {
      width: 150
    },
    form: {
      default: null,
      validate: [],
      required: true
    }
  },
  address: {
    label: '地址',
    table: {
      minWidth: 300
    },
    form: {
      default: null,
      required: false,
      options: [
        { label: 'address-1-No. 189, Grove St, Los Angeles', value: 'address-1' },
        { label: 'address-2-No. 177, Grove St, Los Angeles', value: 'address-2' },
        { label: 'address-3-No. 123, Grove St, Los Angeles', value: 'address-3' }
      ]
    }
  }
}

const {
  tableColumns
} = getDataTableSetting(columnsSetting, 'table')

const tableData = [
{
    id: 1,
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 2,
    date: '2016-05-02',
    name: 'Caleb',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 21,
    date: '2016-05-02',
    name: 'Caleb2',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 22,
    date: '2016-05-02',
    name: 'Caleb3',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 3,
    date: '2016-05-04',
    name: 'Peter',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 4,
    date: '2016-05-01',
    name: 'Amy',
    address: 'address-1'
  }
]

</script>

<template>
  <div class="data-table">
    <h1>Data-table-test</h1>

    <div class="i-mt-xl">
      <DataTable
        :table-data="tableData"
        :table-columns="tableColumns"
      >
        <template #header-all="{ data }">
          {{ data + ' ==> header' }}
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.data-table {
  width: 100%;
  height: 100%;
  padding: 32px;
}
</style>