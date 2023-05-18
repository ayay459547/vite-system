<script setup lang="ts">
import { getFormColumns } from '@/lib/columns'

const columnSetting = {
  passowrd: {
    label: '密碼',
    fitler: {
      default: '',
      direction: 'row',
      validate: ['password'],
      required: true
    }
  },
  phone: {
    label: '手機',
    fitler: {
      default: '',
      direction: 'row',
      validate: ['phone'],
      required: false
    }
  },
  passowrd2: {
    label: '密碼',
    fitler: {
      default: '',
      validate: ['password'],
      required: true
    }
  },
  phone2: {
    label: '手機',
    fitler: {
      default: '',
      validate: ['phone'],
      required: false
    }
  },
  select: {
    label: '選擇框',
    fitler: {
      default: '',
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
} = getFormColumns(columnSetting, 'fitler')

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

    <FormInput
      v-model="filterForm.passowrd2"
      v-bind="filterColumn.passowrd2"
    />
    <FormInput
      v-model="filterForm.phone2"
      v-bind="filterColumn.phone2"
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