<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import { ref, reactive, inject, onMounted } from 'vue'
import {
  CustomButton,
  CustomTable,
  CustomInput,
  CustomModal
} from '@/components'

import { deepClone, usePageI18n } from '@/lib/lib_utils'
import { getTableSetting, getFormSetting } from '@/lib/lib_columns'

import type { TableData } from './api'
import { getData, getDataCount, getExcelData } from './api'
import { columnSetting } from './columns'

import message from './i18n'

import DetailModal from './Components/DetailModal.vue'

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
    changePage()
  }

  const [resData, resDataCount ] = await Promise.all([ getData(apiParam), getDataCount(apiParam) ])

  tableData.value = deepClone([], resData)
  tableDataCount.value = resDataCount

  isLoading.value = false
}

onMounted(() => {
  init()
})

// modal
const model = reactive({
  detail: false
})
const currnetData = ref()

const onUserIdClick = (rowData: any) => {
  currnetData.value = rowData

  model.detail = true
}

</script>

<template>
  <div v-loading="isLoading" class="page">
    <!-- <div class="flex-row content-end">
      <CustomButton
        :label="i18nTranslate('refrush')"
        icon-name="rotate"
        icon-move="rotate"
        @click="init()"
      />
    </div> -->

    <CustomModal
      v-model="model.detail"
      :title="i18nTranslate('detail')"
      click-outside
      @submit="model.detail = false"
    >
      <DetailModal :data="currnetData"/>
    </CustomModal>

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
        <CustomInput
          v-model="filter[prop]"
          v-bind="filterColumns[prop]"
          @change="init('input')"
        />
      </template>

      <template #column-userId="{ data, row }">
        <CustomButton
          :label="`${data}`"
          type="primary"
          icon-name="info"
          text
          @click="onUserIdClick(row)"
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