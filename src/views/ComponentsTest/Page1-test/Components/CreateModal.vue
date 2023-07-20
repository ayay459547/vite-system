<script setup lang="ts">
import { getFormSetting } from '@/lib/lib_columns'
import { scrollToEl } from '@/lib/lib_utils'
import {
  FormInput,
  FormDatePicker,
  FormSelect
} from '@/components'

import type { TableData } from '../api'
import { createData } from '../api'
import { columnSetting } from '../columns'

const {
  columns: formColumn,
  forms: form,
  // reset: resetForm,
  validate: validateForm
} = getFormSetting<TableData>(columnSetting, 'form')

defineExpose({
  submit: async () => {
    return await validateForm().then(async () => {
      const { data, status } = await createData(form)

      return { data, status }
    }).catch(errorList => {
      const el = errorList[0].getDom()
      scrollToEl(el)

      return { data: null, status: 'error' }
    })
  }
})
</script>

<template>
  <div class="create grid-row">
    <FormInput
      class="grid-col-xs-24 grid-col-md-12"
      v-model="form.name"
      v-bind="formColumn.name"
    />

    <FormDatePicker
      class="grid-col-xs-24 grid-col-md-12"
      v-model="form.date"
      v-bind="formColumn.date"
    />

    <FormSelect
      class="grid-col-xs-24"
      v-model="form.address"
      v-bind="formColumn.address"
    />
  </div>
</template>

<style lang="scss" scoped>
.create {
  width: 100%;
  height: fit-content;
  padding: 16px;
}
</style>../columns