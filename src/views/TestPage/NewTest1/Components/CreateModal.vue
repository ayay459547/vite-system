<script setup lang="ts">
import { useFormSetting } from '@/lib/lib_columns'
import { scrollToEl } from '@/lib/lib_utils' // 工具
import { CustomInput } from '@/components/input'

import { type CreateFormData, createData } from './api'
import { columnSetting } from '../columns'

const {
  columns: formColumn,
  forms: form,
  validate: validateForm
} = useFormSetting<CreateFormData>(columnSetting, 'form')

defineExpose({
  submit: async () => {
    return await validateForm()
      .then(async () => {
        const status = await createData(form)

        return status
      })
      .catch(errorList => {
        const error = errorList.find(errorItem => {
          return errorItem.el !== null
        })
        if (error) {
          const el = error.getDom()
          scrollToEl(el)
        }

        return 'error'
      })
  }
})
</script>

<template>
  <div class="modal">
    <div class="grid-row">
      <CustomInput
        class="grid-col-xs-24 grid-col-md-8"
        v-model="form.column1"
        v-bind="formColumn.column1"
      />

      <CustomInput
        class="grid-col-xs-24 grid-col-md-8"
        v-model="form.column2"
        v-bind="formColumn.column2"
      />

      <CustomInput
        class="grid-col-xs-24 grid-col-md-8"
        v-model="form.column3"
        v-bind="formColumn.column3"
      />

      <CustomInput
        class="grid-col-xs-24"
        v-model="form.column4"
        v-bind="formColumn.column4"
      />

      <CustomInput
        class="grid-col-xs-24"
        v-model="form.column5"
        v-bind="formColumn.column5"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  width: 100%;
  height: fit-content;
  min-height: 100%;
  padding: 16px 24px;
}
</style>
