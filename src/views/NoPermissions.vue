<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import type { ResizeObserverCallback } from '@/lib/throttle'
import throttle from '@/lib/throttle'

const imgStyle = ref('')
const titleStyle = ref('')

const setImgStyle = (e: MouseEvent) => {
  const { clientX, clientY } = e
  const diffX = centerPoint.x - clientX
  const diffY = centerPoint.y - clientY

  imgStyle.value = `transform: translateX(${diffX / 5}px) translateY(${diffY / 5}px);`
  titleStyle.value = `transform: translateX(${diffX / 12}px) translateY(${diffY / 12}px);`
}
const throttleSetImgStyle = throttle(setImgStyle, 100) as (payload: MouseEvent) => void

const container = ref(null)
const centerPoint = reactive({
  x: 0, y: 0
})

const ROcallback = throttle((entries) => {
  entries.forEach((entry) => {
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
  <div ref="container" class="page" @mousemove="throttleSetImgStyle">
    <h1 class="page-title" :style="titleStyle">無此權限</h1>
    <img
      class="page-img"
      src="@/assets/images/page404.svg"
      alt="404"
      :style="imgStyle"
    />
  </div>
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
    transition-duration: 0.3s;
    font-size: 6em;
    word-spacing: 6px;
    z-index: 1;
  }

  &-img {
    transition-duration: 0.3s;
    width: 80%;
    position: absolute;
    bottom: 32px;
    right: 32px;
  }
}
</style>