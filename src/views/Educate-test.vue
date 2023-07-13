<script setup lang="ts">
import { ref, watch } from 'vue'
import type { OperatorModelValue } from '@/components'
import {
  CustomRadio,
  CustomCheckbox,
  CustomDatePicker,
  CustomSelect,
  CustomOperator
} from '@/components'

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

const operatorValue = ref<OperatorModelValue>([null, null])

const onOperatorChange = (v) => {
  console.log(v)
}

</script>

<template>
  <div class="container">
    <div>教育訓練</div>
    <CustomOperator
      v-model="operatorValue"
      label="Operator測試"
      @change="onOperatorChange"
    />
    <CustomDatePicker
      v-model="dateValue"
      label="日期測試"
    />
    <CustomCheckbox v-model="checkValue" label="勾選測試"/>
    <CustomSelect
      v-model="selectValue"
      label="選項測試"
      :options="options"
    />
    <CustomRadio
      v-model="valueTest"
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