<script setup lang="ts">
import { CustomCharts } from '@/components'
import { textOptions } from './options'

const options = () => {
  return textOptions
}

</script>

<template>
  <div class="locatehome">
    <div class="locatehome-title">
      <CustomCharts :options="options"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.locatehome {
  width: 100%;
  height: 100%;
  padding: 16px;

  &-title {
    width: 100%;
    height: 120px;
  }
}
</style>
