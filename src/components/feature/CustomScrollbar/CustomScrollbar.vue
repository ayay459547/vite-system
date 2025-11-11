<script setup lang="ts">
import { useSlots, ref } from 'vue'
import { ElScrollbar } from 'element-plus'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具

import type { Types, Emits, Expose } from './CustomScrollbarInfo'
import { version, props as scrollbarProps } from './CustomScrollbarInfo'

const scopedId = getUuid(version)

const props = defineProps(scrollbarProps)

const emit = defineEmits(['scroll'])

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const onScroll: Emits['scroll'] = ($event: Types['onScrollParams']) => {
  const { scrollLeft, scrollTop } = $event
  emit('scroll', { scrollLeft, scrollTop })
}

// exposes
const ElScrollbarRef = ref<typeof ElScrollbar>()
const handleScroll: Expose['handleScroll'] = () => {
  ElScrollbarRef.value?.handleScroll()
}
const scrollTo: Expose['scrollTo'] = (options, yCoord) => {
  ElScrollbarRef.value?.scrollTo(options, yCoord)
}
const setScrollTop: Expose['setScrollTop'] = scrollTop => {
  ElScrollbarRef.value?.setScrollTop(scrollTop)
}
const setScrollLeft: Expose['setScrollLeft'] = scrollLeft => {
  ElScrollbarRef.value?.setScrollLeft(scrollLeft)
}
const update: Expose['update'] = () => {
  ElScrollbarRef.value?.update()
}
const wrapRef: Expose['wrapRef'] = () => {
  return ElScrollbarRef.value?.wrapRef
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
    ref="ElScrollbarRef"
    :height="props.height"
    :max-height="props.maxHeight"
    :native="props.native"
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
    :tabindex="props.tabindex"
    :class="scopedId"
    @scroll="onScroll"
  >
    <template v-if="hasSlot('default')" #default>
      <slot></slot>
    </template>
  </ElScrollbar>
</template>

<style lang="scss" scoped></style>
