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
const model = reactive({
  create: false
})

const openPopover = (e: MouseEvent) => {
  eventList(e, [
    {
      icon: ['fas', 'edit'],
      label: '編輯',
      event: () => {
        console.log('update')
      }
    },
    {
      icon: ['fas', 'trash'],
      label: '刪除',
      event: () => {
        console.log('delete')
      }
    }
  ])
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
    delay: 0
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
    <CustomModal v-model="model.create">
      <CreateModal />
    </CustomModal>

    <CustomTable
      :table-data="tableData"
      v-bind="tableSetting"
      @excel="download"
    >
      <template #header="{ column }">{{ column.label }}</template>
      <template #column-operations>
        <div class="flex-row content-center cursor-pointer" @click="openPopover">
          <CustomIcon name="ellipsis-vertical"/>
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