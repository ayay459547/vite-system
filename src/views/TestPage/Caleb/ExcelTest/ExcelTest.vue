<script setup lang="ts">
import { onMounted } from 'vue'

import { CustomButton } from '@/components'

import testExcelData from './test.xlsx?sheetjs'
import { download1, download2, excleDownload1, excleDownload2, excleDownload3 } from './download'

onMounted(() => {
  console.log('testExcelData => ', testExcelData)
})
</script>

<template>
  <div class="page">
    ExcelTest

    <CustomButton label="官方範例" icon-name="ticket" type="primary" @click="download1" />

    <CustomButton label="簡易下載" icon-name="bomb" type="primary" @click="download2" />

    <CustomButton label="下載1" icon-name="bomb" type="primary" @click="excleDownload1" />

    <CustomButton label="下載2" icon-name="bomb" type="primary" @click="excleDownload2" />

    <CustomButton label="下載3" icon-name="bomb" type="primary" @click="excleDownload3" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
