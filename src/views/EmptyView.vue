<script setup lang="ts">
</script>

<template>
  <div class="empty">
    <h1 class="empty-title">功能開發中，敬啟期待</h1>
    <img
      class="empty-img"
      src="@/assets/images/empty.svg"
      alt="login"
    />
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
    font-size: 3em;
    word-spacing: 4px;
    z-index: 1;
  }

  &-img {
    width: 80%;
    height: 80%;
    position: absolute;
    opacity: 0.8;
  }
}
</style>