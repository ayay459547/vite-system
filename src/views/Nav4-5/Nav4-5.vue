<script setup lang="ts">
import { ref } from 'vue'

import { CustomButton, CustomDivider, CustomTree, CustomTreeV2 } from '@/components/feature'
import {
  FormSelectV2,
  // CustomSearch
  CustomInput
} from '@/components/input'
import { useFormSetting } from '@/lib/lib_columns'
import { scrollToEl } from '@/lib/lib_utils' // 工具

import { initials, treeData, treeV2Data } from './fakeData'
import { columnSetting } from './columns'

const value = ref([])
const options = Array.from({ length: 10 }).map((_, idx) => {
  const label = idx + 1
  return {
    value: `Group ${label}`,
    label: `Group ${label}`,
    options: Array.from({ length: 10 }).map((_, idx) => ({
      value: `Option ${idx + 1 + 10 * label}`,
      label: `${initials[idx % 10]}${idx + 1 + 10 * label}`
    }))
  }
})

interface Form {
  select?: string
  selectV2?: string
}

const {
  columns: formColumn,
  forms: form,
  reset: resetForm,
  validate: validateForm
} = useFormSetting<Form>(columnSetting, 'filter')

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

// tree
const propsTree = {
  children: 'children',
  label: 'label'
}

const propsTreeV2 = {
  value: 'id',
  label: 'label',
  children: 'children'
}
</script>

<template>
  <div class="page">
    <div class="w-240">
      <FormSelectV2
        v-model="value"
        filterable
        :options="options"
        placeholder="Please select"
        multiple
      />
    </div>

    <div class="w-240">
      <CustomInput v-model="form.selectV2" v-bind="formColumn.selectV2" />
    </div>
    <!-- <div class="w-240">
      <CustomSearch v-model="form.selectV2" v-bind="formColumn.selectV2" />
    </div> -->

    <div class="w-240">
      <CustomInput v-model="form.select" v-bind="formColumn.select" />
    </div>
    <!-- <div class="w-240">
      <CustomSearch v-model="form.select" v-bind="formColumn.select" />
    </div> -->

    <div class="input-btn">
      <CustomButton label="重置" class="i-mb-md" @click="resetForm" />

      <CustomButton label="提交" @click="submit" />
    </div>

    <CustomDivider />

    <CustomTree style="max-width: 600px" :data="treeData" :props="propsTree" />

    <CustomDivider />

    <CustomTreeV2
      style="max-width: 600px"
      :data="treeV2Data"
      :height="208"
      :props="propsTreeV2"
      show-checkbox
    />
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100px;
  padding: 16px;

  .w-240 {
    width: 240px;
    margin-bottom: 16px;
  }
}
</style>
