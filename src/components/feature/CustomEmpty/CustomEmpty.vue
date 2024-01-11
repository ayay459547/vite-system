<script setup lang="ts">
import { useSlots } from 'vue'
import { ElEmpty } from 'element-plus'

import { hasOwnProperty } from '@/lib/lib_utils'

import {
  version,
  scopedId,
  props as emptyProps
} from './CustomEmptyInfo'

const props = defineProps(emptyProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

</script>

<template>
  <div :class="`CustomEmpty_${version} ${scopedId}`" class="__empty-wrapper">
    <ElEmpty
      class="__empty-container"
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
  </div>
</template>

<style lang="scss" scoped>
:deep(.__empty-container) {
  &.el-empty {
    padding: 12px 0;
  }
}
.__empty {
  &-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
