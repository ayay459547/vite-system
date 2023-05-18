<script setup lang="ts">
import { getFormColumns } from '@/lib/columns'

const columnSetting = {
  passowrd: {
    label: '密碼',
    filter: {
      default: null,
      validate: ['password'],
      required: true
    }
  },
  phone: {
    label: '手機',
    filter: {
      default: null,
      validate: ['phone'],
      required: false
    }
  },
  date: {
    label: '選擇日期',
    filter: {
      default: null,
      required: true
    }
  },
  daterange: {
    label: '選擇日期區間',
    filter: {
      type: 'daterange',
      default: [],
      required: true
    }
  },
  select: {
    label: '選擇框',
    filter: {
      default: null,
      required: true,
      options: [
        { label: 'test1', value: '0' },
        { label: 'test2', value: '1' },
        { label: 'test3', value: '2' }
      ]
    }
  }
}

const {
  columns: filterColumn,
  forms: filterForm,
  reset: resetForm,
  validate: validateForm
} = getFormColumns(columnSetting, 'filter')

const submit = () => {
  validateForm().then(successList => {
    console.log('vee success => ', successList)
  }).catch(errorList => {
    console.log('vee error => ', errorList)
  })
}

</script>

<template>
  <div class="input-test">
    <FormInput
      v-model="filterForm.passowrd"
      v-bind="filterColumn.passowrd"
    />
    <FormInput
      v-model="filterForm.phone"
      v-bind="filterColumn.phone"
    />

    <FormDatePicker
      v-model="filterForm.date"
      v-bind="filterColumn.date"
    />

    <FormDatePicker
      v-model="filterForm.daterange"
      v-bind="filterColumn.daterange"
    />

    <FormSelect
      v-model="filterForm.select"
      v-bind="filterColumn.select"
    />

    <CustomButton
      label="重置"
      class="i-mb-md"
      @click="resetForm"
    />

    <CustomButton
      label="提交"
      @click="submit"
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