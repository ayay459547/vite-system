<script setup lang="ts">
import { getFormSetting } from '@/lib/columns'
import { scrollToEl } from '@/lib/utils'
import {
  FormInput,
  FormDatePicker,
  FormSelect,
  FormCheckbox,
  FormRadio,
  CustomButton
} from '@/components'

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
  },
  checkbox: {
    label: '多選',
    filter: {
      default: [],
      required: true,
      options: [
        { label: 'checkbox1', value: 0 },
        { label: 'checkbox2', value: 1 },
        { label: 'checkbox3', value: 2 },
        { label: 'checkbox4', value: 3 }
      ]
    }
  },
  radio: {
    label: '單選',
    filter: {
      default: null,
      required: true,
      options: [
        { label: 'radio1', value: 0 },
        { label: 'radio2', value: 1 },
        { label: 'radio3', value: 2 }
      ]
    }
  }
}

interface Form {
  passowrd?: string
  phone?: string
  date?: string
  daterange?: [string, string]
  select?: string
  checkbox?: []
  radio?: number
}

const {
  columns: formColumn,
  forms: form,
  reset: resetForm,
  validate: validateForm
} = getFormSetting<Form>(columnSetting, 'filter')

const submit = () => {
  validateForm().then(successList => {
    console.log('vee success => ', successList)
  }).catch(errorList => {
    console.log('vee error => ', errorList)
    const el = errorList[0].getDom()
    scrollToEl(el)
  })
}

</script>

<template>
  <div class="input-test">
    <FormInput
      v-model="form.passowrd"
      v-bind="formColumn.passowrd"
    />

    <FormInput
      v-model="form.phone"
      v-bind="formColumn.phone"
    />

    <FormSelect
      v-model="form.select"
      v-bind="formColumn.select"
    />

    <FormDatePicker
      v-model="form.date"
      v-bind="formColumn.date"
    />

    <FormDatePicker
      v-model="form.daterange"
      v-bind="formColumn.daterange"
    />

    <FormCheckbox
      v-model="form.checkbox"
      v-bind="formColumn.checkbox"
    />

    <FormRadio
      v-model="form.radio"
      v-bind="formColumn.radio"
    />

    <div class="input-btn">
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
  </div>
</template>

<style lang="scss" scoped>
.input {
  &-test {
    width: 100%;
    height: 100%;
    padding: 32px;
  }

  &-btn {
    display: flex;
    gap: 8px;
  }
}
</style>