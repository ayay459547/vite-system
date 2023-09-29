
<script setup lang="ts">
import { ref } from 'vue'
import markdown from '@/components/feature/CustomDrawer/CustomDrawer.md?raw'
import {
  CustomInput,
  CustomDivider,
  CustomMarkdown,
  CustomButton,
  CustomDrawer
} from '@/components'

import type { DrawerDirection } from '@/components'

const directionOptions = [
  { label: 'rtl', value: 'rtl' },
  { label: 'ltr', value: 'ltr' },
  { label: 'ttb', value: 'ttb' },
  { label: 'btt', value: 'btt' }
]
const direction = ref<DrawerDirection>('rtl')

const sizeOptions = [
  { label: '300', value: '300' },
  { label: '400', value: '400' },
  { label: '500', value: '500' }
]
const size = ref('300')

// slot
const slotText = ref('slot default')

const isShow = ref(false)

</script>

<template>
  <div class="page">
    <CustomInput
      v-model="direction"
      label="打開方向"
      type="radio"
      :options="directionOptions"
    />

    <CustomInput
      v-model="size"
      label="大小"
      type="radio"
      :options="sizeOptions"
    />

    <CustomInput label="插槽文字" v-model="slotText" clearable/>

    <CustomButton
      label="打開Drawer"
      class="i-my-xs"
      type="info"
      @click="isShow = true"
    />

    <CustomDrawer
      v-model="isShow"
      :direction="direction"
      :size="size"
    >
      <template #header>
        <span>{{ 'header slot' }}</span>
      </template>
      <template #footer>
        <span>{{ 'footer slot' }}</span>
      </template>
      <h4>{{ `slot{ ${slotText} }` }}</h4>
    </CustomDrawer>

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
