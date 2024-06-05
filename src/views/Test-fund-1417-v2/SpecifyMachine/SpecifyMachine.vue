<script setup lang="ts">
import { ref, onMounted, inject, reactive, computed } from 'vue'

import type { UseHook, SwalResult } from '@/declare/hook'
import { CustomButton, CustomIcon, CustomModal, WebViewTable } from '@/components'
import { type Permission, getPermission, defaultPermission } from '@/lib/lib_permission'

import type { TableOptions } from '@/lib/lib_columns'
import type { TableData } from './api'
import {
  formatParams,
  formatExcel,
  formatTable,
  deleteData,
  sendRTDS,
  getIsNeedSendRTDS
} from './api'
import { columnSetting } from './columns'
import { fakeTableData } from './fakeData'

import CreateModal from './Components/CreateModal.vue'
import UpdateModal from './Components/UpdateModal.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate, swal, eventList, permission } = useHook({
  i18nModule: 'fund_common'
})

defineExpose({
  setFilter: filter => {tableRef.value.setFilter(filter)}
})

// table
const tableOptions: TableOptions = {
  title: '機台保養工時',
  i18nTitle: 'fund-1417-machine-title',
  i18nModule: 'fund_common',
  version: '1.0.6',
  settingKey: 'fund-1417-SpecifyMachine',
  isSorting: true
}

const isLoading = ref(false)
const tableRef = ref(null)
const isNeedSendRTDS = ref(false)

const initData = async () => {
  const { status, msg, data: resIsNeedSendRTDS } = await getIsNeedSendRTDS()
  if (status !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }

  isNeedSendRTDS.value = resIsNeedSendRTDS

  tableRef.value?.init()
}

// modal
const createRef = ref(null)
const updateRef = ref(null)
const modal = reactive({
  create: false,
  update: false
})
const updateData = ref<TableData | null>(null)
const updateTitle = computed(() => {
  const edit = i18nTranslate('edit')
  return `${edit} ${updateData.value?.machine_Id ?? ''}`
})
// create
const onCreateSubmit = async () => {
  if (createRef.value) {
    const status = await createRef.value?.submit()
    if (status === 'success') {
      modal.create = false
      swal({
        icon: 'success',
        title: i18nTranslate('createSuccess'),
        showCancelButton: false,
        confirmButtonText: i18nTranslate('confirm')
      })
      initData()
    }
  }
}

// update
const onUpdateSubmit = async () => {
  if (updateRef.value) {
    const status = await updateRef.value?.submit()
    if (status === 'success') {
      modal.update = false
      swal({
        icon: 'success',
        title: i18nTranslate('editSuccess'),
        showCancelButton: false,
        confirmButtonText: i18nTranslate('confirm')
      })
      initData()
    }
  }
}

// operations
const openPopover = (e: MouseEvent, rowData: TableData) => {
  eventList(e, [
    {
      icon: ['fas', 'edit'],
      label: i18nTranslate('edit'),
      disabled: !userPermission.value.update,
      event: () => {
        updateData.value = rowData
        modal.update = true
      }
    },
    {
      icon: ['fas', 'trash'],
      label: i18nTranslate('delete'),
      disabled: !userPermission.value.delete,
      event: () => remove(rowData)
    }
  ])
}

// delete
const remove = (rowData: TableData) => {
  const text = rowData.machine_Id
  swal({
    icon: 'warning',
    title: i18nTranslate('deleteConfirm') + text,
    confirmButtonText: i18nTranslate('confirm-yes'),
    cancelButtonText: i18nTranslate('confirm-no')
  }).then(async (result: SwalResult) => {
    if (result.isConfirmed) {
      isLoading.value = true
      const { status, msg } = await deleteData(rowData)
      if (status === 'success') {
        swal({
          icon: 'success',
          title: i18nTranslate('deleteSuccess'),
          showCancelButton: false
        })
        initData()
      } else {
        swal({
          icon: 'error',
          title: i18nTranslate('deleteFail'),
          text: msg,
          showCancelButton: false
        })
      }

      isLoading.value = false
    }
  })
}

const onRTDSClick = async () => {
  swal({
    icon: 'warning',
    title: i18nTranslate('sendRTDS-confirm'),
    confirmButtonText: i18nTranslate('confirm-yes'),
    cancelButtonText: i18nTranslate('confirm-no')
  }).then(async (result: SwalResult) => {
    if (result.isConfirmed) {
      isLoading.value = true
      const { status, msg } = await sendRTDS()
      if (status === 'success') {
        swal({
          icon: 'success',
          title: i18nTranslate('sendRTDS-success'),
          showCancelButton: false,
          confirmButtonText: i18nTranslate('confirm')
        })
        initData()
      } else {
        swal({
          icon: 'error',
          title: i18nTranslate('updateFail'),
          text: msg,
          showCancelButton: false
        })
      }

      isLoading.value = false
    }
  })
}

// 頁面權限
const userPermission = ref<Permission>(getPermission(defaultPermission))
onMounted(() => {
  userPermission.value = permission('fund-1417')
  initData()
})
</script>

<template>
  <div v-loading="isLoading" class="specify-machine">
    <CustomModal
      v-model="modal.create"
      :title="i18nTranslate('create-maintenanceTimeForMachine')"
      @submit="onCreateSubmit"
    >
      <CreateModal ref="createRef" />
    </CustomModal>

    <CustomModal v-model="modal.update" :title="updateTitle" @submit="onUpdateSubmit">
      <UpdateModal ref="updateRef" :data="updateData" />
    </CustomModal>

    <WebViewTable
      ref="tableRef"
      webfuno="fund_1417"
      designatedview="iPASPWebView_fund_1417_mswt"
      :table-options="tableOptions"
      :column-setting="columnSetting"
      :format-params="formatParams"
      :format-excel="formatExcel"
      :format-table="formatTable"
      :fake-data="fakeTableData"
    >
      <template #prepend>
        <div class="flex-row i-ga-xs">
          <CustomButton
            type="primary"
            :label="i18nTranslate('create')"
            icon-name="plus"
            icon-move="rotate"
            :disabled="!userPermission.create"
            @click="modal.create = true"
          />

          <CustomButton
            :type="isNeedSendRTDS ? 'danger' : 'info'"
            :label="i18nTranslate('sendRTDS')"
            icon-name="paper-plane"
            icon-move="translate"
            :disabled="!userPermission.execute"
            @click="onRTDSClick"
          />
        </div>
      </template>

      <template #column-type="{ prop, data }">
        <span>{{ i18nTranslate(columnSetting[prop].getValue(data)) }}</span>
      </template>

      <template #column-operations="scope">
        <div class="flex-row content-center cursor-pointer" @click="openPopover($event, scope.row)">
          <CustomIcon name="ellipsis-vertical" />
        </div>
      </template>
    </WebViewTable>
  </div>
</template>

<style lang="scss" scoped>
.specify-machine {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
