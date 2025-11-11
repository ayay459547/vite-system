<script setup lang="ts">
import type { PropType } from 'vue'
import { inject } from 'vue'
import { ElTableColumn } from 'element-plus'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { getUuid } from '@/lib/lib_utils' // 工具
import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'

import type { Props } from '../BasicTableInfo'

const scopedId = getUuid('__ElTableColumn__')

const props = defineProps({
  i18nModule: {
    type: String as PropType<ScopeKey>,
    required: false,
    default: defaultModuleType,
    description: 'i18nModule'
  },
  showColumns: {
    type: Array as PropType<Props['showColumns']>,
    required: false,
    default: () => [],
    description: '顯示欄位'
  },
  showData: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => [],
    description: '顯示資料'
  },
  parentSlotKey: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '上層的 slotKey'
  }
})

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: props.i18nModule
})

// 是否顯示子欄位
const getIsShowChildrenNode = (column: any) => {
  const isShowChildrenNode = Array.isArray(column.columns) && column.columns.length > 0
  return isShowChildrenNode
}

/**
 * 取得 slot 名稱
 */
const getSlotName = (slotKey: string) => {
  const slotName = [props.parentSlotKey, slotKey].filter(item => {
    return ![undefined, null, ''].includes(item)
  }).join('-')
  return slotName
}
</script>

<template>
  <ElTableColumn
    v-for="column in props.showColumns"
    :key="`column-${column.prop}-${scopedId}`"
    :prop="column.prop"
    :label="i18nTranslate(column?.i18nLabel ?? column.label)"
    :sortable="column.sortable"
    v-bind="column"
  >
    <template #header="scope">
      <slot
        name="header"
        :scope="scope"
        :column="column"
        :row-index="scope.$index"
        :slot-key="getSlotName(column.slotKey)"
      ></slot>
    </template>
    <!-- 無子欄位 -->
    <template v-if="!getIsShowChildrenNode(column)" #default="scope">
      <slot
        name="column"
        :scope="scope"
        :column="column"
        :row-index="scope.$index"
        :slot-key="getSlotName(column.slotKey)"
        :data="scope.row[column.key]"
      ></slot>
    </template>

    <!-- 有子欄位 -->
    <ElTableColumn
      v-for="child in column.columns"
      :key="`child-${child.prop}-${scopedId}`"
      v-bind="child"
    >
      <template #header="scope">
        <slot
          name="header"
          :scope="scope"
          :column="column"
          :row-index="scope.$index"
          :slot-key="getSlotName(`${column.slotKey}-${child.slotKey}`)"
        ></slot>
      </template>
      <template #default="scope">
        <slot
          name="column"
          :scope="scope"
          :column="column"
          :row-index="scope.$index"
          :slot-key="getSlotName(`${column.slotKey}-${child.slotKey}`)"
          :data="scope.row[child.key]"
        ></slot>
      </template>
    </ElTableColumn>

    <!-- 有子欄位 遞迴自身 不生效(暫時不使用): ElTableColumn 無法識別 BasicTableColumn -->
    <!-- <BasicTableColumn
      :i18n-module="props.i18nModule"
      :show-columns="column.columns ?? []"
      :parent-slot-key="`${column?.slotKey ?? column.key}`"
    >
      <template #header="scope">
        <slot name="header" v-bind="scope"></slot>
      </template>
      <template #column="scope">
        <slot name="column" v-bind="scope"></slot>
      </template>
    </BasicTableColumn> -->
  </ElTableColumn>
</template>

<style lang="scss" scoped></style>
