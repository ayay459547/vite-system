<script setup lang="ts">
import { useSlots, ref } from 'vue'
import { ElScrollbar } from 'element-plus'

import { hasOwnProperty, getUuid } from '@/lib/lib_utils.ts'

import type { Custom, Emits, Expose } from './CustomScrollbarInfo.ts'
import { version, props as scrollbarProps } from './CustomScrollbarInfo.ts'

const scopedName = '__i-scroll-bar__'
const scopedId = getUuid(scopedName)

const props = defineProps(scrollbarProps)

const emit = defineEmits(['scroll'])

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const onScroll: Emits.Scroll = ($event: Custom.OnScrollParams) => {
  const { scrollLeft, scrollTop } = $event
  emit('scroll', { scrollLeft, scrollTop })
}

// exposes
const elScrollbarRef = ref()
const handleScroll: Expose.HandleScroll = () => {
  elScrollbarRef?.value?.handleScroll()
}
const scrollTo: Expose.ScrollTo = (options, yCoord) => {
  elScrollbarRef?.value?.scrollTo(options, yCoord)
}
const setScrollTop: Expose.SetScrollTop = scrollTop => {
  elScrollbarRef?.value?.setScrollTop(scrollTop)
}
const setScrollLeft: Expose.SetScrollLeft = scrollLeft => {
  elScrollbarRef?.value?.setScrollLeft(scrollLeft)
}
const update: Expose.Update = () => {
  elScrollbarRef?.value?.update()
}
const wrapRef: Expose.WrapRef = () => {
  return elScrollbarRef?.value?.wrapRef
}

defineExpose({
  handleScroll,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  update,
  wrapRef
})
</script>

<template>
  <ElScrollbar
    ref="elScrollbarRef"
    :height="props.height"
    :max-height="props.maxHeight"
    :wrap-style="props.wrapStyle"
    :wrap-class="props.wrapClass"
    :view-style="props.viewStyle"
    :view-class="props.viewClass"
    :noresize="props.noresize"
    :tag="props.tag"
    :always="props.always"
    :min-size="props.minSize"
    :id="props.id"
    :role="props.role"
    :aria-label="props.ariaLabel"
    :aria-orientation="props.ariaOrientation"
    class="scroll-bar"
    :class="[`CustomScrollbar_${version}`, scopedId, scopedName]"
    @scroll="onScroll"
  >
    <template v-if="hasSlot('default')" #default>
      <slot></slot>
    </template>
  </ElScrollbar>
</template>

<style lang="scss" scoped></style>
