<script setup lang="ts">
import { CustomTable, CustomInput } from '@/components'
import { getTableSetting, getFormSetting } from '@/lib/lib_columns'
import { ref, reactive, onMounted } from 'vue'

import type { Navigation } from '@/declare/routes'
import { refactorRoutes } from '@/lib/lib_routes'
import routes from '@/router/routes'

type TableData = {
  title: string
  path: string
  breadcrumbTitle: string
}

const columnSetting = {
  title: {
    label: '名稱',
    table: {
      width: 300
    },
    filter: {
      default: null
    }
  },
  path: {
    label: '路由',
    table: {
      width: 300
    },
    filter: {
      default: null
    }
  },
  breadcrumbTitle: {
    label: '路徑',
    table: {
      minWidth: 300
    },
    filter: {
      default: null
    }
  }
}

const tempData = reactive<TableData[]>([])
const tableData = ref<TableData[]>([])

const tableOptions = {
  title: '功能列表',
  version: '1.0.0',
  settingKey: 'feature-list'
}
const { tableSetting, downloadExcel } = getTableSetting(columnSetting, 'table', tableOptions)

const download = () => {
  downloadExcel(tableData.value)
}

// filter
const {
  columns: filterColumn,
  forms: filter
} = getFormSetting<TableData>(columnSetting, 'filter')

const init = () => {
  refactorRoutes<Navigation>((leafNode, parentsNode) => {
    const nextNode: Navigation = {
      ...leafNode
    }
    if (parentsNode === null) {
      nextNode.breadcrumbName = [leafNode.name]
      nextNode.breadcrumbTitle = [leafNode.title]
    } else{
      nextNode.breadcrumbName = [...parentsNode.breadcrumbName, leafNode.name]
      nextNode.breadcrumbTitle = [...parentsNode.breadcrumbTitle, leafNode.title]
    }

    if (!['', null, undefined].includes(nextNode.path)) {
      tempData.push({
        title: nextNode.title,
        path: nextNode.path,
        breadcrumbTitle: nextNode.breadcrumbTitle.join(' / ')
      })
    }

    return {
      refactorNode: nextNode,
      isShow: true
    }
  }, routes)

  tableData.value = tempData
}

onMounted(() => {
  init()
})

</script>

<template>
  <div class="table-test">
    <div class="table-main">
      <CustomTable
        :table-data="tableData"
        :table-data-count="tableData.length"
        v-bind="tableSetting"
        @excel="download"
      >
        <template #header-all="{ prop }">
          <CustomInput
            v-model="filter[prop]"
            v-bind="filterColumn[prop]"
            direction="row"
            @change="init()"
          />
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