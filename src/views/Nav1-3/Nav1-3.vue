<script setup lang="ts">
import { CustomUpload, CustomDivider } from '@/components'
</script>

<template>
  <div class="page">
    <h3>測試檔案上傳</h3>

    <CustomUpload
      type="image"
      multiple
    />

    <CustomDivider />

    <CustomUpload
      type="word"
      multiple
    />
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
