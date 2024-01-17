<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { type Permission, getPermission, defaultPermission } from '@/lib/lib_permission'

import type { UseHook } from '@/declare/hook'

const hook: UseHook = inject('useHook')
const { i18nTranslate, permission } = hook()

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
  userPermission.value = permission('nav4-2')

  console.log(`${i18nTranslate('nav4-2')} => `, userPermission.value)
})

</script>

<template>
  <div class="page">
    <h4>測試翻譯檔 Test</h4>

    <div
      v-for="key in testList"
      :key="key"
      class="flex-row align-center i-ga-md"
    >
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
