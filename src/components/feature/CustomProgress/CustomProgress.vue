<script setup lang="ts">
import { ElProgress } from 'element-plus'

import { getUuid } from '@/lib/lib_utils' // 工具

import { version, props as progressProps } from './CustomProgressInfo'

const scopedId = getUuid(version)

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
    :class="scopedId"
  >
    <template #default="scope">
      <slot v-bind="scope"></slot>
    </template>
  </ElProgress>
</template>

<style lang="scss" scoped></style>
