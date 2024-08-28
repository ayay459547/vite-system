<script setup lang="ts">
import type { PropType } from 'vue'
import { useSlots } from 'vue'
import type { VxeColumnProps } from 'vxe-table'
import { VxeColumn } from 'vxe-table'

type ColumnType = string
  | 'seq'
  | 'checkbox'
  | 'radio'
  | 'expand'
  | 'html'

type Fixed = String | any
 | 'left'
 | 'right'

type Align = String | any
 | 'center'
 | 'left'
 | 'right'

 /**
  * https://vxetable.cn/#/column/api
  */
const props = defineProps({
  type: {
    type: String as PropType<ColumnType>,
    required: false,
    default: '',
    description: '欄位類型'
  },
  field: {
    type: String as PropType<string>,
    required: false,
    default: undefined,
    description: '資料key'
  },
  title: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '欄位名稱'
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    default: 'auto',
    description: '寬度'
  },
  minWidth: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    default: 'auto',
    description: '最小寬度'
  },
  fixed: {
    type: String as PropType<Fixed>,
    required: false,
    default: undefined,
    description: '固定位置'
  },
  align: {
    type: String as PropType<Align>,
    required: false,
    default: undefined,
    description: '對齊方式'
  }
}) as VxeColumnProps

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <VxeColumn
    :field="props.field"
    :title="props.title"
    :width="props.width"
    :minWidth="props.minWidth"
    :fixed="props.fixed"
    :align="props.align"
  >
    <template v-if="hasSlot('header')" #header="scope">
      <slot name="header" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('footer')" #footer="scope">
      <slot name="footer" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('content')" #content="scope">
      <slot name="content" v-bind="scope"></slot>
    </template>
    <template #default="scope">
      <slot v-bind="scope"></slot>
    </template>
  </VxeColumn>
</template>

<style lang="scss" scoped></style>
