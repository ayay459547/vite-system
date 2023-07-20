<script setup lang="ts">
import { CustomTable, CustomInput } from '@/components'
import { getTableSetting } from '@/lib/lib_columns'
import { ref } from 'vue'

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

const tableOptions = {
  title: '測試表單',
  version: '1.0.0',
  settingKey: 'test'
}
const { tableSetting, downloadExcel } = getTableSetting(columnSetting, 'table', tableOptions)

const download = () => {
  downloadExcel(tableData)
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

const initData = (props: any) => {
  console.log('init data', props)
}

const filterName = ref('')

</script>

<template>
  <div class="table-test">
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