vueinit<script setup lang="ts">
import { useSlots } from 'vue'
import { Controls } from '@vue-flow/controls'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具

import type { Emits } from './FlowControlsInfo'
import { version, props as flowControlsProps } from './FlowControlsInfo'

const scopedId = getUuid(version)

const props = defineProps(flowControlsProps)

const emit = defineEmits(['onZoomIn', 'onZoomOut', 'onFitView', 'onInteractionChange'])

const onZoomIn: Emits['onZoomIn'] = () => emit('onZoomIn')
const onZoomOut = () => emit('onZoomOut')
const onFitView = () => emit('onFitView')
const onInteractionChange = (active: boolean) => emit('onInteractionChange', active)

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

</script>

<template>
  <Controls
    :class="`${scopedId}`"
    :showZoom="props.showZoom"
    :showFitView="props.showFitView"
    :showInteractive="props.showInteractive"
    :fitViewParams="props.fitViewParams"
    :position="props.position"
    @zoom-in="onZoomIn"
    @zoom-out="onZoomOut"
    @fit-view="onFitView"
    @interaction-change="onInteractionChange"
  >
    <template v-if="hasSlot('default')" #default="scope">
      <slot name="default" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('top')" #top="scope">
      <slot name="top" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('control-zoom-in')" #control-zoom-in="scope">
      <slot name="control-zoom-in" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('icon-zoom-in')" #icon-zoom-in="scope">
      <slot name="icon-zoom-in" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('control-zoom-out')" #control-zoom-out="scope">
      <slot name="control-zoom-out" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('icon-zoom-out')" #icon-zoom-out="scope">
      <slot name="icon-zoom-out" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('control-fit-view')" #control-fit-view="scope">
      <slot name="control-fit-view" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('icon-fit-view')" #icon-fit-view="scope">
      <slot name="icon-fit-view" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('control-interactive')" #control-interactive="scope">
      <slot name="control-interactive" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('icon-unlock')" #icon-unlock="scope">
      <slot name="icon-unlock" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('icon-lock')" #icon-lock="scope">
      <slot name="icon-lock" v-bind="scope"></slot>
    </template>
  </Controls>
</template>

<style lang="scss" scoped></style>
