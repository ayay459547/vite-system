<script setup lang="ts">
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { CustomTabs } from '@/components' // 系統組件

const { t: testT } = useI18n()

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook()

const tab = ref('tab1')
const tabs = [
  { label: '選項1', value: 'tab1' },
  { label: '選項2', value: 'tab2' },
  { label: '選項3', value: 'tab3' },
  { label: '選項4', value: 'tab4' }
]
</script>

<template>
  <div class="input-test">
    <h2 class="i-mb-md text-primary">{{ testT('test') }}</h2>
    <h2 class="i-mb-md text-success">{{ testT('test') }}</h2>
    <h2 class="i-mb-md text-danger">{{ i18nTranslate('search') }}</h2>
    <h2 class="i-mb-md text-success">{{ testT('search') }}</h2>
    <h2 class="i-mb-md text-danger">{{ i18nTranslate('search123') }}</h2>
    <h2 class="i-mb-md text-primary">{{ i18nTranslate('test') }}</h2>

    <CustomTabs v-model="tab" :options="tabs"></CustomTabs>
    <CustomTabs v-model="tab" :options="tabs"></CustomTabs>
  </div>
</template>

<style lang="scss" scoped>
.input-test {
  width: 100%;
  height: 100%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
