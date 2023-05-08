<script setup lang="ts">
import { inject } from 'vue'

const locale = inject('locale')

</script>

<template>
  <div class="nav-1-1-1">
    <h1>nav-1-1-1</h1>
    <h1>{{ locale }}</h1>
  </div>
</template>

<style lang="scss" scoped>
.nav-1-1-1 {
  width: 100%;
  height: 100%;
}
</style>