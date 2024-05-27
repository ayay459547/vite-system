<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { CustomTabs, CustomEmpty } from '@/components'

import MachineView from './MachineView/MachineView.vue'
import OrderView from './OrderView/OrderView.vue'

const tab = ref('MachineView')
const tabs = [
  { label: '機台', value: 'MachineView' },
  { label: '訂單', value: 'OrderView' }
]
const isLoading = ref(true)

onMounted(() => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 300)
})
</script>

<template>
  <div v-loading="isLoading" class="page">
    <div class="page-tabs">
      <!-- 切換 -->
      <CustomTabs v-model="tab" :options="tabs">
        <div class="page-view">
          <MachineView v-if="tab === 'MachineView'" />
          <OrderView v-else-if="tab === 'OrderView'" />
          <CustomEmpty v-else />
        </div>
      </CustomTabs>
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
    width: 100%;
    height: 100%;
  }
  &-view {
    width: 100%;
    height: 100%;
  }
}
</style>
