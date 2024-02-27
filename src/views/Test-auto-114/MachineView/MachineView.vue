<script setup lang="ts">
import { ref, shallowRef, onMounted, inject, nextTick, reactive } from 'vue'

import type { UseHook } from '@/declare/hook'
import { CustomTable, CustomButton, GroupSearch, CustomSearch, CustomModal } from '@/components'
import { getTableSetting, getFormSetting } from '@/lib/lib_columns'
import throttle from '@/lib/lib_throttle'

import type { TableData, FilterData } from './api'
import { getTableData, getTableDataCount, getExcelData } from './api'
import { columnSetting } from './columns'

import MachineRushOrder from './Components/MachineRushOrder.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'auto_common'
})

// filter
const {
  columns: filterColumn,
  forms: filter,
  activeForms: activeFilter,
  getActiveForms: getFilter,
  reset: resetFilter
} = getFormSetting<FilterData>(columnSetting, 'filter')

// table
const tableData = shallowRef<TableData[]>([])
const tableDataCount = ref(0)

const tableOptions = {
  title: '站點列表',
  version: '1.0.1',
  settingKey: 'auto-114-machine',
  isSorting: true
}
const { tableSetting, downloadExcel, getParams, changePage } = getTableSetting(columnSetting, 'table', tableOptions)

const isLoading = ref(false)

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

const initData = async (tableParams: any) => {
  const filterData = getFilter(false)

  const [resData, resDataCount ] = await Promise.all([
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
  }, 500)
}
const throttleInit = throttle<typeof init>(init, 200, { isNoTrailing: true })

onMounted(() => {
  throttleInit(null, '')
})

// modal
const modal = reactive({
  machineRushOrder: false
})
const currentMachine = ref<TableData>({
  machineNo: '',
  machineArea: '',
  count: '',
  machineStatus: ''
})

const onOrderNoClick = async (row: TableData) => {
  currentMachine.value = row
  await nextTick()
  modal.machineRushOrder = true
}

const machineRushOrderRef = ref()
const onMachineRushOrderSubmit = async () => {
  const status = await machineRushOrderRef.value?.submit()
  if (status === 'success') {
    modal.machineRushOrder = false
  }
}

</script>

<template>
  <div v-loading="isLoading" class="process-view">
    <CustomModal
      v-model="modal.machineRushOrder"
      :title="`機台插單作業 ${currentMachine.machineNo}`"
      height-size="large"
      @submit="onMachineRushOrderSubmit"
    >
      <MachineRushOrder ref="machineRushOrderRef" :order="currentMachine" />
      <template #footer>
        <div class="flex-row content-end i-ga-sm">
          <CustomButton
            :label="i18nTranslate('cancel')"
            icon-name="angle-left"
            icon-move="translate"
            @click="modal.machineRushOrder = false"
          />
          <CustomButton
            type="success"
            :label="`${i18nTranslate('settings')}${i18nTranslate('rushOrder')}`"
            icon-name="check"
            icon-move="scale"
            @click="onMachineRushOrderSubmit"
          />
        </div>
      </template>
    </CustomModal>

    <CustomTable
      :table-data="tableData"
      :table-data-count="tableDataCount"
      v-bind="tableSetting"
      @excel="download"
      @show-change="throttleInit($event, 'table')"
    >
      <template #prepend>
        <div class="flex-row i-ga-xs content-end">
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
            :label="i18nTranslate('refrush')"
            icon-name="rotate"
            icon-move="rotate"
            @click="throttleInit()"
          />
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
      <template #column-machineNo="{ data, row }">
        <CustomButton
          :label="data"
          icon-name="map-location-dot"
          type="primary"
          text
          @click="onOrderNoClick(row)"
        />
      </template>
    </CustomTable>
  </div>
</template>

<style lang="scss" scoped>
.process-view {
  width: 100%;
  height: 100%;
}
</style>
