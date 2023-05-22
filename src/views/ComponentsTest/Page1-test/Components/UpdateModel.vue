<script setup lang="ts">
import { getFormSetting } from '@/lib/columns'
import { scrollToEl } from '@/lib/utils'
import {
  FormInput,
  FormDatePicker,
  FormSelect
} from '@/components'
import { columnSetting } from '../column'
import { onBeforeMount } from 'vue'

const {
  columns: filterColumn,
  forms: filterForm,
  // reset: resetForm,
  validate: validateForm
} = getFormSetting(columnSetting, 'filter')

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

onBeforeMount(() => {
  const {
    name = null,
    date = null,
    address = null
  } = props.data

  filterForm.name = name
  filterForm.date = date
  filterForm.address = address
})

const submit = async () => {
  const res = await validateForm().then(successList => {
    console.log('vee success => ', successList)

    return 'success'
  }).catch(errorList => {
    console.log('vee error => ', errorList)

    const el = errorList[0].getDom()
    scrollToEl(el)
    return 'error'
  })
  return res
}

defineExpose({
  submit
})
</script>

<template>
  <div class="update grid-row">
    <FormInput
      class="grid-col-xs-24 grid-col-md-12"
      v-model="filterForm.name"
      v-bind="filterColumn.name"
    />
    <FormDatePicker
      class="grid-col-xs-24 grid-col-md-12"
      v-model="filterForm.date"
      v-bind="filterColumn.date"
    />

    <FormSelect
      class="grid-col-md-24"
      v-model="filterForm.address"
      v-bind="filterColumn.address"
    />
  </div>
</template>

<style lang="scss" scoped>
.update {
  width: 100%;
  height: fit-content;
}
</style>