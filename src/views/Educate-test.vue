<script setup lang="ts">
import { ref, watch } from 'vue'

import { CustomInput } from '@/components'

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

const dateValue = ref(null)

const selectValue = ref(null)

const operatorValue = ref<any>([null, null])

const onOperatorChange = (v) => {
  console.log(v)
}

</script>

<template>
  <div class="container">
    <div>教育訓練</div>
    <CustomInput
      v-model="operatorValue"
      type="operator"
      :options="[
        { label: '=', value: 'equal' },
        { label: '>=', value: 'greatthan' },
        { label: '<=', value: 'lessthan' }
      ]"
      label="Operator測試"
      @change="onOperatorChange"
    />
    <CustomInput
      v-model="dateValue"
      type="date"
      label="日期測試"
    />
    <CustomInput
      v-model="checkValue"
      label="勾選測試"
      type="checkbox"
    />
    <CustomInput
      v-model="selectValue"
      label="選項測試"
      type="select"
      :options="options"
    />
    <CustomInput
      v-model="valueTest"
      type="radio"
      :options="options"
    />
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
