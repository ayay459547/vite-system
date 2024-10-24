<script setup lang="ts">
import { ref, reactive, shallowRef, onMounted, nextTick, inject } from 'vue'

import type { UseHook, SwalResult } from '@/declare/hook'
import {
  CustomIcon,
  CustomModal,
  CustomButton,
  CustomTable,
  CustomSearch,
  GroupSearch
} from '@/components' // 系統組件
import { useTableSetting, useFormSetting } from '@/lib/lib_columns'
import throttle from '@/lib/lib_throttle'
import type { TableOptions } from '@/declare/columnSetting'

import { columnSetting } from './columns'
import type { TableData } from './api'
import { getTableData, getTableDataCount, getExcelData, deleteData } from './api'

import CreateModal from './Components/CreateModal.vue'
import UpdateModal from './Components/UpdateModal.vue'
import DetailModal from './Components/DetailModal.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate, eventList, swal } = useHook()

const tableOptions: TableOptions = {
  // 基本屬性
  title: '新建測試',
  version: '1.0.2',
  settingKey: 'caleb-new-test-1',
  // 其他屬性
  isSorting: true,
  isHiddenExcel: false,
  showType: 'auto'
}

const { tableSetting, downloadExcel, changePage, getParams } = useTableSetting(
  columnSetting,
  'table',
  tableOptions
)

const {
  columns: filterColumn,
  forms: filter,
  activeForms: activeFilter,
  getActiveForms: getFilter,
  reset: resetFilter
} = useFormSetting<any>(columnSetting, 'filter')

const isLoading = ref(true)

const download = async ({ type }) => {
  isLoading.value = true
  let params: any = null
  switch (type) {
    case 'all':
      params = {
        ...getParams(),
        page: 1,
        size: -1,
        ...getFilter(false)
      }
      break
    case 'page':
      params = {
        ...getParams(),
        ...getFilter(false)
      }
      break
  }
  const tempData = await getExcelData(params)
  downloadExcel(tempData)

  isLoading.value = false
}

const tableData = shallowRef<TableData[]>([])
const tableDataCount = ref(0)

const initData = async (tableParams: any) => {
  const filterData = getFilter(false)

  const [resData, resDataCount] = await Promise.all([
    getTableData({
      ...tableParams,
      ...filterData
    }),
    getTableDataCount(filterData)
  ])

  tableData.value = resData
  tableDataCount.value = resDataCount
}

const init = async (params?: any, type?: string) => {
  isLoading.value = true
  if (type === 'input') {
    changePage()
  }
  await nextTick()
  const tableParams = type === 'table' ? params : getParams()

  await initData(tableParams)

  setTimeout(() => {
    isLoading.value = false
  }, 300)
}
const throttleInit = throttle<typeof init>(init, 200, { isNoTrailing: true })

onMounted(() => {
  throttleInit(null, '')
})

const modal = reactive({
  create: false,
  update: false,
  detail: false
})

const createRef = ref()
const onCreateSubmit = async () => {
  if (createRef.value) {
    const status = await createRef.value?.submit()
    if (status === 'success') {
      modal.create = false
      swal({
        icon: 'success',
        title: '新增成功',
        showCancelButton: false
      })
      throttleInit()
    }
  }
}

const updateRef = ref()
const onUpdateSubmit = async () => {
  if (updateRef.value) {
    const status = await updateRef.value?.submit()
    if (status === 'success') {
      modal.update = false
      swal({
        icon: 'success',
        title: '更新成功',
        showCancelButton: false
      })
      throttleInit()
    }
  }
}

const updateData = ref()
const detailData = ref()
const onRowClick = (row: TableData) => {
  detailData.value = row
  modal.detail = true
}

const openPopover = (e: MouseEvent, rowData: TableData) => {
  eventList(e, [
    {
      icon: ['fas', 'edit'],
      label: i18nTranslate('edit'),
      event: () => {
        modal.update = true
        updateData.value = rowData
      }
    },
    {
      icon: ['fas', 'trash'],
      label: i18nTranslate('delete'),
      event: () => remove(rowData)
    }
  ])
}

const remove = (rowData: TableData) => {
  swal({
    icon: 'warning',
    title: `確定刪除 ${rowData?.column1 ?? ''}`
  }).then(async (result: SwalResult) => {
    if (result.isConfirmed) {
      isLoading.value = true
      const status = await deleteData(rowData)

      isLoading.value = false
      if (status === 'success') {
        swal({
          icon: 'success',
          title: '刪除成功',
          showCancelButton: false
        })
        throttleInit()
      }
    }
  })
}
</script>

<template>
  <div v-loading="isLoading" class="page">
    <CustomModal v-model="modal.create" title="新增資料" @submit="onCreateSubmit">
      <CreateModal ref="createRef" />
    </CustomModal>

    <CustomModal v-model="modal.update" title="編輯資料" @submit="onUpdateSubmit">
      <UpdateModal :data="updateData" ref="updateRef" />
    </CustomModal>

    <CustomModal v-model="modal.detail" title="檢視資源詳細資料" click-outside hidden-footer>
      <DetailModal :data="detailData" />
    </CustomModal>

    <CustomTable
      :table-data="tableData"
      :table-data-count="tableDataCount"
      v-bind="tableSetting"
      @excel="download"
      @show-change="throttleInit($event, 'table')"
    >
      <template #prepend>
        <div class="flex-row i-ga-xs content-between">
          <CustomButton
            type="primary"
            :label="i18nTranslate('create')"
            icon-name="plus"
            icon-move="rotate"
            @click="modal.create = true"
          />

          <div class="flex-row i-ga-xs content-between">
            <GroupSearch
              :columns="filterColumn"
              class="grid-row"
              @reset="resetFilter"
              @submit="throttleInit()"
            >
              <template #search-all="{ prop }">
                <CustomSearch
                  class="grid-col-xs-12 grid-col-md-8 grid-col-lg-6"
                  v-model="filter[prop]"
                  v-model:active="activeFilter[prop]"
                  v-bind="filterColumn[prop]"
                />
              </template>
            </GroupSearch>

            <CustomButton
              :label="i18nTranslate('refresh')"
              icon-name="rotate"
              icon-move="rotate"
              @click="throttleInit()"
            />
          </div>
        </div>
      </template>
      <template #header-all="{ prop }">
        <CustomSearch
          v-model="filter[prop]"
          v-model:active="activeFilter[prop]"
          v-bind="filterColumn[prop]"
          search
          @change="throttleInit($event, 'input')"
        />
      </template>
      <template #header-column1="{ column }">
        <div class="text-danger fill-y flex-row align-center">{{ column.label + ' (column)' }}</div>
      </template>
      <template #header-column5="{ column }">
        <div class="text-primary fill-y flex-row align-center">
          {{ column.label + ' (column)' }}
        </div>
      </template>
      <template #column-column5="{ row, data }">
        <CustomButton
          :label="`${data}`"
          icon-name="circle-info"
          type="primary"
          text
          @click="onRowClick(row)"
        />
      </template>

      <template #header-operations="{ column }">
        <div class="fill-y">{{ column.label }}</div>
      </template>
      <template #column-operations="scope">
        <div class="flex-row content-center cursor-pointer" @click="openPopover($event, scope.row)">
          <CustomIcon name="ellipsis-vertical" />
        </div>
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
