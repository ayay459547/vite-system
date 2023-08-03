<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import { ref, inject, onMounted } from 'vue'
import {
  CustomButton,
  CustomTable,
  CustomInput,
  CustomSelect
} from '@/components'

import { deepClone, usePageI18n } from '@/lib/lib_utils'
import { getTableSetting, getFormSetting } from '@/lib/lib_columns'

import type { TableData } from './api'
import { getData, getDataCount, getExcelData } from './api'
import { columnSetting } from './columns'

import message from './i18n'

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const { i18nTranslate: pageTranslate } = usePageI18n(message)

// table
const tableData = ref<TableData[]>([])
const tableDataCount = ref(0)

const {
  columns: filterColumns,
  forms: filter
} = getFormSetting(columnSetting, 'filter')

const tableOptions = {
  title: pageTranslate('testTable'),
  version: '1.0.0',
  settingKey: 'nav1-1-2',
  size: 30
}

const {
  tableSetting,
  downloadExcel,
  getParams,
  changePage
} = getTableSetting(columnSetting, 'table', tableOptions)

const download = async ({ type }) => {
  let excelData: any[] = []
  const apiParam = {
    ...getParams(tableRef.value) as any
  }.$filter(item => item !== null)

  switch (type) {
    case 'all':
      excelData = await getExcelData(apiParam)
      break
    case 'page':
      excelData = tableData.value
      break
  }
  downloadExcel(excelData)
}

const tableRef = ref(null)
const isLoading = ref(false)

const init = async (props?: any) => {
  isLoading.value = true

  let apiParam = null
  if (typeof props === 'object') {
    apiParam = {
      ...props,
      ...filter as any
    }.$filter(item => item !== null)
  } else {
    apiParam = {
      ...getParams(tableRef.value),
      ...filter as any
    }.$filter(item => item !== null)
  }

  if (props === 'input') {
    changePage(tableRef.value)
  }

  const [resData, resDataCount ] = await Promise.all([ getData(apiParam), getDataCount(apiParam) ])

  tableData.value = deepClone([], resData)
  tableDataCount.value = resDataCount

  isLoading.value = false
}

onMounted(() => {
  init()
})

</script>

<template>
  <div v-i-loading="isLoading" class="page">
    <div class="flex-row content-end">
      <CustomButton
        :label="i18nTranslate('refrush')"
        icon-name="rotate"
        icon-move="rotate"
        @click="init()"
      />
    </div>

    <CustomTable
      ref="tableRef"
      :table-data="tableData"
      :table-data-count="tableDataCount"
      v-bind="tableSetting"
      :title="pageTranslate('todoList')"
      @excel="download"
      @show-change="init"
    >
      <template #header-all="{ prop }">
        <CustomInput
          v-model="filter[prop]"
          v-bind="filterColumns[prop]"
          @change="init('input')"
        />
      </template>
      <template #header-completed="{ prop }">
        <CustomSelect
          v-model="filter[prop]"
          v-bind="filterColumns[prop]"
          @change="init('input')"
        />
      </template>
    </CustomTable>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>