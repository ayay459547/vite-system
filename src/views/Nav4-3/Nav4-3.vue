<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { type Permission, getPermission, defaultPermission } from '@/lib/lib_permission' // 權限

import type { UseHook } from '@/types/types_hook' // 全域功能類型

const useHook: UseHook = inject('useHook')
const { i18nTranslate, permission } = useHook()

const userPermission = ref<Permission>(getPermission(defaultPermission))

const testList = [
  'any',
  'leaveBlankIfNull',
  'system',
  'test',
  'view',
  'excelSystem',
  'excelTest',
  'excelView'
]

onMounted(() => {
  userPermission.value = permission('nav4-3')

  console.log(`${i18nTranslate('nav4-3')} => `, userPermission.value)
})
</script>

<template>
  <div class="page">
    <h4>測試翻譯檔 View</h4>

    <div v-for="key in testList" :key="key" class="flex-row align-center i-ga-md">
      <label>{{ key }}</label>
      <p>{{ i18nTranslate(key) }}</p>
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
