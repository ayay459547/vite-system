<script setup lang="ts">
import { useSlots } from 'vue'
import { ElBadge } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import {
  version,
  props as badgeProps
} from './CustomBadgeInfo'

const scopedId = getUuid('__i-badge__')

const props = defineProps({ ...badgeProps })

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

</script>

<template>
  <div :class="`CustomBadge_${version} ${scopedId}`" class="__badge-wrapper">
    <ElBadge
      :value="props.value"
      :max="props.max"
      :is-dot="props.isDot"
      :hidden="props.hidden"
      :type="props.type"
    >
      <template v-if="hasSlot('default')" #default>
        <slot></slot>
      </template>
    </ElBadge>
  </div>
</template>

<style lang="scss" scoped>
.__badge {
  &-wrapper {
    width: 100%;
    height: fit-content;
  }
}
</style>
