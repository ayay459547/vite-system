<script setup lang="ts">
import {
  CustomButton,
  CustomDivider,
  CustomDialog
} from '@/components'
import { ref} from 'vue'

const isShow = ref(false)

</script>

<template>
  <div class="page">
    <h3>對話框測試</h3>

    <CustomDivider />

    <CustomButton
      label="打開"
      class="i-my-sm"
      @click="isShow = true"
    />

    <CustomButton
      label="關閉"
      class="i-my-sm"
      @click="isShow = false"
    />

    <CustomDialog
      v-model="isShow"
      draggable
      modal
    >
      <h3>測試 CustomDialog</h3>
    </CustomDialog>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
