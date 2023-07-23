<script setup lang="ts">
import { CustomTable, CustomInput } from '@/components'
import { getTableSetting, getFormSetting } from '@/lib/lib_columns'
import { ref, onMounted } from 'vue'
import { getData, getDataCount } from './api'

type TableData = {
  title: string
  path: string
  breadcrumbTitle: string
}

const columnSetting = {
  title: {
    label: '名稱',
    table: {
      width: 300
    },
    filter: {
      default: null
    }
  },
  path: {
    label: '路由',
    table: {
      width: 300
    },
    filter: {
      default: null
    }
  },
  breadcrumbTitle: {
    label: '路徑',
    table: {
      minWidth: 300
    },
    filter: {
      default: null
    }
  }
}

const tableData = ref<TableData[]>([])
const tableDataCount = ref(0)

const tableOptions = {
  title: '功能列表',
  version: '1.0.0',
  settingKey: 'feature-list'
}
const { tableSetting, downloadExcel, getParams } = getTableSetting(columnSetting, 'table', tableOptions)

const download = () => {
  downloadExcel(tableData.value)
}

// filter
const {
  columns: filterColumn,
  forms: filter
} = getFormSetting<TableData>(columnSetting, 'filter')

const isLoading = ref(false)

const table = ref()

const init = () => {
  isLoading.value = true

  tableData.value = getData({
    ...filter,
    ...getParams(table.value)
  })

  tableDataCount.value = getDataCount({ ...filter })

  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

onMounted(() => {
  init()
})

</script>

<template>
  <div v-i-loading="isLoading" class="table-test">
    <div class="table-main">
      <CustomTable
        ref="table"
        :table-data="tableData"
        :table-data-count="tableDataCount"
        v-bind="tableSetting"
        @excel="download"
        @show-change="init()"
      >
        <template #header-all="{ prop }">
          <CustomInput
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
            direction="row"
            @change="init()"
          />
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