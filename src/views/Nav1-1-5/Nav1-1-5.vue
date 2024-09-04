<script setup lang="ts">
import { ElCard } from 'element-plus'
import { ref, onMounted } from 'vue'

import { CustomScrollbar, CustomButton, CustomDivider, CustomDialog, CustomModal } from '@/components'
import { useElementSize } from '@/lib/lib_hook'

import TestKeepAlive from './TestKeepAlive.vue'

// 拖拉
const resizeRef = ref()

const testSize = useElementSize(resizeRef)

const list = ref([1, 2, 3, 4, 5])
const add = () => {
  const newValue = list.value.length + 1
  list.value.push(newValue)
}

onMounted(() => {
  if (resizeRef.value) {
    console.log(resizeRef.value)
  }
})

// 彈窗

const isShow = ref(false)

const modalIsShow = ref(false)
const modalIsShow2 = ref(false)
const modalIsShow3 = ref(false)
const modalIsShow4 = ref(false)

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
  <div class="nav1-1-5">
    <!-- 卡片 -->
    <div class="test-card grid-col-xs-24 grid-col-md-16">
      <ElCard v-for="n in 5" :key="n" :body-style="{ padding: '0px' }">
        <img
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image"
        />
        <div style="padding: 12px">
          <div class="flex-column i-ga-xs i-pb-md">
            <span>Yummy hamburger - {{ n }}</span>
            <time class="time">{{ `2023-08-${n}` }}</time>
          </div>
          <CustomButton label="Operating" icon-name="wheat-awn" text />
        </div>
      </ElCard>
    </div>
    <!-- 拖拉 -->
    <h2>scrollbar</h2>
    <div>
      <CustomScrollbar height="400px">
        <p v-for="item in list" :key="item" class="page-demo-item">{{ item }}</p>
      </CustomScrollbar>
    </div>

    <CustomButton label="增加" @click="add" />

    <div class="flex-column i-ga-md">
      <h3>hook 計算大小變化</h3>
      <div>width: {{ testSize.width }}</div>
      <div>height: {{ testSize.height }}</div>
    </div>
    <textarea ref="resizeRef"></textarea>

    <!-- 彈窗 -->
    <div class="page">
    <h3>對話框測試</h3>

    <CustomDivider />

    <div class="flex-row i-ga-xs">
      <CustomButton type="success" label="打開 Dialog" class="i-my-sm" @click="isShow = true" />

      <CustomButton type="warning" label="關閉 Dialog" class="i-my-sm" @click="isShow = false" />

      <CustomDialog v-model="isShow" draggable modal>
        <h3>測試 CustomDialog</h3>
      </CustomDialog>
    </div>

    <CustomDivider />

    <div class="flex-row i-ga-xs">
      <CustomButton type="primary" label="打開 Modal" class="i-my-sm" @click="modalIsShow = true" />

      <CustomButton
        type="warning"
        label="關閉 Modal"
        class="i-my-sm"
        @click="modalIsShow = false"
      />

      <CustomModal v-model="modalIsShow" :modal="false" draggable :loading="isLoading">
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

    <div class="flex-row i-ga-xs">
      <CustomButton
        type="primary"
        label="打開 Modal3"
        class="i-my-sm"
        @click="modalIsShow4 = true"
      />

      <CustomButton
        type="warning"
        label="關閉 Modal3"
        class="i-my-sm"
        @click="modalIsShow4 = false"
      />

      <CustomModal
        v-model="modalIsShow4"
        :modal="false"
        :is-keep-alive="true"
        draggable
        width-size="extraSmall"
        height-size="extraSmall"
      >
        <TestKeepAlive />
      </CustomModal>
    </div>
  </div>
  </div>
</template>

<style lang="scss" scoped>
.nav1-1-5 {
  width: 100%;
  min-height: 100%;
  height: fit-content;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.test-card {
  display: flex;
  max-width: 100%;
  width: fit-content;
  height: fit-content;
  flex-wrap: wrap;
  gap: 24px 16px;
}
.page {
  &-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

  &-resize {
    flex: 1;
    min-height: 100%;
    height: 300px;
    border: 1px solid gray;
  }
}
</style>
