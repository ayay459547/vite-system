<script setup lang="ts">
import { ref } from 'vue'

import markdown from '@/components/feature/CustomPopover/CustomPopover.md?raw'
import type { Options } from '@/components'
import type { CustomPopoverProps } from '@/components/feature'
import { CustomDivider, CustomMarkdown, CustomPopover, CustomButton } from '@/components/feature'
import { CustomInput } from '@/components/input'

const isVisible = ref(false)

const placementOptions = [
  { label: 'top', value: 'top' },
  { label: 'top-start', value: 'top-start' },
  { label: 'top-end', value: 'top-end' },
  { label: 'bottom', value: 'bottom' },
  { label: 'bottom-start', value: 'bottom-start' },
  { label: 'bottom-end', value: 'bottom-end' },
  { label: 'left', value: 'left' },
  { label: 'left-start', value: 'left-start' },
  { label: 'left-end', value: 'left-end' },
  { label: 'right', value: 'right' },
  { label: 'right-start', value: 'right-start' },
  { label: 'right-end', value: 'right-end' }
]
const placement = ref<CustomPopoverProps['placement']>('top')

const triggerOptions = [
  { label: 'click', value: 'click' },
  { label: 'hover', value: 'hover' }
]
const trigger = ref<CustomPopoverProps['trigger']>('hover')

const showArrowOptions: Options<any> = [
  { label: '是', value: true },
  { label: '否', value: false }
]
const showArrow = ref<boolean>(true)

const widthOptions = [
  { label: '150', value: 150 },
  { label: '200', value: 200 },
  { label: '250', value: 250 },
  { label: '300', value: 300 }
]
const width = ref<number>(150)

const offsetOptions = [
  { label: '0', value: 0 },
  { label: '10', value: 10 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
]
const offset = ref<number>(0)

// slot
const slotText = ref('slot default')
</script>

<template>
  <div class="page">
    <div class="flex-row i-ga-sm i-mb-sm">
      <CustomButton label="顯示" icon-name="eye" @click="isVisible = true" />
      <CustomButton label="隱藏" icon-name="eye-slash" @click="isVisible = false" />
    </div>

    <CustomInput v-model="placement" label="位置" type="radio" :options="placementOptions" />
    <CustomInput v-model="trigger" label="與滑鼠互動方式" type="radio" :options="triggerOptions" />
    <CustomInput
      v-model="showArrow"
      label="是否顯示箭頭"
      type="radio"
      :options="showArrowOptions"
    />
    <CustomInput v-model="width" label="寬度" type="radio" :options="widthOptions" />
    <CustomInput v-model="offset" label="偏移量" type="radio" :options="offsetOptions" />

    <CustomInput v-model="slotText" label="提示框顯示內容" type="text" />

    <CustomPopover
      v-model:visible="isVisible"
      :width="width"
      :placement="placement"
      :trigger="trigger"
      :show-arrow="showArrow"
      :offset="offset"
    >
      <template #reference>
        <CustomButton label="reference slot" type="info" plain class="i-my-sm" />
      </template>
      <div>{{ slotText }}</div>
    </CustomPopover>

    <CustomDivider>markdown</CustomDivider>
    <CustomMarkdown :text="markdown" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px;
}
</style>
