<script setup lang="ts">
import { ref, nextTick } from 'vue'

export declare namespace Custom {}

export declare namespace Props {}

export declare namespace Emits {}

export declare namespace Expose {
  type OpenLoader = (message: string) => void
  type CloseLoader = () => void
}

const isOpen = ref(false)
const massage = ref('Loading')

const minTime = 500
const openTime = ref<number | null>(null)

const barPercentage = ref(0)

let timer = null

const close = async () => {
  barPercentage.value = 100
  await nextTick()

  setTimeout(() => {
    isOpen.value = false
    if (timer) clearInterval(timer)
  }, 200)
}

const openLoader: Expose.OpenLoader = (message: string) => {
  barPercentage.value = 0
  massage.value = message

  if (isOpen.value) return
  isOpen.value = true
  openTime.value = Date.now()

  timer = setInterval(() => {
    if (barPercentage.value < 90) {
      barPercentage.value += Math.floor(Math.random() * 10)
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

const closeLoader: Expose.CloseLoader = () => {
  if (!isOpen.value) return

  if (Date.now() >= openTime.value + minTime) {
    close()
  } else {
    setTimeout(() => {
      close()
    }, minTime)
  }
}

defineExpose({
  openLoader,
  // 至少大於一段時間才能關閉 不然會閃一下
  closeLoader
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-show="isOpen" class="loader-wrapper">
        <div class="loader-container">
          <div class="loader-circle"></div>
          <div class="loader-circle"></div>
          <div class="loader-circle"></div>
          <div class="loader-shadow"></div>
          <div class="loader-shadow"></div>
          <div class="loader-shadow"></div>
          <div class="loader-loading">{{ massage }}</div>
        </div>
        <div class="loader-bar" :style="`width: calc(${barPercentage}% - 2px)`"></div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.loader {
  &-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--i-z-index-loading);
    cursor: default;
    background-color: #efefefa8;
  }
  &-container {
    width: 200px;
    height: 120px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
  }

  &-circle {
    width: 20px;
    height: 20px;
    position: absolute;
    border-radius: 50%;
    background-color: #363636;
    left: 15%;
    transform-origin: 50%;
    animation: circle 0.5s alternate infinite ease;
    visibility: hidden;
  }
  @keyframes circle {
    0% {
      visibility: visible;
      top: 60px;
      height: 5px;
      border-radius: 50px 50px 25px 25px;
      transform: scaleX(1.7);
    }
    40% {
      height: 20px;
      border-radius: 50%;
      transform: scaleX(1);
    }
    100% {
      top: 0;
    }
  }
  &-circle:nth-child(2) {
    left: 45%;
    animation-delay: 0.2s;
  }
  &-circle:nth-child(3) {
    left: auto;
    right: 15%;
    animation-delay: 0.3s;
  }

  &-shadow {
    width: 20px;
    height: 4px;
    border-radius: 50%;
    background-color: #000000d0;
    position: absolute;
    top: 63px;
    transform-origin: 50%;
    z-index: -1;
    left: 15%;
    filter: blur(1px);
    animation: shadow 0.5s alternate infinite ease;
  }
  @keyframes shadow {
    0% {
      transform: scaleX(1.5);
    }
    40% {
      transform: scaleX(1);
      opacity: 0.7;
    }
    100% {
      transform: scaleX(0.2);
      opacity: 0.4;
    }
  }
  &-shadow:nth-child(4) {
    left: 45%;
    animation-delay: 0.2s;
  }
  &-shadow:nth-child(5) {
    left: auto;
    right: 15%;
    animation-delay: 0.3s;
  }

  &-loading {
    font: {
      family: 'Lato';
      size: 1.5em;
    }
    letter-spacing: 12px;
    color: #464646;
    white-space: nowrap;
  }

  &-bar {
    height: 10px;
    border-radius: 4px;
    background-color: var(--i-color-system);
    position: absolute;
    bottom: 1px;
    left: 1px;
    transition-duration: 0.3s;
  }
}
</style>
