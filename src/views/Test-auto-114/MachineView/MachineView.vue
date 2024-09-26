<script setup lang="ts">
import { ref, inject, nextTick, reactive } from 'vue'

import type { UseHook } from '@/declare/hook'
import { WebViewTable, CustomButton, CustomModal } from '@/components'

import type { TableOptions } from '@/declare/columnSetting'

import type { TableData } from './api'
import { formatParams, formatExcel, formatTable } from './api'
import { columnSetting } from './columns'
import { fakeTableData } from './fakeData'

import MachineRushOrder from './Components/MachineRushOrder.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})

const tableOptions: TableOptions = {
  title: '站點列表',
  version: '1.0.5',
  settingKey: 'auto-114-machine',
  isSorting: true
}

// modal
const modal = reactive({
  machineRushOrder: false
})
const currentMachine = ref<TableData>({
  machineId: '',
  areaName: '',
  sum: '',
  machineNote: ''
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
    init()
  }
}

const webViewTableRef = ref()
const init = () => {
  webViewTableRef.value?.init()
}
defineExpose({
  init
})
</script>

<template>
  <div class="process-view">
    <CustomModal
      v-model="modal.machineRushOrder"
      :title="`插單作業：機台 ${currentMachine.machineId}`"
      height-size="large"
      @submit="onMachineRushOrderSubmit"
    >
      <MachineRushOrder ref="machineRushOrderRef" :machine="currentMachine" />
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
            :label="`${i18nTranslate('setting')}${i18nTranslate('insert-order')}`"
            icon-name="check"
            icon-move="scale"
            @click="onMachineRushOrderSubmit"
          />
        </div>
      </template>
    </CustomModal>

    <WebViewTable
      ref="webViewTableRef"
      webfuno="auto_114"
      designatedview="iPASPWebView_auto_114_machine"
      :table-options="tableOptions"
      :column-setting="columnSetting"
      :format-params="formatParams"
      :format-excel="formatExcel"
      :format-table="formatTable"
      :fake-data="fakeTableData"
    >
      <template #column-machineId="{ data, row }">
        <CustomButton
          :label="data"
          icon-name="file-pen"
          type="primary"
          text
          @click="onOrderNoClick(row)"
        />
      </template>
    </WebViewTable>
  </div>
</template>

<style lang="scss" scoped>
.process-view {
  width: 100%;
  height: 100%;
}
</style>
