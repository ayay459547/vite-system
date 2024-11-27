<script setup lang="ts">
import { ref, shallowRef, inject, reactive, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { CustomButton, CustomTable, CustomModal, CustomIcon } from '@/components' // 系統組件
import { useTableSetting } from '@/lib/lib_columns'
import { useRoutesStore } from '@/stores/stores_routes'
import { getPermission } from '@/lib/lib_permission' // 權限
import type { TableOptions } from '@/declare/columnSetting'
import { object_filter } from '@/lib/lib_object'

import type { TableData } from './api'
import { getData, getDataCount, getExcelData, deleteData } from './api'
import { columnSetting } from './columns'
// import i18nMessage from './i18n'

import CreateModal from './Components/CreateModal.vue'
import UpdateModal from './Components/UpdateModal.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate, swal, loading, eventList } = useHook()

// 權限
const routesStore = useRoutesStore()
const { currentNavigation } = storeToRefs(routesStore)
const userPermission = computed(() => {
  return getPermission(currentNavigation.value?.permission ?? 0)
})

// table
const tableData = shallowRef<TableData[]>([])
const tableDataCount = ref(0)

const tableOptions: TableOptions = {
  title: i18nTranslate('testTable'),
  version: '1.0.0',
  settingKey: 'nav1-1-1',
  isSorting: true
}
const { tableSetting, downloadExcel, getParams } = useTableSetting(
  columnSetting,
  'table',
  tableOptions
)

const onExcelClick = async ({ type }) => {
  let excelData = []
  const apiParam = object_filter(
    {
      ...(getParams(tableRef.value) as any)
    },
    (item: any) => item !== null
  )

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

// modal
const createRef = ref(null)
const updateRef = ref(null)
const model = reactive({
  create: false,
  update: false
})
const editData = ref({})

const onCreateSubmit = async () => {
  if (createRef.value) {
    const status = await createRef.value.submit()

    if (status === 'success') {
      model.create = false
      init()
    }
  }
}

const onUpdateSubmit = async () => {
  if (updateRef.value) {
    const status = await updateRef.value?.submit()

    if (status === 'success') {
      model.update = false
      init()
    }
  }
}

const openPopover = (e: MouseEvent, rowData: TableData) => {
  eventList(e, [
    {
      icon: ['fas', 'edit'],
      label: i18nTranslate('update'),
      event: () => {
        model.update = true
        editData.value = rowData
      }
    },
    {
      icon: ['fas', 'trash'],
      label: i18nTranslate('delete'),
      event: () => {
        remove(rowData)
      }
    }
  ])
}

const remove = (rowData: TableData) => {
  swal({
    icon: 'warning',
    title: `確定刪除 ${rowData.name}`
  }).then(async result => {
    if (result.isConfirmed) {
      loading(true, '刪除資料中')
      await deleteData(rowData)
      swal({
        icon: 'success',
        title: '刪除成功',
        showCancelButton: false
      })
      init()
      loading(false)
    }
  })
}

const tableRef = ref(null)
const isLoading = ref(false)

const init = async (props?: any) => {
  isLoading.value = true

  let apiParam = {}
  if (typeof props === 'object') {
    apiParam = object_filter(
      {
        ...(getParams(tableRef.value) as any)
      },
      (item: any) => item !== null
    )
  }

  const [resData, resDataCount] = await Promise.all([getData(apiParam), getDataCount()])

  tableData.value = resData
  tableDataCount.value = resDataCount

  isLoading.value = false
}

onMounted(() => {
  init()
})
</script>

<template>
  <div v-loading="isLoading" class="page">
    <CustomModal
      v-model="model.create"
      height-size="small"
      :title="i18nTranslate('create')"
      @submit="onCreateSubmit"
    >
      <CreateModal ref="createRef" />
    </CustomModal>

    <CustomTable
      ref="table"
      :table-data="tableData"
      :table-data-count="tableDataCount"
      v-bind="tableSetting"
      :title="i18nTranslate('testTable')"
      @excel="onExcelClick"
      @show-change="init"
      @row-contextmenu="
        (row, column, event) => {
          openPopover(event, row)
        }
      "
    >
      <template #prepend>
        <div class="flex-row content-between">
          <CustomButton
            type="primary"
            :label="i18nTranslate('create')"
            icon-name="plus"
            icon-move="scale"
            :disabled="!userPermission.create"
            @click="model.create = true"
          />

          <CustomButton
            :label="i18nTranslate('refresh')"
            icon-name="rotate"
            icon-move="rotate"
            @click="init()"
          />
        </div>
      </template>

      <template #column-operations="scope">
        <div class="flex-row content-center cursor-pointer" @click="openPopover($event, scope.row)">
          <CustomIcon name="ellipsis-vertical" />
        </div>
      </template>
    </CustomTable>

    <CustomModal v-model="model.update" :title="i18nTranslate('update')" @submit="onUpdateSubmit">
      <UpdateModal ref="updateRef" :data="editData" />
    </CustomModal>
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
