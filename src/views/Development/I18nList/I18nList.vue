<script setup lang="ts">
import { CustomTable, CustomInput } from '@/components'
import { getTableSetting, getFormSetting } from '@/lib/lib_columns'
import { ref, reactive, onMounted } from 'vue'
import { langMap } from '@/i18n'

type TableData = {
  key: string
  zhTw: string
  zhCn: string
  en: string
}

const columnSetting = {
  key: {
    label: '翻譯key值',
    table: {
      minWidth: 200
    },
    filter: {
      default: null
    }
  },
  zhTw: {
    label: '繁體中文',
    table: {
      minWidth: 200
    },
    filter: {
      default: null
    }
  },
  zhCn: {
    label: '簡體中文',
    table: {
      minWidth: 200
    },
    filter: {
      default: null
    }
  },
  en: {
    label: '英文',
    table: {
      minWidth: 200
    },
    filter: {
      default: null
    }
  }
}

const tempData = reactive<TableData[]>([])

const tableData = ref<TableData[]>([])

const tableOptions = {
  title: '翻譯值列表',
  version: '1.0.0',
  settingKey: 'i18n-list'
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
  if (tempData.length > 0) {
    tempData.splice(0)
  }

  (langMap as any).$forEach((lang: {
    zhTw: string
    zhCn: string
    en: string
  }, key: string) => {
    const { zhTw, zhCn, en } = lang

    tempData.push({ key, zhTw, zhCn, en })
  })

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