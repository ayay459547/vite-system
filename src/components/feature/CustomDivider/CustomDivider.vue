<script setup lang="ts">
import { useSlots } from 'vue'
import { ElDivider } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import {
  version,
  props as dividerProps
} from './CustomDividerInfo'

const scopedId = getUuid('__i-divider__')

const props = defineProps(dividerProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

</script>

<template>
  <div :class="`CustomDividerInfo_${version} ${scopedId}`" class="__divider-wrapper">
    <ElDivider
      :direction="props.direction"
      :border-style="props.borderStyle"
      :content-position="props.contentPosition"
    >
      <template v-if="hasSlot('default')" #default>
        <slot></slot>
      </template>
    </ElDivider>
  </div>
</template>

<style lang="scss" scoped>
.__divider {
  &-wrapper {
    width: 100%;
    height: fit-content;
  }
}
</style>
