<script setup lang="ts">
import {
  CustomButton,
  CustomDivider,
  CustomDialog,
  CustomModal
} from '@/components'
import { ref, onMounted } from 'vue'

const isShow = ref(false)

const modalIsShow = ref(true)
const modalIsShow2 = ref(false)
const modalIsShow3 = ref(false)

const isLoading = ref(false)

onMounted(() => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 1500)

  setTimeout(() => {
    isLoading.value = true
  }, 5000)

  setTimeout(() => {
    isLoading.value = false
  }, 10000)
})

</script>

<template>
  <div class="page">
    <h3>對話框測試</h3>

    <CustomDivider />

    <div class="flex-row i-ga-xs">
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
    </div>


    <CustomDivider />

    <div class="flex-row i-ga-xs">
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
        :loading="isLoading"
      >
        <h3>測試 CustomModal 拖拉 draggable</h3>
      </CustomModal>
    </div>

    <div class="flex-row i-ga-xs">
      <CustomButton
        type="primary"
        label="打開 Modal2"
        class="i-my-sm"
        @click="modalIsShow2 = true"
      />

      <CustomButton
        type="warning"
        label="關閉 Modal2"
        class="i-my-sm"
        @click="modalIsShow2 = false"
      />

      <CustomModal
        v-model="modalIsShow2"
        :modal="false"
        draggable
        width-size="small"
        height-size="small"
      >
        <h3>測試 CustomModal2 拖拉 draggable</h3>
      </CustomModal>
    </div>

    <div class="flex-row i-ga-xs">
      <CustomButton
        type="primary"
        label="打開 Modal3"
        class="i-my-sm"
        @click="modalIsShow3 = true"
      />

      <CustomButton
        type="warning"
        label="關閉 Modal3"
        class="i-my-sm"
        @click="modalIsShow3 = false"
      />

      <CustomModal
        v-model="modalIsShow3"
        :modal="false"
        draggable
        width-size="extraSmall"
        height-size="extraSmall"
      >
        <h3>測試 CustomModal3 拖拉 draggable</h3>
      </CustomModal>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
