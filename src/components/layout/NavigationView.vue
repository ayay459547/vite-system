<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = defineProps({
  router: {
    type: Array,
    required: true
  }
})

const level1NavList = computed(() => {
  return props.router
})
</script>

<template>
  <div class="nav-container">
    <nav class="nav-list">
      <div
          v-for="navItem in level1NavList"
          :key="navItem.name"
          class="nav-item"
        >
          {{ navItem.title }}
        </div>

        <!-- <RouterLink
          v-for="navItem in level1NavList"
          :key="navItem.name"
          :to="navItem.path"
          class="side-nav-item"
        >
          {{ navItem.title }}
        </RouterLink> -->
    </nav>
  </div>
</template>

<style lang="scss" scoped>
$bg-color: #535353;

.nav {
  &-container {
    width: 100%;
    height: 100%;
  }

  &-list {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-item {
    width: inherit;
    font-size: 1.5em;
    padding: 12px 16px;
    color: #fff;
    background-color: $bg-color;
    transition-duration: 0.3s;
    border-radius: 6px;

    &:hover {
      background-color: #606060;
    }
  }
}
</style>