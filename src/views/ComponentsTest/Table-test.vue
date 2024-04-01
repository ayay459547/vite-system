<script setup lang="ts">
import { ref, reactive } from 'vue'

import { CustomTable, CustomInput, CustomButton } from '@/components'
import { useTableSetting } from '@/lib/lib_columns'
import type { TableOptions } from '@/lib/lib_columns'

const columnSetting = {
  date: {
    label: '生日',
    table: {
      width: 150,
      align: 'left',
      sortable: false
    }
  },
  name: {
    label: '姓名',
    table: {
      width: 200
    }
  },
  address: {
    label: '地址',
    table: {
      minWidth: 300
    }
  }
}

const tableOptions: TableOptions = {
  title: '測試表單',
  version: '1.0.0',
  settingKey: 'test'
}
const { tableSetting, downloadExcel } = useTableSetting(columnSetting, 'table', tableOptions)

const download = () => {
  downloadExcel(tableData)
}

const tableData = reactive([
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
])

const initData = (props: any) => {
  console.log('init data', props)
}

const filterName = ref('')

const addData = () => {
  tableData.push({
    date: '2023-08-21',
    name: `test-${tableData.length}`,
    address: 'TESTAddress'
  })
}

</script>

<template>
  <div class="table-test">
    <CustomButton
      label="測試新增資料"
      @click="addData"
    />
    <div class="table-main">
      <CustomTable
        :table-data="tableData"
        v-bind="tableSetting"
        @excel="download"
        @change-setting="initData"
      >
        <template #header-name="{ column }">
          <CustomInput
            v-model="filterName"
            direction="row"
            :label="column.label"
          />
        </template>
        <template #header-date="{ column }">
          {{  column.label }}
        </template>
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
