<script setup lang="ts">
import type { PropType } from 'vue'
import { useSlots } from 'vue'
import { ElSteps, ElStep } from 'element-plus'

export type StatusType = 'wait' | 'process' | 'finish' | 'error' | 'success'

export type Options = {
  lable?: string
  description?: string
  status?: StatusType | ''
}

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const props = defineProps({
  space: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  direction: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'horizontal'
  },
  active: {
    type: Number as PropType<number>,
    default: 0
  },
  processStatus: {
    type: String as PropType<StatusType>,
    default: 'process'
  },
  finishStatus: {
    type: String as PropType<StatusType>,
    default: 'finish'
  },
  alignCenter: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  simple: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  options: {
    type: Array as PropType<Options[]>,
    default () {
      return []
    }
  }
})

</script>

<template>
  <div class="container">
    <ElSteps
      :space="props.space"
      :direction="props.direction"
      :active="props.active"
      :process-status="props.processStatus"
      :finish-status="props.finishStatus"
      :align-center="props.alignCenter"
      :simple="props.simple"
    >
      <ElStep
        v-for="(option, optionIndex) in props.options"
        :key="optionIndex"
        :title="option.lable"
        v-bind="option"
      >
        <template v-if="hasSlot('icon')" #icon>
          <slot name="icon" v-bind="option"></slot>
        </template>
        <template v-if="hasSlot('title')" #title>
          <slot name="title" v-bind="option"></slot>
        </template>

        <template v-if="hasSlot('description')" #description>
          <slot v-bind="option">{{ option?.lable ?? '' }}</slot>
        </template>
      </ElStep>
    </ElSteps>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: fit-content;
}
</style>