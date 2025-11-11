<script setup lang="ts">
// import { Background as FlowBackground } from '@vue-flow/background'
import { FlowBackground } from '@/components/chart'

</script>

<template>
  <div class="dropzone-background">
    <FlowBackground :size="2" :gap="20" pattern-color="#BDBDBD" />

    <div class="overlay">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropzone-background {
  position: relative;
  height: 100%;
  width: 100%;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    pointer-events: none;
  }
}
</style>
