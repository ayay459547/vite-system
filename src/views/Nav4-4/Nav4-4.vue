<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'

import { type Permission, getPermission, defaultPermission } from '@/lib/lib_permission'
import type { Hook } from '@/declare/hook'
import { CustomWatermark } from '@/components'

const hook: Hook = inject('hook')
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
  userPermission.value = permission('nav4-1')

  console.log(`${i18nTranslate('nav4-1')} => `, userPermission.value)
})

</script>

<template>
  <div class="page">
    <h4>浮水印</h4>

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
}
</style>
