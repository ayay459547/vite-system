<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { ref, inject, computed, reactive } from 'vue'
import { getColumns, validateForm } from '@/lib/util'

const locale = inject('locale')

const valueSelect = ref<string>('')
const list = [
  {
    label: 'test1',
    value: '0'
  },
  {
    label: 'test2',
    value: '1'
  },
  {
    label: 'test3',
    value: '2'
  }
]

const columnSetting = {
  passowrd: {
    label: '密碼',
    fitler: {
      validate: ['password'],
      required: true
    }
  },
  phone: {
    label: '手機',
    fitler: {
      validate: ['phone'],
      required: false
    }
  }
}
// const filterForm = reactive({
//   passowrd: '',
//   phone: ''
// })

const {
  columns: filterColumn,
  forms: filterForm
} = getColumns(columnSetting, 'fitler', 'Object')

console.log(filterColumn)
console.log(filterForm)

// https://blog.csdn.net/qq_26834399/article/details/119992536

const passowrdValidate = ref(null)
const validateAll = () => {
  console.log(passowrdValidate.value.validateValue(filterForm.passowrd))
  // validateForm(columnSetting)
}

</script>

<template>
  <div class="input-test">
    <h2 class="i-mb-md">{{ locale }}</h2>

    <FormInput
      v-model="filterForm.passowrd"
      v-bind="filterColumn.passowrd"
    />
    <FormInput
      v-model="filterForm.phone"
      v-bind="filterColumn.phone"
    />

    <FormSelect
      v-model="valueSelect"
      label="測試select"
      required
      :options="list"
    />

    <AdvantButton
      label="驗證輸入框"
      @click="validateAll"
    />
  </div>
</template>

<style lang="scss" scoped>
.input-test {
  width: 100%;
  height: 100%;
  padding: 32px;
}
</style>