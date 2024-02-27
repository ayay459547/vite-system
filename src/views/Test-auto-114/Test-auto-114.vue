<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { CustomTabs, CustomEmpty } from '@/components'

import MachineView from './MachineView/MachineView.vue'
import OrderView from './OrderView/OrderView.vue'

const tab = ref('MachineView')
const options = [
  { label: '機台', key: 'MachineView' },
  { label: '訂單', key: 'OrderView' }
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
      <CustomTabs v-model="tab" :list="options"/>
    </div>

    <div class="page-view">
      <Transition name="fade" mode="out-in">
        <MachineView v-if="tab === 'MachineView'"/>
        <OrderView v-else-if="tab === 'OrderView'"/>
        <template v-else>
          <CustomEmpty />
        </template>
      </Transition>
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
    width: 100%;
    height: 100%;
  }
}
</style>
