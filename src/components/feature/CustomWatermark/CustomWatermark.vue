<script setup lang="ts">
import { ElWatermark } from 'element-plus'

</script>

<template>
  <div>
    <ElWatermark
      :width="130"
      :height="30"
      image="https://element-plus.org/images/element-plus-logo.svg"
    >
      <div style="height: 500px">
        CustomWatermark
      </div>
    </ElWatermark>
  </div>
</template>

<style lang="scss" scoped>

</style>
