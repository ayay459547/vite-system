<script setup lang="ts">
import { onMounted, ref, inject, nextTick } from 'vue'

import type { UseHook } from '@/declare/hook.ts'
import { SimpleFilter, CustomInput, CustomButton } from '@/components'
import { useFormSetting } from '@/lib/lib_columns.ts'
import throttle from '@/lib/lib_throttle.ts'

import { columnSetting } from './columns'
import { type TableData, getData } from './api'

import TableView from './Components/TableView.vue'
import type { Tab } from './Components/ScheduleGantt.vue'
import ScheduleGantt from './Components/ScheduleGantt.vue'

const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: 'system'
})

// filter
const {
  columns: filterColumn,
  forms: filter,
  // activeForms: activeFitler,
  getActiveForms: getFilter,
  reset: filterReset
} = useFormSetting<TableData>(columnSetting, 'filter')

const isLoading = ref(false)

const tableData = ref([])

const defaultTab: Tab = 'order'
const tabs = [
  { i18nLabel: 'order', label: '訂單', value: 'order' },
  { i18nLabel: 'workOrder', label: '工單', value: 'workOrder' },
  { i18nLabel: 'process', label: '製程', value: 'process' },
  { i18nLabel: 'machine', label: '機台', value: 'machine' }
]
const scheduleGantt = ref()

const init = async () => {
  isLoading.value = true
  await nextTick()

  const {
    status,
    msg,
    data: resData
  } = await getData({
    ...getFilter(false)
    // timeRange: ['2023-09-05', '2023-09-13']
  })
  if (status !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }

  if (![null, undefined].includes(resData)) {
    tableData.value = resData
  }

  setTimeout(() => {
    if (scheduleGantt.value) {
      scheduleGantt.value.init(defaultTab)
    }
  }, 300)

  setTimeout(() => {
    isLoading.value = false
  }, 500)
}
const throttleInit = throttle<typeof init>(init, 200, { isNoTrailing: true })

const filterRef = ref()
onMounted(() => {
  setTimeout(() => {
    filterRef.value?.setIsVisible(true)
  }, 400)
})
</script>

<template>
  <div v-loading="isLoading" class="page">
    <div class="flex-row i-ga-xs content-between">
      <SimpleFilter
        ref="filterRef"
        class="grid-row"
        :columns="filterColumn"
        @reset="filterReset()"
        @submit="init()"
      >
        <template #filter-all="{ prop }">
          <CustomInput
            class="grid-col-xs-12 grid-col-lg-8 grid-col-xl-6"
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
            i18n-module="system"
          />
        </template>
        <template #search-status="{ prop }">
          <CustomInput
            class="grid-col-xs-12 grid-col-lg-8 grid-col-xl-6"
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
          />
        </template>
        <template #search-timeRange="{ prop }">
          <CustomInput
            class="grid-col-xs-12 grid-col-lg-8 grid-col-xl-6"
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
          />
        </template>
      </SimpleFilter>

      <!-- <GroupSearch
        ref="filterRef"
        class="grid-row"
        :columns="filterColumn"
        @reset="filterReset()"
        @submit="throttleInit()"
      >
        <template #search-all="{ prop }">
          <CustomInput
            class="grid-col-xs-12 grid-col-lg-8 grid-col-xl-6"
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
          />
        </template>
        <template #search-status="{ prop }">
          <CustomInput
            class="grid-col-xs-12 grid-col-lg-8 grid-col-xl-6"
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
          />
        </template>
        <template #search-timeRange="{ prop }">
          <CustomInput
            class="grid-col-xs-12 grid-col-lg-8 grid-col-xl-6"
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
          />
        </template>
      </GroupSearch> -->

      <div class="flex-row i-ga-xs">
        <TableView :table-data="tableData" />

        <CustomButton
          :label="i18nTranslate('refrush')"
          icon-name="rotate"
          icon-move="rotate"
          @click="throttleInit()"
        />
      </div>
    </div>

    <ScheduleGantt
      ref="scheduleGantt"
      date-format-x="YYYY-MM-DD"
      :table-data="tableData"
      :default-tab="defaultTab"
      :tabs="tabs"
    />
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
  // overflow-x: hidden;
}
</style>
