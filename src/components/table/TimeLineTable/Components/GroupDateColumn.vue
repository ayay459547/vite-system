<script setup lang="ts">
import type { PropType } from 'vue'
import { inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import { VxeColgroup, VxeColumn } from '@/components'
import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

const props = defineProps({
  groupDateColumns: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '日期欄位群組資料'
  },
  dateColumns: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
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

const useHook: UseHook = inject('useHook')
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
    />
    <template v-else>
      <VxeColumn
        v-for="column in props.dateColumns"
        :key="column.key"
        :field="`${groupDateColumn.key}-${column.key}`"
        :width="column?.width ?? props.baseWidth"
        :min-width="column?.minWidth ?? props.baseWidth"
        :title="i18nTranslate(column?.i18nLabel ?? column.label)"
      ></VxeColumn>
    </template>
  </VxeColgroup>
</template>

<style lang="scss">
// div[class*="__TimeLineTable"] {
//   tr[class*="vxe-header"] {
//     th.time-line-group-date {
//       position: relative;
//       vertical-align: middle;
//     }

//     div.vxe-cell {
//       position: sticky;
//       left: 12px;
//       top: 0px;
//     }
//   }
// }
</style>
