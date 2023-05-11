<script setup lang="ts">
import { inject } from 'vue'
import { getColumns } from '@/lib/util'

const locale = inject('locale')

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
  },
  select: {
    label: '選擇框',
    fitler: {
      required: true,
      options: list
    }
  }
}

const {
  columns: filterColumn,
  forms: filterForm,
  // refs: refMap,
  validate: validateForm
} = getColumns(columnSetting, 'fitler', 'Object')

const validateAll = () => {
  validateForm().then(successList => {
    console.log(successList)
  }).catch(errorList => {
    console.log(errorList)
  })
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
      v-model="filterForm.select"
      v-bind="filterColumn.select"
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