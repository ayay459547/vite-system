<script setup lang="ts">
import { ref } from 'vue'

import markdown from '@/components/feature/CustomCollapse/CustomCollapse.md?raw'
import type { Options } from '@/components'
import { CustomInput, CustomDivider, CustomMarkdown, CustomCollapse } from '@/components'

const value = ref()

const accordionOptions: Options<any> = [
  { label: '一般模式', value: false },
  { label: '手風琴模式', value: true }
]
const accordion = ref<boolean>(false)

// slot
const slotText = ref('slot default')
</script>

<template>
  <div class="page">
    <CustomInput v-model="accordion" label="模式" type="radio" :options="accordionOptions" />
    <CustomInput label="插槽文字" v-model="slotText" clearable />

    <CustomDivider></CustomDivider>
    <CustomCollapse
      v-model="value"
      :accordion="accordion"
      :options="[
        { label: '選項1', value: 'options1' },
        { label: '選項2', value: 'options2', disabled: true },
        { label: '選項3', value: 'options3', disabled: false },
        { label: '選項4', value: 'options4', disabled: false }
      ]"
    >
      <template #default="{ label, value, disabled }">
        <div class="flex-column i-ga-md">
          <label>{{ `文字: ${label}` }}</label>
          <label>{{ `值: ${value}` }}</label>
          <label class="text-danger">{{ `是否鎖定: ${disabled}` }}</label>
          <div class="card-info i-pa-xs">{{ `設定結果：{ ${slotText} }` }}</div>
        </div>
      </template>
    </CustomCollapse>

    <CustomDivider>markdown</CustomDivider>
    <CustomMarkdown :text="markdown" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px;
}
</style>
