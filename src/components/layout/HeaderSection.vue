<script setup lang="ts">
const currPath = '選單1 / 選單1-1 / 選單1-1-1'
</script>

<template>
  <div class="header-container">
    <div class="header-path">
      {{ currPath }}
    </div>
    <div class="header-user">
      <AdvantIcon></AdvantIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  &-container {
    width: 100%;
    height: 80px;
    background-color: #e6e6e6;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    font-size: 1.2em;
  }

  &-user {
    width: 30px;
    height: 30px;
    border: 1px solid #e6e6e6;
    border-radius: 6px;
  }
}
</style>