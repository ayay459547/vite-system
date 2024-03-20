<script setup lang="ts">
import { ref } from 'vue'
import { CustomCharts } from '@/components'
import { textOptions } from './options'
import { ElCalendar } from 'element-plus'

const value = ref(new Date())

const options = () => {
  return textOptions
}

</script>

<template>
  <div class="locatehome">
    <ElCalendar v-model="value" />
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
  display: flex;
  flex-direction: column;
  gap: 128px;

  &-title {
    width: 100%;
    height: 120px;
  }
}
</style>
