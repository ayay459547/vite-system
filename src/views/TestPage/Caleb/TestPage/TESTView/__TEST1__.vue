<script setup lang="ts">
import { ref } from 'vue'
import { CustomInput } from '@/components/input'
// import { CustomButton } from '@/components/feature'

const inputValue = ref('')
// let inputValue = ''

const logValue = () => {
  console.log({
    // inputValue,
    inputValue: inputValue.value
  })
}
</script>

<template>
  <div class="i-page flex-column i-ga-md" style="width: 300px;">
    <!-- 一般 input -->
    <input v-model="inputValue" />
    <input
      :value="inputValue"
      @input="($event: any) => { inputValue = $event.target.value }"
    />
    <!-- 組件 input -->
    <CustomInput v-model="inputValue" hidden-label />
    <CustomInput
      :model-value="inputValue"
      hidden-label
      @update:model-value="$event => inputValue = $event"
    />
    <p>inputValue: {{ inputValue }}</p>

    <button @click="logValue">logValue</button>
  </div>
</template>

<style lang="scss" scoped></style>
