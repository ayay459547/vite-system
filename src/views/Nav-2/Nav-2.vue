<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string>('Aa123456')
const valuePhone = ref<string>('')

// import { useEnvStore } from '@/stores/env'

// const envStore = useEnvStore()

// console.log(envStore)

</script>

<template>
  <div class="nav-2">
    <h1 class="i-mb-md">This is Nav-2 page</h1>
    <FormInput
      v-model="value"
      label="測試密碼"
      required
      :validate="['password']"
    />
    <FormInput
      v-model="valuePhone"
      label="測試phone"
      :validate="['phone']"
    />
  </div>
</template>

<style lang="scss" scoped>
.nav-2 {
  width: 100%;
  height: 100%;
  padding: 32px;
}
</style>