<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import { ref, inject, onBeforeMount, reactive } from 'vue'
import {
  CustomButton,
  CustomTable,
  CustomModal,
  CustomIcon
} from '@/components'

import { ajax, deepClone } from '@/lib/utils'
import { getTableSetting } from '@/lib/columns'

import type { TableData } from './api'
import { fakeTableData } from './api'
import { columnSetting } from './column'

import CreateModal from './Components/CreateModal.vue'
import UpdateModel from './Components/UpdateModel.vue'

const hook: Hook = inject('hook')
const { i18nTranslate, swal, loading, eventList } = hook()

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

    if (res === 'success') {
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

    if (res === 'success') {
      swal({
        icon: 'success',
        title: '更新成功'
      })
      model.update = false
      init()
    }
  }
}

const openPopover = (e: MouseEvent, rowData) => {
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

const remove = (rowData) => {
  swal({
    icon: 'warning',
    title: `確定刪除 ${rowData.name}`
  }).then(async (result) => {
    loading(true, '刪除資料中')

    if (result.isConfirmed) {
      await deleteData()
      swal({
        icon: 'success',
        title: '刪除成功'
      })
      init()
      loading(false)
    }
  })
}

// api
const getData = async () => {
  const resData = await ajax<TableData[]>({
    url: './test',
    method: 'get',
    data: {}
  }, {
    getFakeData: true,
    fakeData: fakeTableData,
    status: 'success',
    delay: 300
  })

  if (resData.status === 'success') {
    tableData.value = deepClone([], resData.data)
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: '請聯絡資訊人員'
    })
  }
}

const deleteData = async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve('delete success')
    }, 1000)
  })
}
const init = async () => {
  loading(true)
  await getData()

  loading(false)
}

onBeforeMount(() => {
  init()
})

</script>

<template>
  <div class="page">
    <CustomButton
      type="primary"
      :label="i18nTranslate('create')"
      icon-name="plus"
      @click="model.create = true"
    />
    <CustomModal
      v-model="model.create"
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