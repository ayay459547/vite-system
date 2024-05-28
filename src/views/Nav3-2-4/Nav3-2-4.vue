<script setup lang="ts">
import { CustomButton, CustomBadge, CustomEmpty } from '@/components'
</script>

<template>
  <div class="page-wrapper">
    <div class="page-container">
      <div class="fill-x flex-row i-mb-md">
        <CustomBadge value="3">
          <CustomButton label="test" />
        </CustomBadge>
      </div>

      <div class="fill-x flex-row">7</div>
      <div>
        <CustomEmpty />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  &-wrapper {
    width: 100%;
    height: 100%;
    padding: 16px;
  }
  &-container {
    width: 100%;
    height: 100%;
    min-height: fit-content;
  }
}
</style>
