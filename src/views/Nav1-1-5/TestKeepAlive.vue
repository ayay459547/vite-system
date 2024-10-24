<script setup lang="ts">
import { ref } from 'vue'
import { CustomInput } from '@/components' // 系統組件

const inputValue = ref('')
</script>

<template>
  <div class="i-pa-md">
    <h3>測試 KeepAlive: true</h3>
    <CustomInput v-model="inputValue"></CustomInput>
  </div>
</template>

<style lang="scss" scoped></style>
