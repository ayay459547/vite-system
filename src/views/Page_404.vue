<script setup lang="ts">

</script>

<template>
  <div class="page">
    <h1 v-fixed="{ text: '123' }" class="page-title">4 0 4</h1>
    <img
      class="page-img"
      src="@/assets/images/page404.svg"
      alt="login"
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
    font-size: 8em;
    word-spacing: 6px;
    z-index: 1;
  }

  &-img {
    width: 80%;
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>