<script setup lang="ts">
import { ref, nextTick } from 'vue'

import { CustomButton } from '@/components/feature' // 系統組件

import RowInput from './RowInput.vue'

const RowInputRef1 = ref<InstanceType<typeof RowInput>>()
const RowInputRef2 = ref<InstanceType<typeof RowInput>>()
const RowInputRef3 = ref<InstanceType<typeof RowInput>>()
const RowInputRef4 = ref<InstanceType<typeof RowInput>>()
const RowInputRef5 = ref<InstanceType<typeof RowInput>>()
const replaceText = async () => {
  await nextTick()
  RowInputRef1.value.replaceText()
  RowInputRef2.value.replaceText()
  RowInputRef3.value.replaceText()
  RowInputRef4.value.replaceText()
  RowInputRef5.value.replaceText()
}

</script>

<template>
  <div class="flex-column i-ga-md">
    <!-- 替換文字 -->
    <div class="flex-column i-ga-xs">
      <h3>網頁替換文字 測試</h3>
      <RowInput ref="RowInputRef1" />
      <RowInput ref="RowInputRef2" />
      <RowInput ref="RowInputRef3" />
      <RowInput ref="RowInputRef4" />
      <RowInput ref="RowInputRef5" />

      <CustomButton
        icon-name="language"
        label="替換"
        type="warning"
        plain
        size="large"
        style="width: 100%;"
        @click="replaceText"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
