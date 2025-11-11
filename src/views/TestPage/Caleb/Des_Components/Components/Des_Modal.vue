<script setup lang="ts">
import { ref } from 'vue'

import markdown from '@/components/feature/CustomModal/CustomModal.md?raw'
import type { CustomModalProps } from '@/components/feature' // 系統組件: 功能
import { CustomDivider, CustomMarkdown, CustomModal, CustomButton } from '@/components/feature' // 系統組件: 功能
import { CustomInput } from '@/components/input' // 系統組件: 輸入


const widthOptions = [
  { label: 'large', value: 'large' },
  { label: 'default', value: 'default' },
  { label: 'small', value: 'small' }
]
const widthSize = ref<CustomModalProps['widthSize']>('default')

const heightOptions = [
  { label: 'large', value: 'large' },
  { label: 'default', value: 'default' },
  { label: 'small', value: 'small' }
]
const heightSize = ref<CustomModalProps['heightSize']>('default')

// slot
const slotText = ref('slot default')

const isShow = ref(false)

const onOpenClick = () => {
  isShow.value = true
}
</script>

<template>
  <div class="page">
    <CustomInput label="插槽文字" v-model="slotText" clearable class="i-mb-md" />

    <CustomInput
      label="寬度類型"
      type="radio"
      v-model="widthSize"
      :options="widthOptions"
      class="i-mb-md"
    />

    <CustomInput
      label="高度類型"
      type="radio"
      v-model="heightSize"
      :options="heightOptions"
      class="i-mb-md"
    />

    <CustomButton
      type="primary"
      label="開啟"
      icon-name="window-restore"
      class="i-my-md"
      @click="onOpenClick"
    />

    <CustomModal
      v-model="isShow"
      title="標題可自訂"
      :width-size="widthSize"
      :height-size="heightSize"
      click-outside
    >
      <template #header>
        <!-- 會覆蓋 title -->
        <h3>{{ `可自訂 slot { header } ` }}</h3>
      </template>
      <h3 class="i-pa-md">{{ slotText }}</h3>
    </CustomModal>

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
