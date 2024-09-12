<script setup lang="ts">
import { useSlots } from 'vue'
import { ElImage } from 'element-plus'

import { hasOwnProperty, getUuid } from '@/lib/lib_utils'

import type { Emits } from './CustomImageInfo'
import { version, props as imageProps } from './CustomImageInfo'

const scopedId = getUuid(version)

const props = defineProps(imageProps)

const emit = defineEmits(['load', 'error', 'switch', 'close', 'show'])

const onEvent: {
  load: Emits.Load
  error: Emits.Error
  switch: Emits.Switch
  close: Emits.Close
  show: Emits.Show
} = {
  load: (e: Event) => emit('load', e),
  error: (e: Error) => emit('error', e),
  switch: (e: number) => emit('switch', e),
  close: (): void => emit('close'),
  show: (): void => emit('show')
}

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElImage
    :src="props.src"
    :fit="props.fit"
    :alt="props.alt"
    :loading="props.loading"
    :referrerpolicy="props.referrerpolicy"
    :zoom-rate="props.zoomRate"
    :initial-index="props.initialIndex"
    :preview-src-list="props.previewSrcList"
    :hide-on-click-modal="props.hideOnClickModal"
    :preview-teleported="props.previewTeleported"
    class="image-container"
    :class="scopedId"
    v-on="onEvent"
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
