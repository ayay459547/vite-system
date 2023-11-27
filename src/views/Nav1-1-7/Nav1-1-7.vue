<script setup lang="ts">
import {
  CustomButton,
  CustomDivider,
  CustomDialog,
  CustomModal
} from '@/components'
import { ref} from 'vue'

const isShow = ref(false)

const modalIsShow = ref(false)

</script>

<template>
  <div class="page">
    <h3>對話框測試</h3>

    <CustomDivider />

    <CustomButton
      type="success"
      label="打開 Dialog"
      class="i-my-sm"
      @click="isShow = true"
    />

    <CustomButton
      type="warning"
      label="關閉 Dialog"
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


    <CustomDivider />

    <CustomButton
      type="primary"
      label="打開 Modal"
      class="i-my-sm"
      @click="modalIsShow = true"
    />

    <CustomButton
      type="warning"
      label="關閉 Modal"
      class="i-my-sm"
      @click="modalIsShow = false"
    />

    <CustomModal
      v-model="modalIsShow"
      :modal="false"
      draggable
      width-size="extraSmall"
    >
      <h3>測試 CustomModal 拖拉 draggable</h3>
    </CustomModal>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
