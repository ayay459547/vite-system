<script setup lang="ts">
import { useSlots } from 'vue'
import { ElSteps, ElStep } from 'element-plus'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具

import { version, props as stopsProps } from './CustomStepsInfo'

const scopedId = getUuid(version)

const props = defineProps(stopsProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElSteps
    :space="props.space"
    :direction="props.direction"
    :active="props.active"
    :process-status="props.processStatus"
    :finish-status="props.finishStatus"
    :align-center="props.alignCenter"
    :simple="props.simple"
    :class="scopedId"
  >
    <ElStep
      v-for="(option, optionIndex) in props.options"
      :key="`${optionIndex}-${scopedId}`"
      :title="option.label"
      v-bind="option"
    >
      <template v-if="hasSlot('icon')" #icon>
        <slot name="icon" v-bind="option"></slot>
      </template>
      <template v-if="hasSlot('title')" #title>
        <slot name="title" v-bind="option"></slot>
      </template>

      <template v-if="hasSlot('description')" #description>
        <slot v-bind="option">{{ option?.label ?? '' }}</slot>
      </template>
    </ElStep>
  </ElSteps>
</template>

<style lang="scss" scoped>
div[class*="__CustomSteps"] {
  width: 100%;
  height: fit-content;
}
</style>
