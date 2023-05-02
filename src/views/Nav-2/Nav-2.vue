<script setup lang="ts">
import { ref, inject } from 'vue'

const value = ref<string>('')
const locale = inject('locale')

</script>

<template>
  <div class="nav-2">
    <h1 class="i-mb-md">This is Nav-2 page</h1>
    <h2 class="i-mb-md">{{ locale }}</h2>
    <FormInput v-model="value" label="測試" />
  </div>
</template>

<style lang="scss" scoped>
.nav-2 {
  width: 100%;
  height: 100%;
  padding: 32px;
}
</style>