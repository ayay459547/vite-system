<script setup lang="ts">
import { useSlots, ref } from 'vue'
import { ElCarousel, ElCarouselItem } from 'element-plus'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具

import type { Emits, Expose } from './CustomCarouselInfo'
import { version, props as carouselProps } from './CustomCarouselInfo'

const scopedId = getUuid(version)

const props = defineProps(carouselProps)

const emit = defineEmits(['change'])
const onChange: Emits.Change = (curIndex: number, prevIndex: number) => {
  emit('change', curIndex, prevIndex)
}

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const carouselRef = ref<typeof ElCarousel>()
/**
 * 切換至指定的 Carousel
 * @param {Number|String} item
 * number: index in items
 * string: name of item
 */
const setActiveItem: Expose.SetActiveItem = item => {
  carouselRef.value?.setActiveItem(item)
}
// 切換至上一張 Carousel
const prev: Expose.Prev = () => {
  carouselRef.value?.prev()
}
// 切換至下一張 Carousel
const next: Expose.Next = () => {
  carouselRef.value?.next()
}
defineExpose({ setActiveItem, prev, next })
</script>

<template>
  <div :class="scopedId">
    <ElCarousel
      ref="carouselRef"
      :height="props.height"
      :initialIndex="props.initialIndex"
      :trigger="props.trigger"
      :autoplay="props.autoplay"
      :interval="props.interval"
      :indicator-position="props.indicatorPosition"
      :arrow="props.arrow"
      :type="props.type"
      :loop="props.loop"
      :direction="props.direction"
      :pause-on-hover="props.pauseOnHover"
      :motionBlur="props.motionBlur"
      @change="onChange"
    >
      <ElCarouselItem
        v-for="item in props.items"
        :key="`carousel-${item.name}-${scopedId}`"
        :label="item.label"
        :name="item.name"
      >
        <template v-if="hasSlot(`item-${item.name}`)" #default>
          <slot :name="`item-${item.name}`" v-bind="item"></slot>
        </template>
        <template v-else-if="hasSlot('item-all')" #default>
          <slot name="item-all" v-bind="item"></slot>
        </template>
      </ElCarouselItem>
    </ElCarousel>
  </div>
</template>

<style lang="scss" scoped></style>
