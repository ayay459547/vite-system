<script setup lang="ts">
import { CustomCharts } from '@/components'
import { textOptions } from './options'

const options = () => {
  return textOptions
}

</script>

<template>
  <div class="home">
    <div class="home-title">
      <CustomCharts :options="options"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  padding: 16px;

  &-title {
    width: 100%;
    height: 120px;
  }
}
</style>