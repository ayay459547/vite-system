<script setup lang="ts">
import type { PropType } from 'vue'
// import { ref } from 'vue'
import 'vxe-table/styles/cssvar.scss'
import 'vxe-pc-ui/styles/cssvar.scss'

import {
  VxeUI,
  VxeTooltip
} from 'vxe-pc-ui'

import {
  VXETable,
  VxeTable,
  VxeColumn,
  VxeColgroup
} from 'vxe-table'
import { ElAutoResizer } from 'element-plus'

import zhTW from 'vxe-table/lib/locale/lang/zh-TW'
// import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
// import enUS from 'vxe-table/lib/locale/lang/en-US'

// import zhHK from 'vxe-table/lib/locale/lang/zh-HK'
// import zhMO from 'vxe-table/lib/locale/lang/zh-MO'
// import jaJP from 'vxe-table/lib/locale/lang/ja-JP'
// import esES from 'vxe-table/lib/locale/lang/es-ES'
// import ptBR from 'vxe-table/lib/locale/lang/pt-BR'

VXETable.setI18n('zh-TW', zhTW)
// VXETable.setI18n('zh-CN', zhCN)
// VXETable.setI18n('en', enUS)

VXETable.setLanguage('zh-TW')

VxeUI.component(VxeTooltip)

const props = defineProps({
  tableData: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '表格資料'
  },
  footerData: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '表尾資料'
  },
  tableColumns: {
    type: Object as PropType<any[]>,
    required: false,
    default: () => {
      return {}
    },
    description: '表格欄位顯示用設定'
  },
  groupColumns: {
    type: Object as PropType<any[]>,
    required: false,
    default: () => {
      return {}
    },
    description: '表格欄位顯示用設定'
  },
  totalColumns: {
    type: Object as PropType<any[]>,
    required: false,
    default: () => {
      return {}
    },
    description: '表格欄位顯示用設定'
  }
})


</script>

<template>
  <div class="i-page">
    <ElAutoResizer>
      <template #default="{ height }">
        <VxeTable
          show-overflow
          show-header-overflow
          show-footer-overflow
          show-footer
          :border="true"
          stripe
          :height="height ?? 0"
          :max-height="9999"
          :data="props.tableData"
          :row-config="{isCurrent: true, isHover: true}"
          :column-config="{resizable: true}"
          :scroll-y="{enabled: true, gt: 0}"
          :scroll-x="{enabled: true, gt: 0}"
          :footer-data="props.footerData"
        >
          <!-- <VxeColgroup title="分组1">
            <VxeColumn field="name" title="Name" width="120"></VxeColumn>
            <VxeColumn field="role" title="Role" width="120"></VxeColumn>
          </VxeColgroup> -->

          <!-- <VxeColgroup title="分组2">
            <VxeColgroup title="分组3">
              <VxeColumn field="name3" title="Name" width="120"></VxeColumn>
              <VxeColumn field="role3" title="Role" width="120"></VxeColumn>
            </VxeColgroup>
            <VxeColumn field="name2" title="Name" width="120"></VxeColumn>
            <VxeColumn field="role2" title="Role" width="120"></VxeColumn>
          </VxeColgroup> -->

          <VxeColumn
            v-for="column in props.tableColumns"
            :key="column.key"
            :field="column.key"
            :width="column.width"
            :title="column.title"
            :fixed="column.fixed"
          ></VxeColumn>

          <!-- groupColumns -->
          <VxeColgroup
            v-for="monthColumn in groupColumns"
            :key="monthColumn.key"
            :title="monthColumn.title"
          >
            <VxeColgroup
              v-for="weekColumn in monthColumn.columns"
              :key="weekColumn.key"
              :title="weekColumn.title"
            >
              <VxeColumn
                v-for="dateColumn in weekColumn.columns"
                :key="dateColumn.key"
                :field="dateColumn.field"
                :title="dateColumn.title"
                :width="dateColumn.width"
              ></VxeColumn>
            </VxeColgroup>
          </VxeColgroup>

          <VxeColumn
            v-for="column in props.totalColumns"
            :key="column.key"
            :field="column.key"
            :width="column.width"
            :title="column.title"
          ></VxeColumn>
        </VxeTable>
      </template>
    </ElAutoResizer>
  </div>
</template>

<style>
</style>
