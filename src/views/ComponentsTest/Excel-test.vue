<script setup lang="ts">
import { inject, ref } from 'vue'
import type { Hook } from '@/declare/hook'
import ExcelJs from 'exceljs'
import { CustomButton, CustomModal } from '@/components'

const hook: Hook = inject('hook')
const { loading } = hook()

function onClick () {
  const workbook = new ExcelJs.Workbook() // 創建試算表檔案
  const sheet = workbook.addWorksheet('工作表範例1') //在檔案中新增工作表 參數放自訂名稱

  sheet.addTable({ // 在工作表裡面指定位置、格式並用columsn與rows屬性填寫內容
    name: 'table名稱',  // 表格內看不到的，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
    ref: 'A1', // 從A1開始
    columns: [{name: '名字'}, {name: '年齡'}, {name: '電話'}],
    rows: [
      ['小明', '20', '0987654321'],
      ['小美', '23', '0912345678'],
      ['小華', '21', '0912345674'],
      ['小綠', '52', '0912345672']
    ]
  })

  // 表格裡面的資料都填寫完成之後，訂出下載的callback function
  // 異步的等待他處理完之後，創建url與連結，觸發下載
  workbook.xlsx.writeBuffer().then((content) => {
  const link = document.createElement('a')
    const blobData = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    })
    link.download = '測試的試算表.xlsx'
    link.href = URL.createObjectURL(blobData)
    link.click()
  })
}

function changeLoading () {
  loading(true, 'loader-test')

  setTimeout(() => {
    loading(false)
  }, 3000)
}

const modalShow = ref(false)
const openModal = () => {
  modalShow.value = true
}

</script>

<template>
  <div class="excel">
    <CustomButton label="excel" @click="onClick"/>

    <CustomButton label="loading-test" @click="changeLoading"/>

    <CustomButton label="modal-test" @click="openModal"/>

    <CustomModal v-model="modalShow"/>
  </div>
</template>

<style lang="scss" scoped>
.excel {
  width: 100%;
  height: 100%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>