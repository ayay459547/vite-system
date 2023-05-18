<script setup lang="ts">
import { getTableColumns } from '@/lib/columns'

const list = [
  {
    label: 'test1',
    value: '0'
  },
  {
    label: 'test2',
    value: '1'
  },
  {
    label: 'test3',
    value: '2'
  }
]

const columnSetting = {
  date: {
    label: '生日',
    table: {
      width: 150,
      // fixed: 'left',
      align: 'center'
    },
    fitler: {
      default: '',
      required: true,
      options: list
    }
  },
  name: {
    label: '姓名',
    table: {
      width: 150
    },
    fitler: {
      default: '',
      validate: ['password'],
      required: true
    }
  },
  address: {
    label: '地址',
    table: {
      minWidth: 300
    },
    fitler: {
      default: '',
      validate: ['phone'],
      required: false
    }
  }
}

const {
  columns: tableColumns,
  downloadExcel
} = getTableColumns(columnSetting, 'table')

const download = () => {
  downloadExcel(
    (column) => { return column.label ?? '' },
    (rowData, settingColumns) => {
      return settingColumns.map(column => {
        return rowData[column.key]
      })
    }, {
      label: '測試',
      settingKey: 'test',
      tableData: tableData
    }
  )
}

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Caleb',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Peter',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Amy',
    address: 'No. 189, Grove St, Los Angeles'
  }
]

</script>

<template>
  <div class="table-test">
    <div class="table-main">
      <CustomTable
        label="測試表單"
        version="1.0.0"
        setting-key="test"
        :table-data="tableData"
        :table-columns="tableColumns"
        @excel="download"
      >
        <template #header="{ column }">{{ column.label }}</template>
      </CustomTable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  &-test {
    width: 100%;
    height: 100%;
    padding: 32px;
    display: flex;
    flex-direction: column;
  }
  &-main {
    flex: 1;
    width: 100%;
  }
}
</style>