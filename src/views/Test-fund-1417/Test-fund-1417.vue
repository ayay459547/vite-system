<script setup lang="ts">
// Composition API
import { inject, ref, onMounted, onBeforeMount, watch } from 'vue'
// 引入類型
import type { UseHook } from '@/declare/hook.ts'
// 引入組件
import { CustomTabs } from '@/components'
// 引入工具
import { isEmpty } from '@/lib/lib_utils.ts'

// 機台保養工時
import SpecifyMachine from './SpecifyMachine/SpecifyMachine.vue'
// 特定機台工時設定
import MachineView from './Machine/MachineView.vue'
// 全廠
import GeneralView from './General/GeneralView.vue'

// 接收 GlobalView.vue 的 useHook
const useHook: UseHook = inject('useHook')
const { redirectInfo } = useHook()

const tab = ref('SpecifyMachine')
const tabs = [
  { i18nLabel: 'fund-1417-machine-title', label: '機台保養工時', value: 'SpecifyMachine' },
  { i18nLabel: 'fund-1417-specifyMachine-title', label: '特定機台工時設定', value: 'Machine' },
  { i18nLabel: 'fund-1417-genral-title', label: '全廠', value: 'General' }
]
const tabSpecifyMachine = ref(null)
const tabMachine = ref(null)

const isLoading = ref(true)

// 跳轉來源, 附帶資料
const { fromPage, queryData } = redirectInfo()
// Mount前先根據fromPage切換tab
onBeforeMount(() => {
  switch (fromPage) {
    case 'auto-32-SG':
      tab.value = 'SpecifyMachine'
      break
  }
})
const initTabTable = () => {
  if (!isEmpty(queryData)) {
    switch (fromPage) {
      case 'auto-32-SG': {
        tabMachine?.value?.setFilter({
          machine_Id: queryData
        })
        tabSpecifyMachine?.value?.setFilter({
          machine_Id: queryData
        })
        break
      }
    }
  }
}

const tabRefChange = newRef => {
  if (newRef) initTabTable()
}
watch(tabSpecifyMachine, tabRefChange)
watch(tabMachine, tabRefChange)

onMounted(() => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 600)
})
</script>

<template>
  <div v-loading="isLoading" class="page">
    <div class="page-tabs">
      <!-- 切換 -->
      <CustomTabs v-model="tab" :options="tabs" i18n-module="system" />
    </div>

    <div class="page-view">
      <KeepAlive>
        <Transition name="fade" mode="out-in">
          <SpecifyMachine v-if="tab === 'SpecifyMachine'" ref="tabSpecifyMachine" />
          <MachineView v-else-if="tab === 'Machine'" ref="tabMachine" />
          <GeneralView v-else-if="tab === 'General'" />
        </Transition>
      </KeepAlive>
    </div>
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

  &-tabs {
    height: fit-content;
  }
  &-view {
    flex: 1;
    height: 100%;
  }
}
</style>
