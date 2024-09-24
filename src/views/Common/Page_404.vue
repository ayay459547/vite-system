<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

import { CustomWatermark } from '@/components'
import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'

// const imgStyle = ref('')
const titleStyle = ref('')

const setImgStyle = (e: MouseEvent) => {
  const { clientX, clientY } = e
  const diffX = centerPoint.x - clientX
  const diffY = centerPoint.y - clientY

  // imgStyle.value = `transform: translateX(${diffX / 5}px) translateY(${diffY / 5}px);`
  titleStyle.value = `transform: translateX(${diffX / 32}px) translateY(${diffY / 32}px);`
}
const throttleSetImgStyle = throttle(setImgStyle, 100) as (payload: MouseEvent) => void

const container = ref(null)
const centerPoint = reactive({
  x: 0,
  y: 0
})

const ROcallback = throttle((entries: ResizeObserverEntry[]) => {
  entries.forEach(entry => {
    const { x, y, width, height } = entry.contentRect
    centerPoint.x = x + width / 2
    centerPoint.y = y + height / 2
  })
}, 100) as ResizeObserverCallback

const RO = new ResizeObserver(ROcallback)

onMounted(() => {
  if (container.value !== null) {
    RO.observe(container.value)
  }
})
onUnmounted(() => {
  RO.disconnect()
})
</script>

<template>
  <CustomWatermark :z-index="0">
    <div ref="container" class="page" @mousemove="throttleSetImgStyle">
      <div class="page-circle"></div>
      <h1 class="page-title" :style="titleStyle">頁面不存在</h1>

      <img class="page-img" src="@/assets/images/common/page404.svg" alt="404" />
    </div>
  </CustomWatermark>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  flex-direction: column;
  @extend %flex-center;

  &-title {
    position: absolute;
    bottom: 22%;
    transition-duration: 0.3s;
    font-size: 5em;
    word-spacing: 6px;
    z-index: 3;
  }

  &-circle {
    aspect-ratio: 1 / 1;
    height: 55%;
    border-radius: 30%;
    background-color: var(--el-bg-color);
    transform: translateY(-10%);
    z-index: 1;
  }

  &-img {
    transition-duration: 0.3s;
    height: 50%;
    width: 50%;
    position: absolute;
    top: 12%;
    right: 25%;
    z-index: 2;
  }
}
</style>
