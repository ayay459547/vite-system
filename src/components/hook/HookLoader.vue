<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
const massage = ref('Loading')

const minTime = 500
const openTime = ref<number | null>(null)

interface Expose {
  openLoader: (message: string) => void
  closeLoader: () => void
}

defineExpose<Expose>({
  openLoader: (message: string) => {
    massage.value = message

    if (isOpen.value) return
    isOpen.value = true
    openTime.value = Date.now()
  },
  // 至少大於一段時間才能關閉 不然會閃一下
  closeLoader: () => {
    if (!isOpen.value) return

    if (Date.now() >= openTime.value + minTime) {
      isOpen.value = false

    } else {
      setTimeout(() => {
        isOpen.value = false
      }, minTime)
    }
  }
})

</script>

<template>
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
  </div>
</template>

<style lang="scss" scoped>
.loader {
  &-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: $loading-index;
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

  &-circle{
    width: 20px;
    height: 20px;
    position: absolute;
    border-radius: 50%;
    background-color: #363636;
    left: 15%;
    transform-origin: 50%;
    animation: circle .5s alternate infinite ease;
    visibility: hidden;
  }
  @keyframes circle {
    0%{
      visibility: visible;
      top: 60px;
      height: 5px;
      border-radius: 50px 50px 25px 25px;
      transform: scaleX(1.7);
    }
    40%{
      height: 20px;
      border-radius: 50%;
      transform: scaleX(1);
    }
    100%{
      top: 0;
    }
  }
  &-circle:nth-child(2){
    left: 45%;
    animation-delay: .2s;
  }
  &-circle:nth-child(3){
    left: auto;
    right: 15%;
    animation-delay: .3s;
  }

  &-shadow{
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
    animation: shadow .5s alternate infinite ease;
  }
  @keyframes shadow{
    0%{
      transform: scaleX(1.5);
    }
    40%{
      transform: scaleX(1);
      opacity: .7;
    }
    100%{
      transform: scaleX(.2);
      opacity: .4;
    }
  }
  &-shadow:nth-child(4){
    left: 45%;
    animation-delay: .2s
  }
  &-shadow:nth-child(5){
    left: auto;
    right: 15%;
    animation-delay: .3s;
  }

  &-loading {
    font-family: 'Lato';
    font-size: 1.5em;
    letter-spacing: 12px;
    color: #464646;
    white-space: nowrap;
  }
}
</style>