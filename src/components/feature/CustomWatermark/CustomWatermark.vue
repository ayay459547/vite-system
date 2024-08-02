<script setup lang="ts">
import { useSlots } from 'vue'
import { ElWatermark } from 'element-plus'

import { getUuid } from '@/lib/lib_utils.ts'

import { version, props as watermarkProps } from './CustomWatermarkInfo.ts'

const scopedId = getUuid('__i-watermark__')

const props = defineProps(watermarkProps)
const subProps = props.sub.map(_props => {
  const cos = Math.cos((Math.PI * props.rotate) / 180)
  const sin = Math.sin((Math.PI * props.rotate) / 180)
  const absCos = Math.abs(cos)
  const absSin = Math.abs(sin)
  //為了避免跑版，每組 rotate( width, height ) + gap 必須相同，取主浮水印為最大值

  const displaySize = (width: number, height: number, gap?: [number, number]) => {
    return [
      (width * absCos + height * absSin + (gap ? gap[0] : 0)) * 2,
      width * absSin + height * absCos + (gap ? gap[1] : 0)
    ]
  }

  const subWidth = _props.width ?? props.width
  const subHeight = _props.height ?? props.height

  const subSize = displaySize(subWidth, subHeight)
  const mainSize = displaySize(props.width, props.height, props.gap)

  const gap: [number, number] = [
    subSize[0] > mainSize[0] ? props.gap[0] : (mainSize[0] - subSize[0]) / 2,
    subSize[1] > mainSize[1] ? props.gap[1] : mainSize[1] - subSize[1]
  ]
  const width = subSize[0] > mainSize[0] ? props.width : subWidth
  const height = subSize[1] > mainSize[1] ? props.height : subHeight

  const offset: [number, number] = _props.shift
    ? [
        props.offset[0] + _props.shift[0] * cos - _props.shift[1] * sin,
        props.offset[1] + _props.shift[0] * sin + _props.shift[1] * cos
      ]
    : props.offset

  const font = Object.assign({ ...props.font }, _props.font)

  return {
    rotate: props.rotate,
    gap: gap,
    width: width,
    height: height,
    font: font,
    offset: offset,
    zIndex: _props.shift ? props.zIndex + _props.shift[2] : props.zIndex,
    content: _props.content,
    image: _props.image
  }
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <div
    :class="`CustomWatermarkInfo_${version} ${scopedId} fit-${props.sizeFit}`"
    class="__watermark-wrapper"
  >
    <template v-for="(item, index) in subProps" :key="index">
      <ElWatermark
        style="position: absolute; width: 100%; height: 100%"
        :width="item.width"
        :height="item.height"
        :rotate="item.rotate"
        :z-index="item.zIndex"
        :image="item.image"
        :content="item.content"
        :font="item.font"
        :gap="item.gap"
        :offset="item.offset"
      />
    </template>
    <ElWatermark
      style="width: 100%; height: 100%"
      :width="props.width"
      :height="props.height"
      :rotate="props.rotate"
      :z-index="props.zIndex"
      :image="props.image"
      :content="props.content"
      :font="props.font"
      :gap="props.gap"
      :offset="props.offset"
    >
      <template v-if="hasSlot('default')" #default>
        <slot></slot>
      </template>
    </ElWatermark>
  </div>
</template>

<style lang="scss" scoped>
.__watermark {
  &-wrapper {
    position: relative;
  }
}

.fit {
  &-parent {
    width: 100%;
    height: 100%;
  }
  &-children {
    width: fit-content;
    height: fit-content;
  }
}
</style>
