<script setup lang="ts">
import { DataTable, CustomInput, CustomIcon } from '@/components'
import { getDataTableSetting } from '@/lib/columns'
import { ref } from 'vue'

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

const text = ref('')

const onFocus = ($event: FocusEvent) => {
  console.log('onFocus', $event)
}
const onClear = () => {
  console.log('onClear')
}
const onBlur = ($event: FocusEvent) => {
  console.log('onBlur', $event)
}
const onChange = (value: string) => {
  console.log('onChange', value)
}
const onInput = (value: string) => {
  console.log('onInput', value)
}
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

    <CustomInput
      v-model="text"
      label="測試一般輸入框"
      class="i-mt-xl"
      clearable
      @focus="onFocus"
      @clear="onClear"
      @blur="onBlur"
      @change="onChange"
      @input="onInput"
    >
      <template #prepend>
        <span>prepend</span>
      </template>
      <template #append>
        <span>append</span>
      </template>
      <template #prefix>
        <CustomIcon name="check"/>
      </template>
    </CustomInput>
  </div>
</template>

<style lang="scss" scoped>
.data-table {
  width: 100%;
  height: 100%;
  padding: 32px;
}
</style>