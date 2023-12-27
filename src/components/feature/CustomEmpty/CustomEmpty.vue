<script setup lang="ts">
import { type PropType, useSlots } from 'vue'
import { ElEmpty } from 'element-plus'

import { hasOwnProperty, getUuid } from '@/lib/lib_utils'

const props = defineProps({
  image: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '圖片的 url'
  },
  imageSize: {
    type: Number as PropType<number>,
    required: false,
    description: '圖片 寬度 width'
  },
  description: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '文字訊息'
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const scopedId = getUuid('__i-empty__')

</script>

<template>
  <div class="__empty-wrapper" :class="scopedId">
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
