<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import { inject } from 'vue'
import { getFormSetting } from '@/lib/lib_columns'
import { scrollToEl } from '@/lib/lib_utils'
import { CustomInput } from '@/components'
import { onMounted } from 'vue'

import type { TableData } from '../api'
import { updateData } from '../api'
import { columnSetting } from '../columns'

const hook: Hook = inject('hook')
const { loading } = hook()

const {
  columns: formColumn,
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
    machineNo = null,
    machineName = null,
    machineLocation = null,
    machineStatusRemarks = null,
    leadTime = null,
    productionCapacity = null,
    groupName = null
  } = props.data

  form.machineNo = machineNo
  form.machineName = machineName
  form.machineLocation = machineLocation
  form.machineStatusRemarks = machineStatusRemarks
  form.leadTime = leadTime
  form.productionCapacity = productionCapacity
  form.groupName = groupName
})

const submit = async () => {
  loading(true, '新增資料中')

  return await validateForm().then(async () => {
    const { data, status } = await updateData(form)
    loading(false)

    return { data, status }
  }).catch(errorList => {
    loading(false)
    const el = errorList[0].getDom()
    scrollToEl(el)

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
      v-model="form.machineNo"
      v-bind="formColumn.machineNo"
    />

    <CustomInput
      class="grid-col-xs-24 grid-col-md-12 grid-col-lg-8"
      v-model="form.machineName"
      v-bind="formColumn.machineName"
    />

    <CustomInput
      class="grid-col-xs-24 grid-col-md-12 grid-col-lg-8"
      v-model="form.machineLocation"
      v-bind="formColumn.machineLocation"
    />

    <CustomInput
      class="grid-col-xs-24 grid-col-md-12 grid-col-lg-8"
      v-model="form.machineStatusRemarks"
      v-bind="formColumn.machineStatusRemarks"
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