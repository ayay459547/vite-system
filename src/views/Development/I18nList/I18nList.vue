<script setup lang="ts">
import { ref, shallowRef, onMounted, nextTick } from 'vue'

import { CustomTable } from '@/components/table'
import { CustomInput } from '@/components/input'
import { useTableSetting, useFormSetting } from '@/lib/lib_columns'
import type { TableOptions } from '@/types/types_columnSetting'

import { columnSetting } from './columns'
import { type TableData, getData, getDataCount } from './api'

const tableData = shallowRef<TableData[]>([])
const tableDataCount = ref(0)

const tableOptions: TableOptions = {
  title: '翻譯值列表',
  version: '1.0.1',
  settingKey: 'i18n-list'
}
const { tableSetting, downloadExcel, getParams } = useTableSetting(
  columnSetting,
  'table',
  tableOptions
)

const onExcelClick = () => {
  downloadExcel(tableData.value)
}

// filter
const { columns: filterColumn, forms: filter } = useFormSetting<TableData>(columnSetting, 'filter')

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
  <div v-loading="isLoading" class="table-test">
    <div class="table-main">
      <CustomTable
        ref="table"
        :table-data="tableData"
        :table-data-count="tableDataCount"
        v-bind="tableSetting"
        is-show-no
        @excel="onExcelClick"
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
