<script setup lang="ts">
import { useSlots } from 'vue'
import { ElEmpty } from 'element-plus'

import { hasOwnProperty, getUuid } from '@/lib/lib_utils'

import {
  version,
  props as emptyProps
} from './CustomEmptyInfo'

const scopedId = getUuid('__i-empty__')

const props = defineProps(emptyProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

</script>

<template>
  <ElEmpty
    class="__empty-container"
    :class="`CustomEmpty_${version} ${scopedId}`"
    :image="props.image"
    :description="props.description"
    :image-size="props.imageSize"
  >
    <template v-if="hasSlot('default')" #default>
      <slot></slot>
    </template>
    <template v-if="hasSlot('image')" #image>
      <slot name="image"></slot>
    </template>
    <template v-if="hasSlot('description')" #description>
      <slot name="description"></slot>
    </template>
  </ElEmpty>
</template>

<style lang="scss" scoped>
:deep(.__empty-container) {
  &.el-empty {
    padding: 12px 0;
  }
}
.__empty {
  &-container {
    width: 100%;
    height: 100%;
  }
}
</style>
