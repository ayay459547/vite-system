<script setup lang="ts">
import { ref } from 'vue'
import { ElDatePicker } from 'element-plus'

const value1 = ref('')

</script>

<template>
  <div class="data-table">
    <h1>Data-table-test</h1>
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
.data-table {
  width: 100%;
  height: 100%;
  padding: 32px;
}
</style>