<script setup lang="ts">
import { FormList, FormInput } from '@/components'
import { columnSetting } from './columns'
import { getFormListSetting } from '@/lib/lib_columns'
import { reactive } from 'vue'
import { scrollToEl, getUuid } from '@/lib/lib_utils'

const testData = reactive<Form[]>([
  { name: 'Tom', date: '', age: '12', address: 'address1' },
  { name: '', date: '', age: '65', address: 'address2' },
  { name: '', date: '', age: '42', address: 'address3' },
  { name: '', date: '', age: '23', address: 'address4' }
])

interface Form {
  key?: string
  name?: string
  date?: string
  age?: string
  address?: string
}

const {
  defaultValue,
  columns: formColumn,
  forms: formList,
  validate: validateForm
} = getFormListSetting<Form>(columnSetting, 'form', testData)

const add = () => {
  formList.push({
    key: getUuid(),
    ...defaultValue
  })
}

const remove = (rowIndex: number) => {
  formList.splice(rowIndex, 1)
}

const submit = () => {
  validateForm().then(successList => {
    console.log('vee success => ', successList)
  }).catch(errorList => {
    console.log('vee error => ', errorList)
    const el = errorList[0].getDom()
    scrollToEl(el)
  })
}

</script>

<template>
  <div class="container">
    <FormList
      :table-data="formList"
      :column-setting="columnSetting"
      @add="add"
      @remove="remove"
    >
      <template #header-all="{ column }">
        <div class="text-danger i-pr-xs">*</div>
        <div>{{ column.label }}</div>
      </template>

      <template #column-name="{ rowIndex }">
        <FormInput
          v-model="formList[rowIndex].name"
          v-bind="formColumn.name"
        ></FormInput>
      </template>
      <template #column-date="{ rowIndex }">
        <FormInput
          v-model="formList[rowIndex].date"
          v-bind="formColumn.date"
        ></FormInput>
      </template>
      <template #column-age="{ rowIndex }">
        <FormInput
          v-model="formList[rowIndex].age"
          v-bind="formColumn.age"
        ></FormInput>
      </template>
      <template #column-address="{ rowIndex }">
        <FormInput
          v-model="formList[rowIndex].address"
          v-bind="formColumn.address"
        ></FormInput>
      </template>
    </FormList>

    <CustomButton
      type="primary"
      :label="'submit'"
      icon-name="plus"
      icon-move="rotate"
      @click="submit"
    />
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 32px;
}
.test {
  width: 100%;
  height: 500px;
}
</style>