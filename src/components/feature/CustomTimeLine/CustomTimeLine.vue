<script setup lang="ts">
import { useSlots } from 'vue'
import { ElTimeline, ElTimelineItem } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import {
  version,
  props as timeLineProps
} from './CustomTimeLineInfo'

const scopedId = getUuid('__i-time-line__')

const props = defineProps(timeLineProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

</script>

<template>
  <div :class="`CustomTimeLine_${version} ${scopedId}`" class="__time-line-wrapper">
    <ElTimeline>
      <ElTimelineItem
        v-for="(option, optionIndex) in props.options"
        :key="optionIndex"
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
  </div>
</template>

<style lang="scss" scoped>
.__time-line {
  &-wrapper {
    width: fit-content;
    height: fit-content;
  }
}
</style>
