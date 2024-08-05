<script setup lang="ts">
import { reactive } from 'vue'

import { FormList, CustomInput } from '@/components'
import { useFormListSetting } from '@/lib/lib_columns'
import { scrollToEl } from '@/lib/lib_utils'

import { columnSetting } from './columns'

const testData = reactive<Form[]>([
  // { name: 'Tom', date: '', age: '12', address: 'address1' },
  // { name: '', date: '', age: '65', address: 'address2' },
  // { name: '', date: '', age: '42', address: 'address3' },
  // { name: '', date: '', age: '23', address: 'address4' }
])

interface Form {
  columnType?: string
  filterType?: string
  filterValue?: string

  key?: string
  name?: string
  date?: string
  age?: string
  address?: string
}

const {
  // defaultValue,
  columns: formColumn,
  forms: formList,
  validate: validateForm,
  add,
  remove
} = useFormListSetting<Form>(columnSetting, 'form', testData)

const submit = () => {
  validateForm()
    .then(successList => {
      console.log('vee success => ', successList)
    })
    .catch(errorList => {
      console.log('vee error => ', errorList)
      const error = errorList.find(errorItem => {
        return errorItem.el !== null
      })
      if (error) {
        const el = error.getDom()
        scrollToEl(el)
      }
    })
}

const sortList = () => {
  setTimeout(() => {
    formList.value.sort((a, b) => {
      const aAge = a?.age ?? '0'
      const bAge = b?.age ?? '0'
      return parseInt(aAge) - parseInt(bAge)
    })
  }, 1000)
}
</script>

<template>
  <div class="container">
    <div class="test">
      <FormList
        v-model="formList"
        :table-data="formList"
        :column-setting="columnSetting"
        item-key="key"
        is-draggable
        is-create
        is-remove
        @add="add"
        @remove="remove"
      >
        <template #header-all="{ column }">
          <div class="text-danger i-pr-xs">*</div>
          <div>{{ column.label }}</div>
        </template>
        <template #column-columnType="{ rowIndex }">
          <CustomInput
            v-model="formList[rowIndex].columnType"
            v-bind="formColumn.columnType"
          ></CustomInput>
        </template>
        <template #column-filterType="{ rowIndex }">
          <CustomInput
            v-model="formList[rowIndex].filterType"
            v-bind="formColumn.filterType"
          ></CustomInput>
        </template>
        <template #column-filterValue="{ rowIndex }">
          <CustomInput
            v-model="formList[rowIndex].filterValue"
            v-bind="formColumn.filterValue"
            :disabled="[
              'isBlank', 'notBlank', 'isNull', 'notNull'
            ].includes(formList[rowIndex].filterType)"
          ></CustomInput>
        </template>

        <template #column-name="{ rowIndex }">
          <CustomInput v-model="formList[rowIndex].name" v-bind="formColumn.name"></CustomInput>
        </template>
        <template #column-date="{ rowIndex }">
          <CustomInput v-model="formList[rowIndex].date" v-bind="formColumn.date"></CustomInput>
        </template>
        <template #column-age="{ rowIndex }">
          <CustomInput
            v-model="formList[rowIndex].age"
            v-bind="formColumn.age"
            only-number
            @change="sortList"
          ></CustomInput>
        </template>
        <template #column-address="{ rowIndex }">
          <CustomInput
            v-model="formList[rowIndex].address"
            v-bind="formColumn.address"
          ></CustomInput>
        </template>
      </FormList>
    </div>

    <CustomButton
      class="btn"
      type="primary"
      :label="'submit'"
      icon-name="paper-plane"
      @click="submit"
    />
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 32px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  overflow: hidden;
}
.test {
  width: 100%;
  height: calc(100% - 50px);
  padding: 2px;
  flex: 1;
}
.btn {
  height: fit-content;
}
</style>
