<script setup lang="ts">
import type { PropType } from 'vue'
import { useSlots } from 'vue'
import { VxeColgroup } from 'vxe-table'

/**
 * https://vxetable.cn/#/colgroup/api
 */
const props = defineProps({
  field: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '資料key'
  },
  title: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '欄位名稱'
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <VxeColgroup
    :field="props.field"
    :title="props.title"
  >
    <template v-if="hasSlot('header')" #header="scope">
      <slot name="header" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('default')">
      <slot></slot>
    </template>
  </VxeColgroup>
</template>

<style lang="scss" scoped></style>
