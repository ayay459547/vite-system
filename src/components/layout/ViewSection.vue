<script setup>
// import { RouterView } from 'vue-router'

</script>

<template>
  <div class="view-wrapper">
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
    padding: 12px;
    background-color: #e6e6e6;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    border-radius: 6px;
    background-color: #fff;
    box-sizing: border-box;
  }
}
</style>