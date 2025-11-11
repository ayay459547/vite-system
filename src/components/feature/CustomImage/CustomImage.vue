<script setup lang="ts">
import { useSlots } from 'vue'
import { ElImage } from 'element-plus'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具

import type { Emits } from './CustomImageInfo'
import { version, props as imageProps } from './CustomImageInfo'

const scopedId = getUuid(version)

const props = defineProps(imageProps)

const emit = defineEmits(['load', 'error', 'switch', 'close', 'show'])

const onLoad: Emits['load'] = (evt: Event) => emit('load', evt)
const onError: Emits['error'] = (evt: Event) => emit('error', evt)
const onSwitch: Emits['switch'] = (val: number) => emit('switch', val)
const onClose: Emits['close'] = (): void => emit('close')
const onShow: Emits['show'] = (): void => emit('show')

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElImage
    :src="props.src"
    :fit="props.fit"
    :hide-on-click-modal="props.hideOnClickModal"
    :loading="props.loading"
    :lazy="props.lazy"
    :scroll-container="props.scrollContainer"
    :alt="props.alt"
    :referrerpolicy="props.referrerpolicy"
    :crossorigin="props.crossorigin"
    :preview-src-list="props.previewSrcList"
    :z-index="props.zIndex"
    :initial-index="props.initialIndex"
    :close-on-press-escape="props.closeOnPressEscape"
    :preview-teleported="props.previewTeleported"
    :infinite="props.infinite"
    :zoom-rate="props.zoomRate"
    :min-scale="props.minScale"
    :max-scale="props.maxScale"
    class="image-container"
    :class="scopedId"
    @load="onLoad"
    @error="onError"
    @switch="onSwitch"
    @close="onClose"
    @show="onShow"
  >
    <template v-if="hasSlot('placeholder')" #placeholder>
      <slot name="placeholder"></slot>
    </template>
    <template v-if="hasSlot('error')" #error>
      <slot name="error"></slot>
    </template>
    <!-- <template v-if="hasSlot('viewer')" #viewer>
      <slot name="viewer"></slot>
    </template> -->
  </ElImage>
</template>

<style lang="scss" scoped>
div[class*="__CustomImage"].image {
  &-container {
    width: 100%;
    height: 100%;
  }
}
</style>
