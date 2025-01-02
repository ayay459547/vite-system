<script setup lang="ts">
import { useSlots } from 'vue'
import { VxeColumn } from 'vxe-table'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具
import { version, props as vxeColumnProps } from './VxeColumnInfo'

const scopedId = getUuid(version)

const props = defineProps(vxeColumnProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
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
    :class-name="props.className"
    :header-class-name="props.headerClassName"
    :footer-class-name="props.footerClassName"
    :class="scopedId"
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
    <template v-if="hasSlot('default')" #default="scope">
      <slot v-bind="scope"></slot>
    </template>
  </VxeColumn>
</template>

<style lang="scss" scoped></style>
