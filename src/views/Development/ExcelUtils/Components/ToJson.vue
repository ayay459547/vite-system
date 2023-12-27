<script setup lang="ts">
import { ref, computed } from 'vue'

import { CustomMarkdown, CustomButton, CustomUpload } from '@/components'
import { isEmpty, downloadStaticFile, swal } from '@/lib/lib_utils'

const textData = ref('')
const jsonData = computed(() => {
  return `\`\`\`json
    ${textData.value}
  \`\`\``
})

const excelRef = ref()
const excelToJson = () => {
  const files = excelRef.value.getFiles()
  if (isEmpty(files)) {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: '無檔案資料',
      showCancelButton: false
    })
    return
  }
  files.forEach((file) => {
    if (!isEmpty(file.excel)) {
      const _data = file.excel
      const { map, matrix } = _data
      textData.value = `
        ${JSON.stringify(map)},
        ${JSON.stringify(matrix)}
      `
    }
  })
}

</script>

<template>
  <div class="container">
    <div class="flex-row content-between i-pb-sm">
      <label>Excel 轉 JSON</label>
      <CustomButton label="下載使用範例" type="info" icon-name="download" @click="downloadStaticFile('/file', 'Excel轉JSON.xlsx')"/>
    </div>

    <div>
      <CustomUpload ref="excelRef" type="excel" />
      <div class="fill-x i-mt-md flex-row-center">
        <CustomButton label="轉換" type="primary" icon-name="arrow-down" @click="excelToJson" />
      </div>
    </div>

    <CustomMarkdown :text="jsonData" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: fit-content;
}
</style>
