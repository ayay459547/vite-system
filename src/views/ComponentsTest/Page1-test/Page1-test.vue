<script setup lang="ts">
import type { UseHook } from '@/declare/hook'
import { ref, shallowRef, inject, reactive, onActivated, computed } from 'vue'
import { CustomButton, CustomTable, CustomModal, CustomIcon } from '@/components'

import { useLocalI18n } from '@/lib/lib_hook'
import { deepClone } from '@/lib/lib_utils'
import { useTableSetting } from '@/lib/lib_columns'
import type { TableOptions } from '@/lib/lib_columns'

import type { TableData } from './api'
import { getData, getDataCount, deleteData } from './api'
import { columnSetting } from './columns'

import CreateModal from './Components/CreateModal.vue'
import UpdateModal from './Components/UpdateModal.vue'

import { storeToRefs } from 'pinia'
import { useRoutesStore } from '@/stores/stores_routes'
import { getPermission } from '@/lib/lib_permission'

// import i18nMessage from './i18n'

const useHook: UseHook = inject('useHook')
const { i18nTranslate, swal, loading, eventList } = useHook()

// const { i18nTranslate: pageTranslate } = useLocalI18n(i18nMessage)
const { i18nTranslate: pageTranslate } = useLocalI18n()

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
  title: pageTranslate('testTable'),
  version: '1.0.4',
  settingKey: 'test'
}
const { tableSetting, downloadExcel } = useTableSetting(columnSetting, 'table', tableOptions)

const download = () => {
  downloadExcel(tableData.value)
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
    loading(true, '新增資料中')

    const res = await createRef.value.submit()

    if (res.status === 'success') {
      swal({
        icon: 'success',
        title: '新增成功',
        showCancelButton: false
      })
      model.create = false
      init()
    }
    loading(false)
  }
}

const onUpdateSubmit = async () => {
  if (updateRef.value) {
    loading(true, '更新資料中')

    const res = await updateRef.value?.submit()

    if (res.status === 'success') {
      swal({
        icon: 'success',
        title: '更新成功',
        showCancelButton: false
      })
      model.update = false
      init()
    }
    loading(false)
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

const table = ref(null)

const init = async (props = tableSetting) => {
  tableData.value = []
  loading(true)
  const { page = 1, size = 100, sort = {} } = props?.params ?? {}

  const apiParam = { page, size, sort }
  console.log(apiParam)

  const [resData, resDataCount] = await Promise.all([getData(), getDataCount()])

  if (resData.status === 'success') {
    tableData.value = deepClone([], resData.data)
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: '請聯絡資訊人員'
    })
  }

  if (resDataCount.status === 'success') {
    tableDataCount.value = resDataCount.data
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: '請聯絡資訊人員'
    })
  }

  loading(false)
}

onActivated(() => {
  init()
})
</script>

<template>
  <div class="page">
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
        :label="i18nTranslate('refrush')"
        icon-name="rotate"
        icon-move="rotate"
        @click="init()"
      />
    </div>

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
      :title="pageTranslate('testTable')"
      @excel="download"
      @show-change="init"
      @row-contextmenu="
        (row, column, event) => {
          openPopover(event, row)
        }
      "
    >
      <template #header-name> name </template>
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
