<script setup lang="ts">
import { ref, onMounted, inject, reactive, computed } from 'vue'

import type { UseHook, SwalResult } from '@/declare/hook.ts'
import { CustomButton, CustomIcon, CustomModal, WebViewTable } from '@/components'
import { type Permission, getPermission, defaultPermission } from '@/lib/lib_permission.ts'

import type { TableOptions } from '@/declare/columnSetting.ts'
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
  i18nModule: 'system'
})

// table
const tableOptions: TableOptions = {
  title: '全廠',
  i18nTitle: 'fund-1417-genral-title',
  i18nModule: 'system',
  version: '1.0.8',
  settingKey: 'fund-1417-General',
  isSorting: true
}

const isLoading = ref(false)
const tableRef = ref(null)
const isNeedSendRTDS = ref(false)

const initData = async () => {
  const resIsNeedSendRTDS = await getIsNeedSendRTDS()
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
  const editSchedule = `${i18nTranslate('edit')}${i18nTranslate('fund-1417-genral-title')}`
  const id = ' # ' + updateData.value?.id
  return editSchedule + id
})

// create
const onCreateSubmit = async () => {
  if (createRef.value) {
    const status = await createRef.value?.submit()
    if (status === 'success') {
      modal.create = false
      swal({
        icon: 'success',
        title: i18nTranslate('create-success'),
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
        title: i18nTranslate('edit-success'),
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
  const text = ' Schedule # ' + rowData?.id
  swal({
    icon: 'warning',
    title: i18nTranslate('delete-confirm') + text,
    confirmButtonText: i18nTranslate('confirm-yes'),
    cancelButtonText: i18nTranslate('confirm-no')
  }).then(async (result: SwalResult) => {
    if (result.isConfirmed) {
      isLoading.value = true
      const status = await deleteData(rowData)

      isLoading.value = false
      if (status === 'success') {
        swal({
          icon: 'success',
          title: i18nTranslate('delete-success'),
          showCancelButton: false,
          confirmButtonText: i18nTranslate('confirm')
        })
        initData()
      }
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
      const status = await sendRTDS()

      isLoading.value = false
      if (status === 'success') {
        swal({
          icon: 'success',
          title: i18nTranslate('sendRTDS-success'),
          showCancelButton: false,
          confirmButtonText: i18nTranslate('confirm')
        })
        initData()
      }
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
      :title="`${i18nTranslate('create')}${i18nTranslate('fund-1417-genral-title')}`"
      width-size="small"
      height-size="small"
      @submit="onCreateSubmit"
    >
      <CreateModal ref="createRef" />
    </CustomModal>

    <CustomModal
      v-model="modal.update"
      :title="updateTitle"
      width-size="small"
      height-size="small"
      @submit="onUpdateSubmit"
    >
      <UpdateModal ref="updateRef" :data="updateData" />
    </CustomModal>

    <WebViewTable
      ref="tableRef"
      webfuno="fund_1417"
      designatedview="iPASPWebView_fund_1417_gwt"
      i18n-module="system"
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

      <template #column-dayOfWeek="{ prop, data }">
        <span>{{ i18nTranslate(columnSetting[prop].getValue(data)) }}</span>
      </template>

      <template #column-operations="scope">
        <div class="flex-row content-center cursor-pointer" @click="openPopover($event, scope.row)">
          <CustomIcon name="ellipsis-vertical" />
        </div>
      </template>
    </WebViewTable>

    <!-- <CustomTable
      :table-data="tableData"
      :table-data-count="tableDataCount"
      v-bind="tableSetting"
      @excel="download"
      @show-change="throttleInit($event, 'table')"
    >
      <template #prepend>
        <div class="flex-row i-ga-xs content-between">
          <div  class="flex-row i-ga-xs">
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

          <div  class="flex-row i-ga-xs">
            <GroupSearch
              :columns="filterColumn"
              :size="220"
              class="grid-row"
              @reset="resetFilter"
              @submit="throttleInit()"
            >
              <template #search-all="{ prop }">
                <CustomSearch
                  class="grid-col-xs-24"
                  v-model="filter[prop]"
                  v-model:active="activeFilter[prop]"
                  v-bind="filterColumn[prop]"
                />
              </template>
            </GroupSearch>

            <CustomButton
              :label="i18nTranslate('refrush')"
              icon-name="rotate"
              icon-move="rotate"
              @click="throttleInit()"
            />
          </div>
        </div>
      </template>

      <template #header-all="{ column }">
        <div class="fill-y flex-row align-center">{{ column.label }}</div>
      </template>

      <template #header-dayOfWeek="{ prop }">
        <CustomSearch
          v-model="filter[prop]"
          v-bind="filterColumn[prop]"
          v-model:active="activeFilter[prop]"
          search
          @change="throttleInit($event, 'input')"
        />
      </template>

      <template #column-dayOfWeek="{ prop, data }">
        <span>{{ columnSetting[prop].getValue(data) }}</span>
      </template>

      <template #column-operations="scope">
        <div class="flex-row content-center cursor-pointer" @click="openPopover($event, scope.row)">
          <CustomIcon name="ellipsis-vertical"/>
        </div>
      </template>
    </CustomTable> -->
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
