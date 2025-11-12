<script setup lang="ts">
import { onMounted } from 'vue'

import { CustomDivider } from '@/components/feature'
import { CustomUpload } from '@/components/input'

onMounted(() => {
  console.log(123)
})
</script>

<template>
  <div class="page">
    <h3>測試檔案上傳</h3>

    <CustomUpload type="image" multiple />

    <CustomDivider />

    <CustomUpload multiple />
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
