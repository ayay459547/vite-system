<script setup lang="ts">
import { ref, watch } from 'vue'
import { CustomRadio, CustomCheckbox } from '@/components'

const valueTest = ref<number | null>(null)

watch(valueTest, (newValue) => {
  console.log('newValue => ', newValue)
})

const options = [
  { label: '選項一', value: 0 },
  { label: '選項二', value: 1 },
  { label: '選項三', value: 2 }
]

const checkValue = ref(false)
</script>

<template>
  <div class="container">
    <div>教育訓練</div>
    <CustomRadio
      v-model="valueTest"
      :options="options"
    />
    <CustomCheckbox v-model="checkValue" label="勾選"/>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 16px;
}
</style>