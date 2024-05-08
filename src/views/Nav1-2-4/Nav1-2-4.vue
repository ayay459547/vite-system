<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'

const titleStyle = ref('')
const container = ref(null)
const centerPoint = reactive({
  x: 0,
  y: 0
})

const setImgStyle = (e: MouseEvent) => {
  const { clientX, clientY } = e
  const diffX = centerPoint.x - clientX
  const diffY = centerPoint.y - clientY

  titleStyle.value = `transform: translateX(${diffX / 12}px) translateY(${diffY / 12}px);`
}

const eyeStyle = ref('')
const eye = ref(null)
const eyeCenter = reactive({
  x: 0,
  y: 0
})

const setEyeAngle = (e: MouseEvent) => {
  const { clientX, clientY } = e
  const diffX = clientX - eyeCenter.x
  const diffY = clientY - eyeCenter.y
  const radian = Math.atan2(diffY, diffX)
  const degrees = (180 / Math.PI) * radian
  eyeStyle.value = `transform: rotateZ(${degrees - 90}deg);`
}

const onMouseMove = (e: MouseEvent) => {
  setImgStyle(e)
  setEyeAngle(e)
}
const throttleOnMouseMove = throttle(onMouseMove, 80) as (payload: MouseEvent) => void

const ROcallback = throttle((entries: ResizeObserverEntry[]) => {
  entries.forEach(entry => {
    // 寬度中心
    const { x, y, width, height } = entry.contentRect
    centerPoint.x = x + width / 2
    centerPoint.y = y + height / 2

    // 眼睛中心
    const { top, height: eyeHeight, left, width: eyeWidth } = eye.value.getBoundingClientRect()
    eyeCenter.x = left + eyeWidth / 2
    eyeCenter.y = top + eyeHeight / 2
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
  <div ref="container" class="page" @mousemove="throttleOnMouseMove">
    <h1 class="page-title" :style="titleStyle">TEST</h1>
    <img class="page-img" src="@/assets/images/common/_page404.svg" alt="404" />
    <div class="man-body">
      <div ref="eye" class="man-eye" :style="eyeStyle">
        <div class="man-eye-ball"></div>
      </div>
      <div class="man-hand left"></div>
      <div class="man-hand right"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin circle($width, $color) {
  background-color: $color;
  width: $width;
  height: $width;
  border-radius: 50%;
}
.man {
  &-body {
    @include circle(196px, #2f2e41);
    position: absolute;
    top: -32px;
    left: 64px;
  }

  &-eye {
    @include circle(80px, #fff);
    position: relative;
    top: 50%;
    left: 30%;
    transition-duration: 0.2s;

    &-ball {
      @include circle(32px, #2f2e41);
      position: relative;
      top: 50%;
      left: 30%;
    }
  }

  &-hand {
    position: relative;
    background-color: #2f2e41;
    width: 80px;
    height: 24px;
    border-radius: 50%;

    &.left {
      left: -48px;
      top: 6px;
    }
    &.right {
      left: 164px;
      top: 12px;
      transform: rotateZ(45deg);
    }
  }
}

.page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  flex-direction: column;
  @extend %flex-center;

  &-title {
    transition-duration: 0.3s;
    font-size: 5em;
    word-spacing: 6px;
    z-index: 1;
  }

  &-img {
    transition-duration: 0.3s;
    width: 80%;
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
