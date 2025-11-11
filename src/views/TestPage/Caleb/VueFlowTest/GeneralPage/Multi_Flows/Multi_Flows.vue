<script setup lang="ts">
import Test_Flow from './Test_Flow.vue'

</script>

<template>
  <div class="multi-flows-test">
    <Test_Flow />

    <Test_Flow />
  </div>
</template>

<style lang="scss">
.multi-flows-test {
  display:flex;
  height:100%;

  .vue-flow {
      width:100%;
      height:100%
  }
  .vue-flow:first-child {
    border-right:2px solid #333
  }

  .vue-flow__node.dark {
    background:#000;
    color:#fff
  }
}
</style>
