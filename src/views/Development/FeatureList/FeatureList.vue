<script setup lang="ts">
import { CustomTable, CustomInput, CustomSelect, CustomIcon } from '@/components'
import { getTableSetting, getFormSetting } from '@/lib/lib_columns'
import { ref, onMounted } from 'vue'
import type { TableData } from './api'
import { getData, getDataCount, getOptions } from './api'
import { columnSetting } from './columns'

const tableData = ref<TableData[]>([])
const tableDataCount = ref(0)

const tableOptions = {
  title: '功能列表',
  version: '1.0.2',
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
  forms: filter
} = getFormSetting<TableData>(columnSetting, 'filter')

const isLoading = ref(false)

const table = ref()
const modeOptions = ref()

const init = () => {
  isLoading.value = true

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
    <div class="table-main">
      <CustomTable
        ref="table"
        :table-data="tableData"
        :table-data-count="tableDataCount"
        v-bind="tableSetting"
        @excel="download"
        @show-change="init()"
      >
        <template #header-all="{ prop }">
          <CustomInput
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
            direction="row"
            @change="init()"
          />
        </template>
        <template #header-status="{ prop }">
          <CustomSelect
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
            direction="row"
            @change="init()"
          />
        </template>
        <template #header-mode="{ prop }">
          <CustomSelect
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
            :options="modeOptions"
            direction="row"
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
    padding: 32px;
    display: flex;
    flex-direction: column;
  }
  &-main {
    flex: 1;
    width: 100%;
  }
}
</style>