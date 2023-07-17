<script setup lang="ts">

</script>

<template>
  <div class="home">
    home
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  padding: 16px;

  &-search {
    width: 100%;
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }

  &-tree {
    height: calc(100% - 52px);
    overflow: auto;
  }
}
</style>