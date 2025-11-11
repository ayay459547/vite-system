<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'

import { type Permission, getPermission, defaultPermission } from '@/lib/lib_permission' // 權限
import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { CustomWatermark, CustomLockView } from '@/components' // 系統組件
import { useState, useEffect } from '@/lib/lib_hook' // 自訂Composition API

const useHook: UseHook = inject('useHook')
const { i18nTranslate, permission } = useHook()

const userPermission = ref<Permission>(getPermission(defaultPermission))

const [count, setCount] = useState(100)

useEffect(
  (newValue, oldValue) => {
    console.table({
      newValue,
      oldValue
    })

    return () => {
      console.log('onUnmounted 777')
    }
  },
  [count]
)

const testUseState = () => {
  setTimeout(() => {
    setCount(4545)
  }, 2000)

  setTimeout(() => {
    setCount(55688)
  }, 5000)
}

onMounted(() => {
  userPermission.value = permission('nav4-4')

  console.log(`${i18nTranslate('nav4-4')} => `, userPermission.value)

  testUseState()
})

const isLock = ref(true)
</script>

<template>
  <div class="page">
    <h4>浮水印</h4>
    <h5>{{ count }}</h5>
    <div class="flex-row i-ga-md">
      <button @click="setCount(count + 1)">Add Count</button>
      <button @click="count = 666">Add Count read</button>
      <button @click="isLock = !isLock">change Lock</button>
    </div>

    <div>
      <div
        style="width: fit-content"
        v-fixed="{ content: '測試', class: 'text-danger' }"
      >
        v-fixed
      </div>
    </div>

    <div class="lock-view">
      <CustomLockView :is-lock="isLock" description="你好啊">
        <!-- <template #description>
          <div @click="isLock = !isLock">點擊切換</div>
        </template> -->
        <div class="lock">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
          galley of type and scrambled it to make a type specimen book. It has survived not only five
          centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
          It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum.

          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
          galley of type and scrambled it to make a type specimen book. It has survived not only five
          centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
          It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum.
        </div>
      </CustomLockView>
    </div>

    <div class="watermark">
      <CustomWatermark image="https://element-plus.org/images/element-plus-logo.svg">
        77777
      </CustomWatermark>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.watermark,
.lock-view {
  width: 100%;
  min-height: 300px;
}
.lock {
  width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
