<script setup lang="ts">
import { ref, shallowRef, reactive, inject, onMounted, nextTick } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { CustomIcon, CustomButton, CustomModal } from '@/components/feature'
import { CustomInput } from '@/components/input'
import { CustomTable } from '@/components/table'
import { useTableSetting, useFormSetting } from '@/lib/lib_columns'
import type { TableOptions } from '@/types/types_columnSetting'

import type { TableData } from './api'
import { getData, getDataCount, getExcelData } from './api'
import { columnSetting } from './columns'

import DetailModal from './Components/DetailModal.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook()

// table
const tableData = shallowRef<TableData[]>([])
const tableDataCount = ref(0)

const {
  columns: filterColumns,
  forms: filter,
  getActiveForms: getFilter
} = useFormSetting(columnSetting, 'filter')

const tableOptions: TableOptions = {
  title: i18nTranslate('testTable'),
  version: '1.0.0',
  settingKey: 'nav1-1-2',
  size: 30
}

const { tableSetting, downloadExcel, getParams, changePage } = useTableSetting(
  columnSetting,
  'table',
  tableOptions
)

const onExcelClick = async ({ type }) => {
  let excelData: any[] = []
  const apiParam = {
    ...(getParams(tableRef.value) as any)
  }

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
  await nextTick()

  let apiParam = null
  if (typeof props === 'object') {
    apiParam = {
      ...props,
      ...getFilter(false)
    }
  } else {
    apiParam = {
      ...getParams(tableRef.value),
      ...getFilter(false)
    }
  }

  if (props === 'input') {
    changePage()
  }

  const [resData, resDataCount] = await Promise.all([getData(apiParam), getDataCount(apiParam)])

  tableData.value = resData
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
        :label="i18nTranslate('refresh')"
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
      <DetailModal :data="currnetData" />
    </CustomModal>

    <CustomTable
      ref="tableRef"
      :table-data="tableData"
      :table-data-count="tableDataCount"
      v-bind="tableSetting"
      :title="i18nTranslate('todoList')"
      @excel="onExcelClick"
      @show-change="init"
    >
      <template #header-all="{ prop }">
        <CustomInput v-model="filter[prop]" v-bind="filterColumns[prop]" @change="init('input')">
          <template #suffix>
            <CustomIcon name="search" />
          </template>
        </CustomInput>
      </template>
      <template #header-completed="{ prop }">
        <CustomInput v-model="filter[prop]" v-bind="filterColumns[prop]" @change="init('input')" />
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
