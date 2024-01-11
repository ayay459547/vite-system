<script setup lang="ts">
import { useSlots, ref } from 'vue'
import { ElScrollbar } from 'element-plus'

import { hasOwnProperty } from '@/lib/lib_utils'

import type {
  OnScrollParams,
  HandleScroll,
  ScrollTo,
  SetScrollTop,
  SetScrollLeft,
  Update,
  WrapRef
} from './CustomScrollbarInfo'
import {
  version,
  scopedId,
  props as scrollbarProps
} from './CustomScrollbarInfo'

const props = defineProps(scrollbarProps)

const emit = defineEmits(['scroll'])

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const onScroll = ($event: OnScrollParams) => {
  const { scrollLeft, scrollTop } = $event
  emit('scroll', { scrollLeft, scrollTop })
}

// exposes
const elScrollbarRef = ref()
const handleScroll: HandleScroll = () => {
  elScrollbarRef?.value?.handleScroll()
}
const scrollTo: ScrollTo = (options, yCoord) => {
  elScrollbarRef?.value?.scrollTo(options, yCoord)
}
const setScrollTop: SetScrollTop = (scrollTop) => {
  elScrollbarRef?.value?.setScrollTop(scrollTop)
}
const setScrollLeft: SetScrollLeft = (scrollLeft) => {
  elScrollbarRef?.value?.setScrollLeft(scrollLeft)
}
const update: Update = () => {
  elScrollbarRef?.value?.update()
}
const wrapRef: WrapRef = () => {
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
  <div :class="`CustomScrollbar_${version} ${scopedId}`" class="__scroll-bar">
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
      @scroll="onScroll"
    >
      <template v-if="hasSlot('default')" #default>
        <slot></slot>
      </template>
    </ElScrollbar>
  </div>
</template>

<style lang="scss" scoped>
.__scroll {
  &-bar {
    width: fit-content;
    height: fit-content;
    display: contents;
  }
}
</style>
