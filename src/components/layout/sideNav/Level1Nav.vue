<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import routes from '@/router/routes'

const showRoutes:ComputedRef<RouteRecordRaw[]> = computed(() => {
  return routes ?? []
})

const level1NavList: typeof showRoutes = computed(() => {
  return showRoutes.value.map(route => {
    return {
      ...route
    }
  })
})

</script>

<template>
  <div class="side-container">
    <RouterLink to="/" class="side-logo">
      <img src="@/assets/images/menu-logo-iPASP.png" alt="logo">
    </RouterLink>

    <nav class="side-nav-list">
      <RouterLink
        v-for="navItem in level1NavList"
        :key="navItem.name"
        :to="navItem.path"
        class="side-nav-item"
      >
        {{ navItem.meta.title }}
      </RouterLink>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
$bg-color: #535353;
$nav-width: 300px;

.side {
  &-container {
    width: $nav-width;
    height: 100%;
    background-color: $bg-color;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  &-logo {
    padding: 16px 0;
    cursor: pointer;
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