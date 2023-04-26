<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { RouterTree } from '@/declare/router'
import { computed } from 'vue'
import { routes, getRouterLeaf } from '@/router/routes'
import NavigationView from './NavigationView.vue'

const level1Routes: ComputedRef<RouterTree[]> = computed(() => {
  return getRouterLeaf(routes, 1, true)
})

const showRoutes: typeof level1Routes = computed(() => {
  return level1Routes.value.map(route => {
    return {
      ...route
    }
  })
})

</script>

<template>
  <div class="side-container">
    <RouterLink to="/home" class="side-logo">
      <div>LOGO</div>
    </RouterLink>

    <nav class="side-nav">
      <NavigationView :router="showRoutes"></NavigationView>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
$bg-color: #535353;
$nav-width: 260px;

.side {
  &-container {
    width: $nav-width;
    height: 100%;
    background-color: $bg-color;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    transition-duration: 0.3;
  }

  &-logo {
    padding: 16px 0;
    cursor: pointer;
    color: #fff;
    font-size: 2em;
  }

  &-nav {
    width: calc(100% - 32px);
    height: 100%;
  }
}

</style>