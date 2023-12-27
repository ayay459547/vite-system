<script setup lang="ts">
import { ref } from 'vue'

import { CustomSearch, CustomDrawer, CustomButton, GroupSearch } from '@/components'
import { getFormSetting } from '@/lib/lib_columns'

type Form = {
  text: string
  select: string
  date: string
}
const columnSetting = {
  text: {
    label: 'text測試',
    filter: {
      type: 'text',
      default: '777'
    }
  },
  select: {
    label: 'select測試',
    filter: {
      type: 'select',
      default: 'select-2',
      options: [
        { label: 'select-1', value: 'select-1' },
        { label: 'select-2', value: 'select-2' },
        { label: 'select-3', value: 'select-3' }
      ]
    }
  },
  date: {
    label: 'date測試',
    filter: {
      type: 'date',
      default: '2022-05-05'
    }
  }
}

const {
  columns,
  forms,
  activeForms,
  reset,
  getActiveForms
} = getFormSetting<Form>(columnSetting, 'filter')

const isShow = ref(false)

const get = () => {
  const data = getActiveForms(true)
  console.log(data)
}

</script>

<template>
  <div class="page">
    <GroupSearch
      :columns="columns"
      class="grid-row"
      @reset="reset"
      @submit="get"
    >
      <template #search-all="{ prop, column }">
        <CustomSearch
          class="grid-col-xs-8"
          v-model="forms[prop]"
          v-model:active="activeForms[prop]"
          v-bind="column"
        />
      </template>
    </GroupSearch>

    <div class="flex-row i-ga-lg">
      <div style="flex: 2" class="flex-column i-ga-md">
        <CustomSearch
          v-model="forms.text"
          v-bind="columns.text"
          v-model:active="activeForms.text"
        />
        <CustomSearch
          v-model="forms.select"
          v-bind="columns.select"
          v-model:active="activeForms.select"
        />
        <CustomSearch
          v-model="forms.date"
          v-bind="columns.date"
          v-model:active="activeForms.date"
        />
        <CustomButton label="重置" @click="reset"/>
        <CustomButton label="取值" @click="get"/>
        <CustomButton label="測試Drawer" @click="isShow = true"/>
      </div>

      <div style="flex: 1" class="flex-column i-ga-md">
        <CustomSearch
          v-model="forms.text"
          v-bind="columns.text"
          search
          v-model:active="activeForms.text"
        />
        <CustomSearch
          v-model="forms.select"
          v-bind="columns.select"
          search
          v-model:active="activeForms.select"
        />
        <CustomSearch
          v-model="forms.date"
          v-bind="columns.date"
          search
          v-model:active="activeForms.date"
        />
        <CustomButton label="重置" @click="reset"/>
        <CustomButton label="取值" @click="get"/>
        <CustomButton label="測試Drawer" @click="isShow = true"/>
      </div>
    </div>

    <CustomDrawer
      v-model="isShow"
      title="title"
      direction="rtl"
    >
      <span>Hi there!----------</span>
    </CustomDrawer>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
</style>

