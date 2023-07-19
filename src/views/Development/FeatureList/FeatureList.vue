<script setup lang="ts">
import { CustomTable, CustomInput } from '@/components'
import { getTableSetting } from '@/lib/columns'
import { ref, reactive, onMounted } from 'vue'

import type { Navigation } from '@/declare/routes'
import { refactorRoutes } from '@/lib/routes'
import routes from '@/router/routes'

const columnSetting = {
  title: {
    label: '名稱',
    table: {
      width: 200
    },
    filter: {
      default: null
    }
  },
  path: {
    label: '路由',
    table: {
      width: 200
    },
    filter: {
      default: null
    }
  },
  breadcrumbTitle: {
    label: '路徑',
    table: {
      minWidth: 300
    }
  }
}

const tempData = reactive([])
const tableData = ref([])

const tableOptions = {
  title: '功能列表',
  version: '1.0.0',
  settingKey: 'feature-list'
}
const { tableSetting, downloadExcel } = getTableSetting(columnSetting, 'table', tableOptions)

const download = () => {
  downloadExcel(tableData.value)
}

const filterName = ref('')

onMounted(() => {
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
        ...nextNode,
        breadcrumbTitle: nextNode.breadcrumbTitle.join(' / ')
      })
    }

    return {
      refactorNode: nextNode,
      isShow: true
    }
  }, routes)

  tableData.value = tempData
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
        <template #header-title="{ column }">
          <CustomInput
            v-model="filterName"
            direction="row"
            :label="column.label"
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