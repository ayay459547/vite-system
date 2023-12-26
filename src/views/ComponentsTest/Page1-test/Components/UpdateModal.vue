<script setup lang="ts">
import { getFormSetting } from '@/lib/lib_columns'
import { scrollToEl } from '@/lib/lib_utils'
import { CustomInput } from '@/components'
import { onMounted } from 'vue'

import type { TableData } from '../api'
import { updateData } from '../api'
import { columnSetting } from '../columns'


const {
  columns: formrColumn,
  forms: form,
  // reset: resetForm,
  validate: validateForm
} = getFormSetting<TableData>(columnSetting, 'form')

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

onMounted(() => {
  const {
    name = null,
    date = null,
    address = null
  } = props.data

  form.name = name
  form.date = date
  form.address = address
})

const submit = async () => {
  const res = await validateForm().then(async () => {
    const { data, status } = await updateData(form)

    return { data, status }
  }).catch(errorList => {
    const error = errorList.find(errorItem => {
      return errorItem.el !== null
    })
    if (error) {
      const el = error.getDom()
      scrollToEl(el)
    }

    return { data: null, status: 'error' }
  })
  return res
}

defineExpose({
  submit
})
</script>

<template>
  <div class="update grid-row">
    <CustomInput
      class="grid-col-xs-24 grid-col-md-12"
      v-model="form.name"
      v-bind="formrColumn.name"
    />
    <CustomInput
      class="grid-col-xs-24 grid-col-md-12"
      v-model="form.date"
      v-bind="formrColumn.date"
    />

    <CustomInput
      class="grid-col-md-24"
      v-model="form.address"
      v-bind="formrColumn.address"
    />
  </div>
</template>

<style lang="scss" scoped>
.update {
  width: 100%;
  height: fit-content;
  padding: 16px;
}
</style>../columns