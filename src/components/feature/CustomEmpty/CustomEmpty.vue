<script setup lang="ts">
import { useSlots } from 'vue'
import { ElEmpty } from 'element-plus'

import { hasOwnProperty, getUuid } from '@/lib/lib_utils'

import { version, props as emptyProps } from './CustomEmptyInfo'

const scopedName = '__i-empty__'
const scopedId = getUuid(scopedName)

const props = defineProps(emptyProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElEmpty
  :image="props.image"
  :description="props.description"
  :image-size="props.imageSize"
  class="empty-container"
  :class="[
    `CustomEmpty_${version}`,
    scopedId,
    scopedName
  ]"
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
.__i-empty__ :deep {
  &.el-empty {
    padding: 12px 0;
  }
}

.__i-empty__.empty {
  &-container {
    width: 100%;
    height: 100%;
  }
}
</style>
