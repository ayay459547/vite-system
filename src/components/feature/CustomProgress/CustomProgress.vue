<script setup lang="ts">
import { ElProgress } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import { version, props as progressProps } from './CustomProgressInfo'

const scopedName = '__i-popover__'
const scopedId = getUuid(scopedName)

const props = defineProps(progressProps)

</script>

<template>
  <ElProgress
    :percentage ="props.percentage"
    :type ="props.type"
    :stroke-width ="props.strokeWidth"
    :text-inside ="props.textInside"
    :status ="props.status"
    :indeterminate ="props.indeterminate"
    :duration ="props.duration"
    :color ="props.color"
    :show-text ="props.showText"
    :stroke-linecap ="props.strokeLinecap"
    :format ="props.format"
    :striped ="props.striped"
    :striped-flow ="props.stripedFlow"
    class="progress-container"
    :class="[
      `CustomProgress_${version}`,
      scopedId,
      scopedName
    ]"
  >
    <template #default>
      <slot></slot>
    </template>
  </ElProgress>
</template>

<style lang="scss" scoped>
// .__i-popover__.progress {
//   &-container {
//     width: fit-content;
//     height: fit-content;
//   }
// }
</style>
