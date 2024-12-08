<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { ElSkeleton, ElSkeletonItem, ElAutoResizer } from 'element-plus'

import type { Variant } from '@/lib/lib_hook' // 自訂Composition API

const props = defineProps({
  variant: {
    type: String as PropType<Variant>,
    default: 'rect'
  }
})

const bindStyle = computed(() => {
  let width = '99%'
  let height = 'fit-content'

  switch (props.variant) {
    case 'p':
    case 'text':
      height = '16px'
      break
    case 'h1':
      height = '20px'
      break
    case 'h3':
    case 'caption':
      height = '18px'
      break
    case 'button':
      width = '80px'
      height = '32px'
      break
    case 'empty':
      width = '0px'
      height = '0px'
      break
    case 'image':
    case 'circle':
    case 'rect':
      height = '99%'
      break
  }

  return { width, height }
})

const skeletonVariant = computed(() => {
  if (props.variant === 'empty') return 'text'
  return props.variant
})

</script>

<template>
  <div class="page-skeleton" :style="bindStyle">
    <ElAutoResizer>
      <template #default="{ height, width }">
        <ElSkeleton
          :style="{
            width: `${width}px`,
            height: `${height}px`
          }"
          animated
        >
          <template #template>
            <ElSkeletonItem
              :style="{
                width: `${width}px`,
                height: `${height}px`
              }"
              :variant="skeletonVariant"
            />
          </template>

          <template #default></template>
        </ElSkeleton>
      </template>
    </ElAutoResizer>
  </div>
</template>

<style lang="scss" scoped>
.page-skeleton {
  background-color: var(--i-color-system-page);
  overflow: hidden;
  margin: 2px;
}
</style>
