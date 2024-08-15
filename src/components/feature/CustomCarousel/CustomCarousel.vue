<script setup lang="ts">
import { useSlots, ref } from 'vue'
import { ElCarousel, ElCarouselItem } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import { version, props as carouselProps } from './CustomCarouselInfo'

const scopedId = getUuid('__i-carousel__')

const props = defineProps(carouselProps)

const emit = defineEmits(['change'])

const onChange = (curIndex: number, prevIndex: number) => {
  emit('change', curIndex, prevIndex)
}

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const carouselRef = ref(null)
defineExpose({
  setActiveItem: (item: number | string) => {
    // 切換至指定的 Carousel
    //number: index in items
    //string: name of item
    carouselRef?.value.setActiveItem(item)
  },
  prev: () => {
    // 切換至上一張 Carousel
    carouselRef?.value.prev()
  },
  next: () => {
    // 切換至下一張 Carousel
    carouselRef?.value.next()
  }
})
</script>

<template>
  <div :class="`CustomCarousel_${version} ${scopedId}`" class="__carousel-wrapper">
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
      <ElCarouselItem v-for="item in props.items" :key="item" :label="item.label" :name="item.name">
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

<style lang="scss" scoped>
.__collapse {
  &-wrapper {
    width: 100%;
    height: fit-content;
  }

  &-title {
    font: {
      size: 1.2em;
      weight: 600;
    }
    padding: 0 8px;
  }
}
</style>
