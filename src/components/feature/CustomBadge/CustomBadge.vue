<script setup lang="ts">
import { useSlots } from 'vue'
import { ElBadge } from 'element-plus'

import { hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具

import { version, props as badgeProps } from './CustomBadgeInfo'

const scopedId = getUuid(version)

const props = defineProps({ ...badgeProps })

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElBadge
    :value="props.value"
    :max="props.max"
    :is-dot="props.isDot"
    :hidden="props.hidden"
    :type="props.type"
    :show-zero="props.showZero"
    :color="props.color"
    :offset="props.offset"
    :badge-style="props.badgeStyle"
    :badge-class="props.badgeClass"
    :class="scopedId"
  >
    <template v-if="hasSlot('default')" #default>
      <slot></slot>
    </template>
    <template v-if="hasSlot('content')" #content="scoped">
      <slot
        name="content"
        v-bind="scoped"
        :value="scoped.value"
      ></slot>
    </template>
  </ElBadge>
</template>

<style lang="scss" scoped></style>
