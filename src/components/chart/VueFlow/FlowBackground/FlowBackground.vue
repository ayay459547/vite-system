<script setup lang="ts">
import { useSlots } from 'vue'
import { Background } from '@vue-flow/background'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具
import { version, props as flowBackgroundProps } from './FlowBackgroundInfo'

const scopedId = getUuid(version)

const props = defineProps(flowBackgroundProps)

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

</script>

<template>
  <Background
    :class="`${scopedId}`"
    :id="props.id"
    :variant="props.variant"
    :gap="props.gap"
    :size="props.size"
    :color="props.color"
    :x="props.x"
    :y="props.y"
    :offset="props.offset"
  >
    <template v-if="hasSlot('default')" #default="scope">
      <slot name="default" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('pattern-container')" #pattern-container="scope">
      <slot name="pattern-container" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('pattern')" #pattern="scope">
      <slot name="pattern" v-bind="scope"></slot>
    </template>
  </Background>
</template>

<style lang="scss" scoped></style>
