<script setup lang="ts">
import { inject } from 'vue'

import type { UseHook } from '@/declare/hook.ts'
import { useFormSetting } from '@/lib/lib_columns.ts'
import { scrollToEl } from '@/lib/lib_utils.ts'
import { CustomInput } from '@/components'

import type { TableData } from '../api'
import { createData } from '../api'
import { columnSetting } from '../columns'

const useHook: UseHook = inject('useHook')
const { loading } = useHook()

const {
  columns: formColumn,
  forms: form,
  // reset: resetForm,
  validate: validateForm
} = useFormSetting<TableData>(columnSetting, 'form')

const submit = async () => {
  loading(true, '新增資料中')

  return await validateForm()
    .then(async () => {
      const { data, status } = await createData(form)
      loading(false)

      return { data, status }
    })
    .catch(errorList => {
      loading(false)
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

defineExpose({
  submit
})
</script>

<template>
  <div class="create grid-row">
    <CustomInput
      class="grid-col-xs-24 grid-col-md-12 grid-col-lg-8"
      v-model="form.no"
      v-bind="formColumn.no"
    />

    <CustomInput
      class="grid-col-xs-24 grid-col-md-12 grid-col-lg-8"
      v-model="form.name"
      v-bind="formColumn.name"
    />

    <CustomInput
      class="grid-col-xs-24 grid-col-md-12 grid-col-lg-8"
      v-model="form.location"
      v-bind="formColumn.location"
    />

    <CustomInput
      class="grid-col-xs-24 grid-col-md-12 grid-col-lg-8"
      v-model="form.statusRemarks"
      v-bind="formColumn.statusRemarks"
    />

    <CustomInput
      class="grid-col-xs-24 grid-col-md-12 grid-col-lg-8"
      v-model="form.leadTime"
      v-bind="formColumn.leadTime"
    />

    <CustomInput
      class="grid-col-xs-24 grid-col-md-12 grid-col-lg-8"
      v-model="form.productionCapacity"
      v-bind="formColumn.productionCapacity"
    />

    <CustomInput
      class="grid-col-xs-24 grid-col-md-12 grid-col-lg-8"
      v-model="form.groupName"
      v-bind="formColumn.groupName"
    />
  </div>
</template>

<style lang="scss" scoped>
.create {
  width: 100%;
  height: fit-content;
  padding: 16px;
}
</style>
