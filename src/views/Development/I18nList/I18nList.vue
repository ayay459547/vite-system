<script setup lang="ts">
import { CustomTable, CustomInput } from '@/components'
import { getTableSetting, getFormSetting } from '@/lib/lib_columns'
import { ref, onMounted, nextTick } from 'vue'
import { columnSetting } from './columns'
import type { TableData } from './api'
import { getData, getDataCount } from './api'

const tableData = ref<TableData[]>([])
const tableDataCount = ref(0)

const tableOptions = {
  title: '翻譯值列表',
  version: '1.0.1',
  settingKey: 'i18n-list'
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

const init = async () => {
  isLoading.value = true
  await nextTick()

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
        show-no
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