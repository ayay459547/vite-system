<script setup lang="ts">
import {
  CustomSearch,
  CustomDrawer,
  CustomButton,
  CustomInput,
  GroupSearch
} from '@/components'
import { onMounted, ref } from 'vue'
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
  ableds,
  reset
} = getFormSetting<Form>(columnSetting, 'filter')

const isShow = ref(false)

</script>

<template>
  <div class="page">
    <GroupSearch
      :columns="columns"
      class="grid-row"
    >
      <template #search-all="{ prop, column }">
        <CustomSearch
          class="grid-col-xs-24 grid-col-md-8"
          v-model="forms[prop]"
          v-bind="column"
        />
      </template>
    </GroupSearch>

    <CustomSearch
      v-model="forms.text"
      v-bind="columns.text"
    />
    <h3>目前資料：{{ forms.text }}</h3>

    <CustomSearch
      v-model="forms.select"
      v-bind="columns.select"
    />
    <h3>目前資料：{{ forms.select }}</h3>

    <CustomSearch
      v-model="forms.date"
      v-bind="columns.date"
    />
    <h3>目前資料：{{ forms.date }}</h3>

    <CustomButton label="重置" @click="reset"/>

    <CustomButton label="測試Drawer" @click="isShow = true"/>

    <CustomDrawer
      v-model="isShow"
      title="title"
      direction="rtl"
    >
      <span>Hi there!</span>
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
