<script setup lang="ts">
import { ElProgress } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import { version, props as progressProps } from './CustomProgressInfo'

const scopedId = getUuid('__i-popover__')

const props = defineProps(progressProps)

</script>

<template>
  <ElProgress
    :percentage ="props.percentage"
    :type ="props.type"
    :strokeWidth ="props.strokeWidth"
    :textInside ="props.textInside"
    :status ="props.status"
    :indeterminate ="props.indeterminate"
    :duration ="props.duration"
    :color ="props.color"
    :showText ="props.showText"
    :strokeLinecap ="props.strokeLinecap"
    :format ="props.format"
    :striped ="props.striped"
    :stripedFlow ="props.stripedFlow"
    :class="`CustomProgress_${version} ${scopedId}`"
    class="__progress-container"
  >
    <template #default>
      <slot></slot>
    </template>
  </ElProgress>
</template>

<style lang="scss" scoped>
// .__progress {
//   &-container {
//     width: fit-content;
//     height: fit-content;
//   }
// }
</style>
