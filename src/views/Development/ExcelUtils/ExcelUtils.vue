<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import { CustomTabs, CustomEmpty } from '@/components'

import ToJson from './Components/ToJson.vue'
import ToChart1 from './Components/ToChart1.vue'
import ToChart2 from './Components/ToChart2.vue'

const isLoading = ref(true)
const init = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}
const tab = ref('toJson')
const tabs = [
  { value: 'toJson', label: 'Excel 轉 JSON' },
  { value: 'toChart1', label: 'Excel 轉 圖表(1)' },
  { value: 'toChart2', label: 'Excel 轉 圖表(2)' }
]

const showComponents = computed(() => {
  switch (tab.value) {
    case 'toJson':
      return ToJson
    case 'toChart1':
      return ToChart1
    case 'toChart2':
      return ToChart2
    default:
      return CustomEmpty
  }
})

onMounted(() => {
  init()
})
</script>

<template>
  <div v-loading="isLoading" class="excel-wrapper">
    <div class="excel-container">
      <div class="excel-tabs">
        <CustomTabs v-model="tab" :options="tabs" @change="init" />
      </div>

      <div class="excel-test">
        <component :is="showComponents" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.excel {
  &-wrapper {
    width: 100%;
    height: 100%;
    padding: 16px;
  }
  &-container {
    width: inherit;
    height: 100%;
    min-height: fit-content;
  }
  &-tabs {
    width: 100%;
    height: 50px;
  }
  &-test {
    width: 100%;
    height: calc(100% - 50px);
  }
}
</style>
