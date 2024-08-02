<script setup lang="ts">
import { type PropType, onMounted } from 'vue'
import { useFormSetting } from '@/lib/lib_columns.ts'
import { scrollToEl } from '@/lib/lib_utils.ts'
import { CustomInput } from '@/components'

import type { TableData } from '../api'
import { type UpdateFormData, updateData } from './api'
import { columnSetting } from '../columns'

const props = defineProps({
  data: {
    type: Object as PropType<TableData>,
    required: false
  }
})

const {
  columns: formColumn,
  forms: form,
  validate: validateForm
} = useFormSetting<UpdateFormData>(columnSetting, 'form')

defineExpose({
  submit: async () => {
    return await validateForm()
      .then(async () => {
        const status = await updateData(form)

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

onMounted(() => {
  const { column1, column2, column3, column4, column5 } = props.data ?? {}

  form.column1 = column1
  form.column2 = column2
  form.column3 = column3
  form.column4 = column4
  form.column5 = column5
})
</script>

<template>
  <div class="modal grid-row">
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

    <CustomInput class="grid-col-xs-24" v-model="form.column4" v-bind="formColumn.column4" />

    <CustomInput class="grid-col-xs-24" v-model="form.column5" v-bind="formColumn.column5" />
  </div>
</template>

<style lang="scss" scoped>
.modal {
  width: 100%;
  height: fit-content;
  padding: 16px 24px;
}
</style>
