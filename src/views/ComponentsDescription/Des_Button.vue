<script setup lang="ts">
import { ref, computed } from 'vue'

import markdown from '@/components/feature/CustomButton/CustomButton.md?raw'
import type { ButtonProps } from '@/components'
import { CustomInput, CustomDivider, CustomMarkdown, CustomButton } from '@/components'

const sizeOptions = [
  { label: 'large', value: 'large' },
  { label: 'default', value: 'default' },
  { label: 'small', value: 'small' }
]
const size = ref<ButtonProps.Size>('default')

const typeOptions = [
  { label: 'success', value: 'success' },
  { label: 'default', value: 'default' },
  { label: 'primary', value: 'primary' },
  { label: 'info', value: 'info' },
  { label: 'warning', value: 'warning' },
  { label: 'danger', value: 'danger' }
]
const type = ref<ButtonProps.Type>('success')

const styleOptions = [
  { label: '無', value: '' },
  { label: 'text', value: 'text' },
  { label: 'plain', value: 'plain' },
  { label: 'round', value: 'round' },
  { label: 'circle', value: 'circle' },
  { label: 'disabled', value: 'disabled' },
  { label: 'loading', value: 'loading' }
]
const style = ref('')

const attr = computed(() => {
  switch (style.value) {
    case 'text':
      return { text: true }
    case 'plain':
      return { plain: true }
    case 'round':
      return { round: true }
    case 'circle':
      return { circle: true }
    case 'disabled':
      return { disabled: true }
    case 'loading':
      return { loading: true }
    default:
      return {}
  }
})

const iconTypeOptions = [
  { label: 'fas', value: 'fas' },
  { label: 'far', value: 'far' },
  { label: 'fab', value: 'fab' }
]
const iconType = ref<ButtonProps.IconType>('fas')

const iconNameOptions = [
  { label: 'bookmark', value: 'bookmark' },
  { label: 'user', value: 'user' },
  { label: 'file', value: 'file' },
  { label: 'snowflake', value: 'snowflake' },
  { label: 'registered', value: 'registered' },
  { label: 'squarespace', value: 'squarespace' }
]
const iconName = ref('bookmark')

const iconMoveOptions = [
  { label: 'none', value: 'none' },
  { label: 'translate', value: 'translate' },
  { label: 'rotate', value: 'rotate' },
  { label: 'scale', value: 'scale' }
]
const iconMove = ref<ButtonProps.IconMove>('none')

const colorOptions = [
  { label: '無', value: '' },
  { label: '#409EFF', value: '#409EFF' },
  { label: '#b88230', value: '#b88230' },
  { label: '#c45656', value: '#c45656' },
  { label: '#73767a', value: '#73767a' }
]
const color = ref('')

// slot
const slotText = ref('slot default')
</script>

<template>
  <div class="page">
    <CustomInput v-model="size" label="大小" type="radio" :options="sizeOptions" />
    <CustomInput v-model="type" label="類型" type="radio" :options="typeOptions" />
    <CustomInput v-model="style" label="其他參數" type="radio" :options="styleOptions" />

    <CustomInput
      v-model="iconType"
      label="圖示設定"
      type="radio"
      :options="iconTypeOptions"
      hidden-label
    />
    <CustomInput v-model="iconName" type="radio" :options="iconNameOptions" hidden-label />
    <CustomInput v-model="iconMove" type="radio" :options="iconMoveOptions" hidden-label />

    <CustomInput v-model="color" label="顏色" type="radio" :options="colorOptions" />

    <CustomButton
      label="設定結果"
      :size="size"
      :color="color"
      :type="type"
      :icon-type="iconType"
      :icon-name="iconName"
      :icon-move="iconMove"
      v-bind="attr"
    />
    <CustomDivider />
    <CustomInput label="插槽文字" v-model="slotText" clearable />
    <CustomButton
      label="設定結果"
      :size="size"
      :type="type"
      :icon-type="iconType"
      :icon-name="iconName"
      :icon-move="iconMove"
      class="i-mt-sm"
    >
      <span>{{ `slot{ ${slotText} }` }}</span>
    </CustomButton>

    <CustomDivider>markdown</CustomDivider>
    <CustomMarkdown :text="markdown" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px;
}
</style>
