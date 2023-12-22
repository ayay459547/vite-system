<script setup lang="ts">
import { type PropType, useSlots } from 'vue'
import { type TimelineItemProps, ElTimeline, ElTimelineItem } from 'element-plus'
import { getUuid } from '@/lib/lib_utils'

export type Size = 'large'| 'default'| 'small'
export type Placement = 'top'| 'bottom'
export type TimeType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'

export type Options = TimelineItemProps & {
  label?: string
  timestamp?: string
  type?: TimeType
  color?: string
  size?: Size
  hollow?: boolean
  placement?: Placement
} & any

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const props = defineProps({
  options: {
    type: Array as PropType<Options[]>,
    default () {
      return []
    }
  }
})

const scopedId = getUuid('__i-time-line__')

</script>

<template>
  <div class="__i-time-line" :class="scopedId">
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
.__i-time-line {
  width: fit-content;
  height: fit-content;
}
</style>
