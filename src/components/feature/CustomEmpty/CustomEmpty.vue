<script setup lang="ts">
import { useSlots } from 'vue'
import { ElEmpty } from 'element-plus'

import { hasOwnProperty, getUuid } from '@/lib/lib_utils.ts'

import { version, props as emptyProps } from './CustomEmptyInfo.ts'

const scopedName = '__i-empty__'
const scopedId = getUuid(scopedName)

const props = defineProps(emptyProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <div class="empty-container" :class="[`CustomEmpty_${version}`, scopedId, scopedName]">
    <ElEmpty :image="props.image" :description="props.description" :image-size="props.imageSize">
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
// :deep() 需要一個根節點
.__i-empty__ :deep(.el-empty) {
  padding: 12px 0;
}

.__i-empty__.empty {
  &-container {
    width: 100%;
    height: 100%;
  }
}
</style>
