<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'

const imgStyle = ref('')
const titleStyle = ref('')

const setImgStyle = (e: MouseEvent) => {
  const { clientX, clientY } = e
  const diffX = centerPoint.x - clientX
  const diffY = centerPoint.y - clientY

  imgStyle.value = `transform: translateX(${diffX / 6}px) translateY(${diffY / 6}px);`
  titleStyle.value = `transform: translateX(${diffX / 16}px) translateY(${diffY / 16}px);`
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
  <div ref="container" class="empty" @mousemove="throttleSetImgStyle">
    <h1 class="empty-title" :style="titleStyle">功能維護中</h1>
    <img class="empty-img" src="@/assets/images/common/fix.svg" alt="login" :style="imgStyle" />
  </div>
</template>

<style lang="scss" scoped>
.empty {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  padding: 16px;

  flex-direction: column;
  @extend %flex-center;

  &-title {
    transition-duration: 0.3s;
    font-size: 3em;
    word-spacing: 4px;
    z-index: 1;
  }

  &-img {
    transition-duration: 0.3s;
    width: 80%;
    height: 80%;
    position: absolute;
    opacity: 0.8;
  }
}
</style>
