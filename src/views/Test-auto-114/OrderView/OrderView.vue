<script setup lang="ts">
import { ref, inject, nextTick, reactive } from 'vue'

import type { UseHook } from '@/declare/hook'
import { WebViewTable, CustomTabs, CustomButton, CustomModal, CustomEmpty, CustomLink } from '@/components'

import type { TableData } from './api'
import { formatParams, formatExcel, formatTable } from './api'
import type { TableOptions } from '@/declare/columnSetting'
import { columnSetting, linkSetting } from './columns'
import { fakeTableData } from './fakeData'
// 先選機台的插單
import MachineRushOrder from './Components/RushOrder.vue'
// 先選製程的插單
import ProcessRushOrder from './Components-v2/RushOrder.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})

const tab = ref('ProcessView')
const tabs = [
  { label: '製程', value: 'ProcessView' },
  { label: '機台', value: 'MachineView' }
]

const tableOptions: TableOptions = {
  title: '訂單資訊',
  version: '1.0.3',
  settingKey: 'auto-114-order',
  isSorting: true
}

// modal
const modal = reactive({
  rushOrder: false
})
const currentOrder = ref<TableData>({
  id: '',
  acquiredDate: '',
  routeId: '',
  isAlreadySetRushOrder: ''
})

const onOrderNoClick = async (row: TableData) => {
  currentOrder.value = row
  await nextTick()
  modal.rushOrder = true
}

const machineViewRef = ref()
const machineRushOrderRef = ref()
const onMachineRushOrderSubmit = async () => {
  switch (tab.value) {
    case 'MachineView': {
      const status = await machineViewRef.value?.submit()
      if (status === 'success') {
        modal.rushOrder = false
        init()
      }
      break
    }
    case 'ProcessView': {
      const status = await machineRushOrderRef.value?.submit()
      if (status === 'success') {
        modal.rushOrder = false
        init()
      }
      break
    }
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
      v-model="modal.rushOrder"
      :title="`插單作業：訂單 ${currentOrder.id}`"
      height-size="large"
      @submit="onMachineRushOrderSubmit"
    >
      <div class="process-modal">
        <CustomTabs v-model="tab" :options="tabs" />

        <div class="process-rush-order">
          <Transition name="fade" mode="out-in">
            <ProcessRushOrder
              v-if="tab === 'ProcessView'"
              ref="machineRushOrderRef"
              :order="currentOrder"
            />
            <MachineRushOrder
              v-else-if="tab === 'MachineView'"
              ref="machineViewRef"
              :order="currentOrder"
            />
            <CustomEmpty v-else />
          </Transition>
        </div>
      </div>

      <template #footer>
        <div class="flex-row content-end i-ga-sm">
          <CustomButton
            :label="i18nTranslate('cancel')"
            icon-name="angle-left"
            icon-move="translate"
            @click="modal.rushOrder = false"
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
      designatedview="iPASPWebView_auto_114_erp"
      :table-options="tableOptions"
      :column-setting="columnSetting"
      :format-params="formatParams"
      :format-excel="formatExcel"
      :format-table="formatTable"
      :fake-data="fakeTableData"
    >
      <template #column-id="{ data, row, prop }">
        <div class="flex-row content-between align-center i-ga-xs">
          <CustomButton
            :label="data"
            icon-name="file-pen"
            type="primary"
            text
            @click="onOrderNoClick(row)"
          />

          <CustomLink
            :data="data"
            v-bind="linkSetting[prop]"
          />
        </div>
      </template>
    </WebViewTable>
  </div>
</template>

<style lang="scss" scoped>
.process {
  &-view {
    width: 100%;
    height: 100%;
  }
  &-modal {
    width: 100%;
    height: 100%;
    padding: 0 16px 8px;
    display: flex;
    flex-direction: column;
  }
  &-rush-order {
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>
