<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import { ref, inject, reactive, onActivated, computed } from 'vue'
import {
  CustomButton,
  CustomTable,
  CustomModal,
  CustomIcon
} from '@/components'

import { deepClone } from '@/lib/utils'
import { getTableSetting } from '@/lib/columns'

import type { TableData } from './api'
import { getData, deleteData } from './api'
import { columnSetting } from './column'

import CreateModal from './Components/CreateModal.vue'
import UpdateModel from './Components/UpdateModel.vue'

import { storeToRefs } from 'pinia'
import { useRoutesStore } from '@/stores/routes'
import { getPermission } from '@/lib/permission'

const hook: Hook = inject('hook')
const { i18nTranslate, swal, loading, eventList } = hook()

// 權限
const routesStore = useRoutesStore()
const { currentNavigation } = storeToRefs(routesStore)
const userPermission = computed(() => {
  return getPermission(currentNavigation.value?.permission ?? 0)
})

// table
const tableData = ref([])

const tableOptions = {
  title: '測試表單',
  version: '1.0.2',
  settingKey: 'test'
}
const { tableSetting, downloadExcel } = getTableSetting(columnSetting, 'table', tableOptions)

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
    const res = await createRef.value.submit()

    if (res.status === 'success') {
      swal({
        icon: 'success',
        title: '新增成功'
      })
      model.create = false
      init()
    }
  }
}

const onUpdateSubmit = async () => {
  if (updateRef.value) {
    const res = await updateRef.value.submit()

    if (res.status === 'success') {
      swal({
        icon: 'success',
        title: '更新成功'
      })
      model.update = false
      init()
    }
  }
}

const openPopover = (e: MouseEvent, rowData: TableData) => {
  eventList(e, [
    {
      icon: ['fas', 'edit'],
      label: i18nTranslate('edit'),
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
  }).then(async (result) => {

    if (result.isConfirmed) {
      loading(true, '刪除資料中')
      await deleteData(rowData)
      swal({
        icon: 'success',
        title: '刪除成功'
      })
      init()
      loading(false)
    }
  })
}

const init = async () => {
  loading(true)
  const resData = await getData()

  if (resData.status === 'success') {
    tableData.value = deepClone([], resData.data)
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
        @click="init"
      />
    </div>

    <CustomModal
      v-model="model.create"
      height-size="small"
      :title="i18nTranslate('create')"
      @submit="onCreateSubmit"
    >
      <CreateModal ref="createRef"/>
    </CustomModal>

    <CustomTable
      :table-data="tableData"
      v-bind="tableSetting"
      @excel="download"
    >
      <template #column-operations="scope">
        <div class="flex-row content-center cursor-pointer" @click="openPopover($event, scope.row)">
          <CustomIcon name="ellipsis-vertical"/>
        </div>
      </template>
    </CustomTable>

    <CustomModal
      v-model="model.update"
      :title="i18nTranslate('edit')"
      @submit="onUpdateSubmit"
    >
      <UpdateModel ref="updateRef" :data="editData"/>
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