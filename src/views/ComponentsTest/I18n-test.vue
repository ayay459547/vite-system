<script setup lang="ts">
import { inject, ref } from 'vue'
import type { Hook } from '@/declare/hook'
import { useI18n } from 'vue-i18n'
import { CustomTabs } from '@/components'
const { t } = useI18n()

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const tab = ref('tab1')
const options = [
  { label: '選項1', key: 'tab1' },
  { label: '選項2', key: 'tab2' },
  { label: '選項3', key: 'tab3' },
  { label: '選項4', key: 'tab4' }
]
</script>

<template>
  <div class="input-test">
    <h2 class="i-mb-md text-primary">{{ $t('test') }}</h2>
    <h2 class="i-mb-md text-success">{{ t('test') }}</h2>
    <h2 class="i-mb-md text-danger">{{ i18nTranslate('test') }}</h2>

    <CustomTabs v-model="tab" :list="options"></CustomTabs>
    <CustomTabs v-model="tab" :list="options" background></CustomTabs>

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