<script setup lang="ts">
import { ref } from 'vue'
import { ElDatePicker } from 'element-plus'

const value1 = ref('')
</script>

<template>
  <div class="about">
    <h1 class="i-mb-md">This is an about page</h1>

    <ElDatePicker
      v-model="value1"
      type="daterange"
      range-separator="To"
      start-placeholder="Start date"
      end-placeholder="End date"
    />
  </div>
</template>

<style lang="scss" scoped>
.about {
  width: 100%;
  height: 100%;
  padding: 32px;
}
</style>
