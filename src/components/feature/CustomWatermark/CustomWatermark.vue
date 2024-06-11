<script setup lang="ts">
import { ElWatermark } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import { version, props as watermarkProps } from './CustomWatermarkInfo'

const scopedName = '__i-watermark__'
const scopedId = getUuid(scopedName)

const props = defineProps(watermarkProps)

</script>

<template>
  <div
    class="watermark-container"
    :class="[
      `CustomWatermark_${version}`,
      scopedId,
      scopedName
    ]"
  >
    <ElWatermark
      :width="props.width"
      :height="props.height"
      :rotate="props.rotate"
      :zIndex="props.zIndex"
      :image="props.image"
      :content="props.content"
      :font="props.font"
      :gap="props.gap"
      :offset="props.offset"
    >
      <div class="watermark-main">
        <slot></slot>
      </div>
    </ElWatermark>
  </div>
</template>

<style lang="scss" scoped>
.__i-watermark__ {
  :deep {
    & > div {
      width: 100%;
      height: 100%;
    }
  }

  &.watermark {
    &-container {
      width: 100%;
      height: 100%;
    }
    &-main {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
