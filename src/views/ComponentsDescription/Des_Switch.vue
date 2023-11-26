
<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import markdown from '@/components/feature/CustomSwitch/CustomSwitch.md?raw'
import {
  type SwitchSize,
  CustomInput,
  CustomDivider,
  CustomMarkdown,
  CustomSwitch
} from '@/components'

const value = ref(true)

const sizeOptions = [
  { label: '大', value: 'large' },
  { label: '中', value: 'default' },
  { label: '小', value: 'small' }
]
const size = ref<SwitchSize>('default')

// slot
const activeText = ref('activeText')
const inactiveText = ref('inactiveText')
</script>

<template>
  <div class="page">
    <CustomInput
      v-model="size"
      label="大小"
      type="radio"
      :options="sizeOptions"
    />
    <CustomInput
      label="啟用文字"
      v-model="activeText"
      clearable
      class="i-my-sm"
    />
    <CustomInput
      label="關閉文字"
      v-model="inactiveText"
      clearable
      class="i-my-sm"
    />

    <CustomSwitch
      v-model="value"
      :active-text="activeText"
      :inactive-text="inactiveText"
      :size="size"
    />

    <CustomDivider>markdown</CustomDivider>
    <CustomMarkdown :text="markdown" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px;
}
</style>
