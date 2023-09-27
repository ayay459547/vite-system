<script setup lang="ts">
import { getFormSetting } from '@/lib/lib_columns'
import { scrollToEl } from '@/lib/lib_utils'
import {
  CustomIcon,
  CustomButton,
  CustomInput
} from '@/components'

import FormInput from './form/FormInput.vue'
import FormSelect from './form/FormSelect.vue'
import FormDatePicker from './form/FormDatePicker.vue'
import FormCheckbox from './form/FormCheckbox.vue'
import FormRadio from './form/FormRadio.vue'

import { ref, onMounted } from 'vue'

const columnSetting = {
  age: {
    label: '年齡',
    filter: {
      type: 'text',
      default: null,
      validate: [],
      required: true,
      // text: true,
      onlyNumber: true
    }
  },
  name: {
    label: '名稱',
    filter: {
      type: 'text',
      default: null,
      validate: [],
      required: true
    }
  },
  passowrd: {
    label: '密碼',
    filter: {
      type: 'password',
      default: null,
      validate: ['password'],
      showPassword: true,
      required: true
    }
  },
  phone: {
    label: '手機',
    filter: {
      type: 'text',
      default: null,
      validate: ['phone'],
      required: false
    }
  },
  ps: {
    label: '備註',
    filter: {
      type: 'textarea',
      default: null,
      validate: [],
      required: false
    }
  },
  date: {
    label: '選擇日期',
    filter: {
      type: 'date',
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
      type: 'select',
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
      type: 'checkbox',
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
      type: 'radio',
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
  name?: string
  passowrd?: string
  phone?: string
  age?: number | string
  ps?: string
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
    console.log(errorList)
    const el = errorList[0].getDom()
    scrollToEl(el)
  })
}

const isLoading = ref(true)

onMounted(() => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false

    console.log(formColumn)
  }, 400)
})

</script>

<template>
  <div v-loading="isLoading" class="input-test">
    <div v-if="!isLoading" class="input-container">
      <!-- 更新架構 -->
      <div class="input-simple">
        <CustomInput
          v-model="form.name"
          v-bind="formColumn.name"
        >
          <template #prefix>
            <CustomIcon name="user"/>
          </template>
        </CustomInput>

        <CustomInput
          v-model="form.age"
          v-bind="formColumn.age"
        >
          <template #prefix>
            <CustomIcon name="user"/>
          </template>
        </CustomInput>

        <CustomInput
          v-model="form.passowrd"
          v-bind="formColumn.passowrd"
        />

        <CustomInput
          v-model="form.phone"
          v-bind="formColumn.phone"
        />

        <CustomInput
          v-model="form.ps"
          v-bind="formColumn.ps"
        />

        <CustomInput
          v-model="form.select"
          v-bind="formColumn.select"
        >
          <template #prefix>
            <CustomIcon name="user"/>
          </template>
        </CustomInput>

        <CustomInput
          v-model="form.date"
          v-bind="formColumn.date"
        />

        <CustomInput
          v-model="form.daterange"
          v-bind="formColumn.daterange"
        />

        <CustomInput
          v-model="form.checkbox"
          v-bind="formColumn.checkbox"
        />

        <CustomInput
          v-model="form.radio"
          v-bind="formColumn.radio"
        />
      </div>

      <!-- 原來架構 -->
      <div class="input-form">
        <!-- <FormInput
          v-model="form.name"
          v-bind="formColumn.name"
        >
          <template #prefix>
            <CustomIcon name="user"/>
          </template>
        </FormInput>

        <FormInput
          v-model="form.age"
          v-bind="formColumn.age"
        >
          <template #prefix>
            <CustomIcon name="user"/>
          </template>
        </FormInput>

        <FormInput
          v-model="form.passowrd"
          v-bind="formColumn.passowrd"
        />

        <FormInput
          v-model="form.phone"
          v-bind="formColumn.phone"
        />

        <FormInput
          v-model="form.ps"
          v-bind="formColumn.ps"
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
        /> -->
      </div>
    </div>

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
    padding: 16px;
  }
  &-container {
    display: flex;
    width: 100%;
    gap: 8px;
  }

  &-simple,
  &-form {
    flex: 1;
    width: 100%;
    height: fit-content;
  }
  &-btn {
    display: flex;
    gap: 8px;
  }
}
</style>