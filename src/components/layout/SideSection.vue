<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { RouterTree } from '@/declare/router'
import { computed } from 'vue'
import { routes, getRouterLeaf } from '@/router/routes'

// const _routes = [
//   {
//     path: '/',
//     name: 'home',
//     title: '首頁'
//   },
//   {
//     path: '/about',
//     name: 'about',
//     title: '關於'
//   }
// ]

const level1Routes: ComputedRef<RouterTree[]> = computed(() => {
  return getRouterLeaf(routes, 1, false)
})

const level2Routes: ComputedRef<RouterTree[]> = computed(() => {
  return getRouterLeaf(routes, 2, true)
})

console.log(level2Routes)

const level1NavList: typeof level1Routes = computed(() => {
  return level1Routes.value.map(route => {
    return {
      ...route
    }
  })
})

</script>

<template>
  <div class="side-container">
    <RouterLink to="/" class="side-logo">
      <div>LOGO</div>
    </RouterLink>

    <nav class="side-nav-list">
      <div
        v-for="navItem in level1NavList"
        :key="navItem.name"
        class="side-nav-item"
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
    &-list {
      width: calc(100% - 32px);
      height: 100%;

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
}

</style>