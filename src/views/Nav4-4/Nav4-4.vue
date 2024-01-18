<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'

import { type Permission, getPermission, defaultPermission } from '@/lib/lib_permission'
import type { UseHook } from '@/declare/hook'
import { CustomWatermark } from '@/components'
import { useState, useEffect } from '@/lib/lib_hook'

const useHook: UseHook = inject('useHook')
const { i18nTranslate, permission } = useHook()

const userPermission = ref<Permission>(getPermission(defaultPermission))

const [count, setCount] = useState(100)

useEffect((newValue, oldValue) => {
  console.table({
    newValue,
    oldValue
  })

  return () => {
    console.log('onUnmounted 777')
  }

}, [count])

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

</script>

<template>
  <div class="page">
    <h4>浮水印</h4>
    <h5>{{ count }}</h5>
    <div class="flex-row i-ga-md">
      <button @click="setCount(count + 1)">Add Count</button>
      <button @click="count = 666">Add Count read</button>
    </div>

    <div>
      <CustomWatermark />
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
</style>
