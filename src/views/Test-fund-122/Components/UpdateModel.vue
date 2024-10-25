<script setup lang="ts">
import { onMounted, inject } from 'vue'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { useFormSetting } from '@/lib/lib_columns'
import { scrollToEl } from '@/lib/lib_utils' // 工具
import { CustomInput } from '@/components' // 系統組件

import type { TableData } from '../api'
import { updateData } from '../api'
import { columnSetting } from '../columns'

const useHook: UseHook = inject('useHook')
const { loading } = useHook()

const {
  columns: formColumn,
  forms: form,
  // reset: resetForm,
  validate: validateForm
} = useFormSetting<TableData>(columnSetting, 'form')

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

onMounted(() => {
  const {
    no = null,
    name = null,
    location = null,
    statusRemarks = null,
    leadTime = null,
    productionCapacity = null,
    groupName = null
  } = props.data

  form.no = no
  form.name = name
  form.location = location
  form.statusRemarks = statusRemarks
  form.leadTime = leadTime
  form.productionCapacity = productionCapacity
  form.groupName = groupName
})

const submit = async () => {
  loading(true, '新增資料中')

  return await validateForm()
    .then(async () => {
      const { data, status } = await updateData(form)
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
  <div class="update grid-row">
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
.update {
  width: 100%;
  height: fit-content;
  padding: 16px;
}
</style>
