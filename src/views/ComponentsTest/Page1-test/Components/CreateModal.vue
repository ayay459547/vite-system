<script setup lang="ts">
import { useFormSetting } from '@/lib/lib_columns'
import { scrollToEl } from '@/lib/lib_utils'
import { CustomInput } from '@/components'

import type { TableData } from '../api'
import { createData } from '../api'
import { columnSetting } from '../columns'

const {
  columns: formColumn,
  forms: form,
  // reset: resetForm,
  validate: validateForm
} = useFormSetting<TableData>(columnSetting, 'form')

defineExpose({
  submit: async () => {
    return await validateForm()
      .then(async () => {
        const { data, status } = await createData(form)

        return { data, status }
      })
      .catch(errorList => {
        const error = errorList.find(errorItem => {
          return errorItem.el !== null
        })
        if (error) {
          const el = error.getDom()
          scrollToEl(el)
        }

        return { data: null, status: 'error' }
      })
  }
})
</script>

<template>
  <div class="create grid-row">
    <CustomInput
      class="grid-col-xs-24 grid-col-md-12"
      v-model="form.name"
      v-bind="formColumn.name"
    />

    <CustomInput
      class="grid-col-xs-24 grid-col-md-12"
      v-model="form.date"
      v-bind="formColumn.date"
    />

    <CustomInput class="grid-col-xs-24" v-model="form.address" v-bind="formColumn.address" />
  </div>
</template>

<style lang="scss" scoped>
.create {
  width: 100%;
  height: fit-content;
  padding: 16px;
}
</style>
../columns
