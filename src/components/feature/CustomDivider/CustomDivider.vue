<script setup lang="ts">
import { useSlots } from 'vue'
import { ElDivider } from 'element-plus'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具

import { version, props as dividerProps } from './CustomDividerInfo'

const scopedId = getUuid(version)

const props = defineProps(dividerProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElDivider
    :direction="props.direction"
    :border-style="props.borderStyle"
    :content-position="props.contentPosition"
    class="divider-container"
    :class="[
      `divider-${props.direction}`,
      scopedId
    ]"
  >
    <template v-if="hasSlot('default')" #default>
      <slot></slot>
    </template>
  </ElDivider>
</template>

<style lang="scss" scoped>
div[class*="__CustomDivider"].divider {
  &-container {
    :deep(.el-divider__text) {
      border-radius: 6px;
    }
  }
  &-horizontal {
    width: 100%;
    margin: 16px 0 !important;
  }
  &-vertical {
    height: 100%;
    margin: 0 16px !important;
  }
}
</style>
