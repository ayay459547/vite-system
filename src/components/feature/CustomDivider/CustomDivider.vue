<script setup lang="ts">
import { useSlots } from 'vue'
import { ElDivider } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import { version, props as dividerProps } from './CustomDividerInfo'

const scopedId = getUuid(version)

const props = defineProps(dividerProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <ElDivider
    :direction="props.direction"
    :border-style="props.borderStyle"
    :content-position="props.contentPosition"
    class="divider-container"
    :class="scopedId"
  >
    <template v-if="hasSlot('default')" #default>
      <slot></slot>
    </template>
  </ElDivider>
</template>

<style lang="scss" scoped>
div[class*="__CustomDivider"].divider {
  &-container {
    width: 100%;
  }
}
</style>
