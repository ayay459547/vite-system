
<script setup lang="ts">
import { ref } from 'vue'
import markdown from '@/components/feature/CustomDrawer/CustomDrawer.md?raw'
import {
  CustomInput,
  CustomDivider,
  CustomMarkdown
} from '@/components'

import type {
  DividerDirection,
  DividerBorderStyle,
  DividerContentPosition
} from '@/components'

const directionOptions = [
  { label: 'horizontal', value: 'horizontal' },
  { label: 'vertical', value: 'vertical' }
]
const direction = ref<DividerDirection>('horizontal')

const styleOptions = [
  { label: 'solid', value: 'solid' },
  { label: 'dotted', value: 'dotted' },
  { label: 'dashed', value: 'dashed' },
  { label: 'double', value: 'double' },
  { label: 'groove', value: 'groove' },
  { label: 'ridge', value: 'ridge' },
  { label: 'hidden', value: 'hidden' }
]
const style = ref<DividerBorderStyle>('solid')

const positionOptions = [
  { label: 'left', value: 'left' },
  { label: 'center', value: 'center' },
  { label: 'right', value: 'right' }
]
const position = ref<DividerContentPosition>('left')


// slot
const slotText = ref('slot default')
</script>

<template>
  <div class="page">
    <CustomInput
      v-model="direction"
      label="方向"
      type="radio"
      :options="directionOptions"
    />

    <CustomInput
      v-model="style"
      label="線條類型"
      type="radio"
      :options="styleOptions"
    />

    <CustomInput
      v-model="position"
      label="位置"
      type="radio"
      :options="positionOptions"
    />

    <CustomInput label="插槽文字" v-model="slotText" clearable/>

    <div class="page-divider">
      <CustomDivider
        :direction="direction"
        :border-style="style"
        :content-position="position"
      >
        <h4>{{ `slot{ ${slotText} }` }}</h4>
      </CustomDivider>
    </div>

    <CustomDivider>markdown</CustomDivider>
    <CustomMarkdown :text="markdown" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px;

  &-divider {
    width: 100%;
    height: 200px;
    min-height: 200px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
