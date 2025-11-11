<script setup lang="ts">
import type { PropType } from 'vue'
import { inject } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { VxeColgroup, VxeColumn } from '@/components/table' // 系統組件: 表格
import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'

const props = defineProps({
  groupDateColumns: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => [],
    description: '日期欄位群組資料'
  },
  dateColumns: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => [],
    description: '日期線顯示欄位資料'
  },
  baseWidth: {
    type: Number as PropType<number>,
    required: false,
    default: 80,
    description: '表格欄位基本寬度'
  },
  i18nModule: {
    type: String as PropType<ScopeKey>,
    required: false,
    default: defaultModuleType,
    description: 'i18nModule'
  }
})
// GroupDateColumn

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: props.i18nModule
})

</script>

<template>
  <VxeColgroup
    v-for="groupDateColumn in props.groupDateColumns"
    :key="groupDateColumn.key"
    :title="groupDateColumn.title"
    header-class-name="time-line-group-date"
  >
    <GroupDateColumn
      v-if="Array.isArray(groupDateColumn.columns) && groupDateColumn.columns.length > 0"
      :group-date-columns="groupDateColumn.columns"
      :date-columns="props.dateColumns"
      :base-width="props.baseWidth"
      :i18n-module="props.i18nModule"
    >
      <template #header="scope">
        <slot name="header" v-bind="scope"></slot>
      </template>
      <template #column="scope">
        <slot name="column" v-bind="scope"></slot>
      </template>
    </GroupDateColumn>

    <template v-else>
      <VxeColumn
        v-for="column in props.dateColumns"
        :key="column.key"
        :field="`${groupDateColumn.key}-${column.key}`"
        :width="column?.width ?? props.baseWidth"
        :min-width="column?.minWidth ?? props.baseWidth"
        :title="i18nTranslate(column?.i18nLabel ?? column.label)"
      >
        <template #header="scope">
          <slot
            name="header"
            :scope="scope"
            :column="column"
            :date="groupDateColumn.key"
          ></slot>
        </template>
        <template #default="scope">
          <slot
            name="column"
            :scope="scope"
            :column="column"
            :date="groupDateColumn.key"
          ></slot>
        </template>
      </VxeColumn>
    </template>
  </VxeColgroup>
</template>

<style lang="scss"></style>
