<script setup lang="ts">
import { useSlots } from 'vue'
import { VxeColgroup } from 'vxe-table'

import { getUuid } from '@/lib/lib_utils'
import { version, props as vxeColgroupProps } from './VxeColgroupInfo'

const scopedId = getUuid(version)

const props = defineProps(vxeColgroupProps)

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
    :header-class-name="props.headerClassName"
    :class="scopedId"
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
