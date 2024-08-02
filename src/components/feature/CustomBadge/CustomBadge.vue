<script setup lang="ts">
import { useSlots } from 'vue'
import { ElBadge } from 'element-plus'

import { getUuid } from '@/lib/lib_utils.ts'

import { version, props as badgeProps } from './CustomBadgeInfo.ts'

const scopedName = '__i-badge__'
const scopedId = getUuid(scopedName)

const props = defineProps({ ...badgeProps })

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <ElBadge
    :value="props.value"
    :max="props.max"
    :is-dot="props.isDot"
    :hidden="props.hidden"
    :type="props.type"
    class="badge-wrapper"
    :class="[`CustomBadge_${version}`, scopedId, scopedName]"
  >
    <template v-if="hasSlot('default')" #default>
      <slot></slot>
    </template>
  </ElBadge>
</template>

<style lang="scss" scoped>
.__i-badge__.badge {
  &-wrapper {
    width: fit-content;
    height: fit-content;
  }
}
</style>
