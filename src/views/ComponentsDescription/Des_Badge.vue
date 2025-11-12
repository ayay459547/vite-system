<script setup lang="ts">
import { ref, computed } from 'vue'

import markdown from '@/components/feature/CustomBadge/CustomBadge.md?raw'
import type { CustomBadgeProps } from '@/components/feature'
import { CustomDivider, CustomMarkdown, CustomBadge, CustomButton } from '@/components/feature'
import { CustomInput } from '@/components/input'

const typeOptions = [
  { label: 'primary', value: 'primary' },
  { label: 'success', value: 'success' },
  { label: 'warning', value: 'warning' },
  { label: 'danger', value: 'danger' },
  { label: 'info', value: 'info' }
]
const type = ref<CustomBadgeProps['type']>('primary')

const value = ref(20)

const styleOptions = [
  { label: '無', value: '' },
  { label: 'isDot', value: 'isDot' },
  { label: 'hidden', value: 'hidden' }
]
const style = ref('')

const attr = computed<any>(() => {
  switch (style.value) {
    case 'isDot':
      return { isDot: true }
    case 'hidden':
      return { hidden: true }
    default:
      return {}
  }
})

// slot
const slotText = ref('slot default')
</script>

<template>
  <div class="page">
    <div class="flex-row-center i-ga-md i-mb-xs">
      <CustomButton icon-name="minus" @click="value--" />
      <span>{{ value }}</span>
      <CustomButton icon-name="plus" @click="value++" />
    </div>
    <CustomInput v-model="type" label="類型" type="radio" :options="typeOptions" />
    <CustomInput v-model="style" label="其他設定" type="radio" :options="styleOptions" />
    <CustomInput label="插槽文字" v-model="slotText" clearable />
    <CustomBadge :value="value" :type="type" :max="50" v-bind="attr" class="i-mt-sm">
      <div class="card-info i-pa-xs">{{ `設定結果：{ ${slotText} }` }}</div>
    </CustomBadge>

    <CustomDivider>markdown</CustomDivider>
    <CustomMarkdown :text="markdown" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px;
}
</style>
