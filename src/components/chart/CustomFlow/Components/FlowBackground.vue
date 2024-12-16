<script setup lang="ts">
import type { PropType } from 'vue'
import { Background } from '@vue-flow/background'

const props = defineProps({
  gap: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
    description: '圖案間隙'
  },
  size: {
    type: Number as PropType<number>,
    required: false,
    default: 0.4,
    description: '圖案尺寸'
  },
  patternColor: {
    type: String as PropType<string>,
    required: false,
    default: undefined,
    description: '圖案顏色'
  },
  bgColor: {
    type: String as PropType<string>,
    required: false,
    default: undefined,
    description: '背景顏色（覆蓋圖案）'
  },
  height: {
    type: Number as PropType<number>,
    required: false,
    default: 100,
    description: '背景高度'
  },
  width: {
    type: Number as PropType<number>,
    required: false,
    default: 100,
    description: '背景寬度'
  },
  x: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    description: 'X 軸偏移'
  },
  y: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    description: 'Y 軸偏移'
  }
})

</script>

<template>
  <Background
    :gap="props.gap"
    :size="props.size"
    :patternColor="props.patternColor"
    :bgColor="props.bgColor"
    :height="props.height"
    :width="props.width"
    :x="props.x"
    :y="props.y"
  ></Background>
</template>

<style lang="scss" scoped></style>
