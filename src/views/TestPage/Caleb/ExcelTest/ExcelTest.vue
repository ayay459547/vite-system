<script setup lang="ts">
import { CustomButton } from '@/components'

const download1 = () => {
  console.log('download1')
}

</script>

<template>
  <div class="page">
    ExcelTest

    <CustomButton
      label="簡易下載"
      icon-name="ticket"
      type="primary"
      @click="download1"
    />
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
