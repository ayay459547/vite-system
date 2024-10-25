<script setup lang="ts">
import { ref, onBeforeMount, inject } from 'vue'
import { type Permission, getPermission, defaultPermission } from '@/lib/lib_permission' // 權限

import type { UseHook } from '@/declare/hook' // 全域功能類型

const useHook: UseHook = inject('useHook')
const { i18nTranslate, permission } = useHook({ i18nModule: 'system' })

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

// 頁面權限
const userPermission = ref<Permission>(getPermission(defaultPermission))
onBeforeMount(() => {
  userPermission.value = permission('nav4-1')
})

</script>

<template>
  <div class="page">
    <h4>測試翻譯檔 System</h4>

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
