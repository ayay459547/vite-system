<script setup lang="ts">
import { ref, shallowRef, inject, reactive, onMounted, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import {
  CustomButton,
  CustomTable,
  CustomModal,
  CustomIcon,
  SimpleTable,
  GroupSearch,
  CustomSearch
} from '@/components' // 系統組件
import { useLocalI18n } from '@/lib/lib_hook' // 自訂Composition API
import { useTableSetting, useSimpleTableSetting, useFormSetting } from '@/lib/lib_columns'
import throttle from '@/lib/lib_throttle'
import { useRoutesStore } from '@/stores/stores_routes'
import { getPermission } from '@/lib/lib_permission' // 權限
import type { TableOptions } from '@/declare/columnSetting'

// import i18nMessage from './i18n'
import type { TableData } from './api'
import { getData, getDataCount, deleteData } from './api'
import { columnSetting, childColumnSetting } from './columns'

import CreateModal from './Components/CreateModal.vue'
import UpdateModel from './Components/UpdateModel.vue'

const useHook: UseHook = inject('useHook')
const { swal, loading, eventList } = useHook()
// const { i18nTranslate } = useLocalI18n(i18nMessage)
const { i18nTranslate } = useLocalI18n()

// 權限
const routesStore = useRoutesStore()
const { currentNavigation } = storeToRefs(routesStore)
const userPermission = computed(() => {
  return getPermission(currentNavigation.value?.permission ?? 0)
})

// filter
const {
  columns: filterColumn,
  forms: filter,
  activeForms: activeFilter,
  reset: resetFilter,
  getActiveForms
} = useFormSetting<TableData>(columnSetting, 'filter')

// table
const tableData = shallowRef<TableData[]>([])
const tableDataCount = ref(0)

const tableOptions: TableOptions = {
  title: '資訊顯示測試',
  version: '1.0.5',
  settingKey: 'fund-12',
  isSorting: true
}
const { tableSetting, downloadExcel, getParams } = useTableSetting(
  columnSetting,
  'table',
  tableOptions
)

const { tableColumns: childColumns } = useSimpleTableSetting(childColumnSetting, 'table')

const download = () => {
  downloadExcel(tableData.value)
}

// modal
const createRef = ref(null)
const updateRef = ref(null)
const modal = reactive({
  create: false,
  update: false
})
const editData = ref({})

const onCreateSubmit = async () => {
  if (createRef.value) {
    const res = await createRef.value.submit()

    if (res.status === 'success') {
      modal.create = false
      swal({
        icon: 'success',
        title: '新增成功',
        showCancelButton: false
      })
      init()
    }
  }
}

const onUpdateSubmit = async () => {
  if (updateRef.value) {
    const res = await updateRef.value?.submit()

    if (res.status === 'success') {
      modal.update = false
      swal({
        icon: 'success',
        title: '更新成功',
        showCancelButton: false
      })
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
        modal.update = true
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
    title: `確定刪除 ${rowData.no}`
  }).then(async result => {
    if (result.isConfirmed) {
      loading(true, '刪除資料中')
      await deleteData(rowData)

      loading(false)
      swal({
        icon: 'success',
        title: '刪除成功',
        showCancelButton: false
      })
      init()
    }
  })
}

const table = ref(null)

const isLoading = ref(false)
const init = async () => {
  isLoading.value = true
  tableData.value = []
  await nextTick()

  // const { page, size, sort } = props.params
  // const apiParam  = { page, size, sort }
  // console.log(apiParam)

  const [resData, resDataCount] = await Promise.all([
    getData({
      ...getParams(),
      ...getActiveForms(true)
    }),
    getDataCount({
      ...getActiveForms(true)
    })
  ])

  tableData.value = resData
  tableDataCount.value = resDataCount

  isLoading.value = false
}
const throttleInit = throttle<typeof init>(init, 200, { isNoTrailing: true })

onMounted(() => {
  throttleInit()
})
</script>

<template>
  <div v-loading="isLoading" class="page">
    <CustomModal
      v-model="modal.create"
      width-size="large"
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
      :title="i18nTranslate('info')"
      @excel="download"
      @show-change="throttleInit"
      @row-contextmenu="
        (row, column, event) => {
          openPopover(event, row)
        }
      "
    >
      <template #prepend>
        <div class="flex-row i-ga-xs content-between">
          <CustomButton
            type="primary"
            :label="i18nTranslate('create')"
            icon-name="plus"
            icon-move="scale"
            :disabled="!userPermission.create"
            @click="modal.create = true"
          />

          <div class="flex-row i-ga-xs">
            <GroupSearch
              :columns="filterColumn"
              class="grid-row"
              @reset="resetFilter"
              @submit="throttleInit()"
            >
              <template #search-all="{ prop, column }">
                <CustomSearch
                  class="grid-col-xs-6"
                  v-model="filter[prop]"
                  v-model:active="activeFilter[prop]"
                  v-bind="column"
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
          :label="i18nTranslate(prop)"
          @change="throttleInit"
        />
      </template>

      <template #header-operations="{ column }">
        <span>{{ column.label }}</span>
      </template>

      <template #row-expand="{ row }">
        <div class="i-pa-md">
          <h3 class="i-mb-md">{{ i18nTranslate('parameter') }}</h3>
          <SimpleTable
            :table-data="row?.children ?? []"
            :table-columns="childColumns"
          ></SimpleTable>
        </div>
      </template>
      <template #column-operations="scope">
        <div class="flex-row-center cursor-pointer" @click="openPopover($event, scope.row)">
          <CustomIcon name="ellipsis-vertical" />
        </div>
      </template>
    </CustomTable>

    <CustomModal
      v-model="modal.update"
      width-size="large"
      :title="i18nTranslate('edit')"
      @submit="onUpdateSubmit"
    >
      <UpdateModel ref="updateRef" :data="editData" />
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
