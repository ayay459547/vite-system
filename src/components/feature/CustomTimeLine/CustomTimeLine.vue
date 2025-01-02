<script setup lang="ts">
import { useSlots } from 'vue'
import { ElTimeline, ElTimelineItem } from 'element-plus'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具

import { version, props as timeLineProps } from './CustomTimeLineInfo'

const scopedId = getUuid(version)

const props = defineProps(timeLineProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElTimeline :class="scopedId">
    <ElTimelineItem
      v-for="(option, optionIndex) in props.options"
      :key="`${optionIndex}-${scopedId}`"
      v-bind="option"
    >
      <template v-if="hasSlot('dot')" #dot>
        <slot name="dot" v-bind="option"></slot>
      </template>

      <template #default>
        <slot v-bind="option">{{ option?.label ?? '' }}</slot>
      </template>
    </ElTimelineItem>
  </ElTimeline>
</template>

<style lang="scss" scoped></style>
