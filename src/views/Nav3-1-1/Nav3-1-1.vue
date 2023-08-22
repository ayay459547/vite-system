<script setup lang="ts">
import {
  CustomTable,
  CustomInput,
  CustomButton
} from '@/components'
import { getTableSetting } from '@/lib/lib_columns'
import { ref, onBeforeMount, reactive } from 'vue'

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

const tableData = reactive([])

const lazyLoadingStatus = ref('loadMore')

const initData = (props: any) => {
  console.log('init data', props)

  loadData(false)
}

const loadData = (delay = true) => {
  lazyLoadingStatus.value = 'loading'

  const temp = [
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
  ].flatMap(item => {
    const res = []

    for (let i = 0; i < 25; i++) {
      res.push({
        date: `${item.date}-${i}`,
        name: `${item.name}-${i}`,
        address: `${item.address}-${i}`
      })
    }

    return res
  })

  if (delay) {
    setTimeout(() => {
      console.log(temp)
      tableData.push(...temp)

      if (tableData.length >= 300) {
        lazyLoadingStatus.value = 'noMore'
      } else {
        lazyLoadingStatus.value = 'loadMore'
      }
    }, 3000)
  } else {
    setTimeout(() => {
      tableData.push(...temp)
      lazyLoadingStatus.value = 'loadMore'
    }, 0)
  }
}

const filterName = ref('')

const addData = () => {
  tableData.push({
    date: '2023-08-21',
    name: `test-${tableData.length}`,
    address: 'TESTAddress'
  })
}

onBeforeMount(() => {
  lazyLoadingStatus.value = 'loadMore'
  initData('')
})

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
        :table-data-count="tableData.length"
        v-bind="tableSetting"
        lazy-loading
        :lazy-loading-status="lazyLoadingStatus"
        show-no
        @excel="download"
        @change-setting="initData"
        @load="loadData"
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
    gap: 16px;
  }
  &-main {
    flex: 1;
    width: 100%;
  }
}
</style>