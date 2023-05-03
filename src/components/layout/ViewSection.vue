<script setup lang="ts">
import { ref } from 'vue'
import HistoryNavigation from './HistoryNavigation.vue'

const isFullScreen = ref(false)

const toggleFullScreen = () => {
  if (isFullScreen.value) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullScreen.value = false
    }
  } else {
    document.documentElement.requestFullscreen()
    isFullScreen.value = true
  }
}

</script>

<template>
  <div class="view-wrapper">
    <div class="view-history">
      <HistoryNavigation></HistoryNavigation>
      <AdvantButton :icon-name="isFullScreen ? 'down-left-and-up-right-to-center' : 'expand'" @click="toggleFullScreen">
        <div class="i-pt-xxs">{{ isFullScreen ? '取消全螢幕' : '切換全螢幕' }}</div>
      </AdvantButton>
    </div>
    <main class="view-container">
      <slot></slot>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.view {
  &-wrapper {
    width: 100%;
    height: 100%;
    padding: 0 12px 12px;
    background-color: #e6e6e6;
    flex-direction: column;
    @extend %flex-center;
  }
  &-history {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
  &-container {
    width: 100%;
    flex: 1;
    overflow: auto;
    border-radius: 6px;
    background-color: #fff;
    box-sizing: border-box;
  }
}
</style>