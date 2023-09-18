<script setup lang="ts">
import {
  CustomTable,
  CustomInput,
  CustomIcon
} from '@/components'
import { getTableSetting, getFormSetting } from '@/lib/lib_columns'
import { ref, onMounted, nextTick } from 'vue'
import type { TableData } from './api'
import { getData, getDataCount, getOptions } from './api'
import { columnSetting } from './columns'

import FilterView from './FilterView.vue'

const tableData = ref<TableData[]>([])
const tableDataCount = ref(0)

const tableOptions = {
  title: '功能列表',
  version: '1.0.4',
  settingKey: 'feature-list'
}
const { tableSetting, downloadExcel, getParams } = getTableSetting(columnSetting, 'table', tableOptions)

const download = () => {
  downloadExcel(tableData.value.map(item => {
    return {
      ...item,
      status: columnSetting.status.getValue(item.status)
    }
  }))
}

// filter
const {
  columns: filterColumn,
  forms: filter,
  ableds: fitlerAbleds,
  reset: filterReset
} = getFormSetting<TableData>(columnSetting, 'filter')

const isLoading = ref(false)

const table = ref()
const modeOptions = ref()

const init = async () => {
  isLoading.value = true
  await nextTick()

  tableData.value = getData({
    ...filter,
    ...getParams(table.value)
  })

  tableDataCount.value = getDataCount({ ...filter })

  modeOptions.value = getOptions()

  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

onMounted(() => {
  init()
})

</script>

<template>
  <div v-i-loading="isLoading" class="table-test">
    <div class="flex-row content-end">
      <FilterView
        v-model:forms="filter"
        :columns="filterColumn"
        :ableds="fitlerAbleds"
        @reset="filterReset()"
        @submit="init()"
      />
    </div>

    <div class="table-main">
      <CustomTable
        ref="table"
        :table-data="tableData"
        :table-data-count="tableDataCount"
        v-bind="tableSetting"
        show-no
        @excel="download"
        @show-change="init()"
      >
        <template #header-all="{ prop }">
          <CustomInput
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
            @change="init()"
          />
        </template>
        <template #header-status="{ prop }">
          <CustomInput
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
            @change="init()"
          />
        </template>
        <template #header-startDate="{ column }">
          <div class="flex-column-center align-start fill-y">{{ column.label }}</div>
        </template>
        <template #header-completedDate="{ column }">
          <div class="flex-column-center align-start fill-y">{{ column.label }}</div>
        </template>
        <template #header-mode="{ prop }">
          <CustomInput
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
            :options="modeOptions"
            @change="init()"
          />
        </template>
        <template #column-status="{ prop, data }">
          <div class="flex-row i-ga-sm" :class="columnSetting[prop].getClass(data)">
            <CustomIcon :name="columnSetting[prop].getIcon(data)"/>
            <span>{{ columnSetting[prop].getValue(data) }}</span>
          </div>
        </template>
        <template #column-path="{ data }">
          <RouterLink
            :to="`${data}`"
            v-slot="{ navigate }"
          >
          <div class="flex-row i-ga-sm text-primary" @click="navigate">
            <CustomIcon name="up-right-from-square"/>
            <span>{{ data }}</span>
          </div>
          </RouterLink>
        </template>
      </CustomTable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  &-test {
    width: 100%;
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  &-main {
    flex: 1;
    width: 100%;
  }
}
</style>