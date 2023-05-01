<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { computed, onMounted } from 'vue'

import type { Navigation } from '@/declare/router'
import { refactorRoutes } from '@/lib/routes'
import routes from '@/router/routes'
import NavigationView from './NavigationView.vue'
import { useRoutesStore } from '@/stores/routes'

const level1Routes: ComputedRef<Navigation[]> = computed(() => {
  return refactorRoutes<Navigation>((leafNode, parentsNode) => {
    const nextNode: Navigation = {
      ...leafNode
    }
    if (parentsNode === null) {
      nextNode.breadcrumb = [leafNode.title]
    } else{
      nextNode.breadcrumb = [...parentsNode.breadcrumb, leafNode.title]
    }
    return nextNode
  }, routes)
})

const showRoutes: typeof level1Routes = computed(() => {
  return level1Routes.value.map(route => {
    return {
      ...route
    }
  })
})

const routesStore = useRoutesStore()
const setHome = () => {
  routesStore.setBreadcrumb(['首頁'])
  routesStore.setCurrentNavigation(null)
}
onMounted(() => {
  setHome()
})

const system = (import.meta as any).env.VITE_API_SYSTEM_TYPE
const version = (import.meta as any).env.VITE_API_VERSION

</script>

<template>
  <div class="side-container">
    <RouterLink to="/home" class="side-logo" @click="setHome()">
      <div>LOGO</div>
    </RouterLink>

    <div class="side-nav">
      <NavigationView :router="showRoutes"></NavigationView>
    </div>

    <div class="side-version">
      {{ `${system} version ${version}` }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side {
  &-container {
    width: $nav-width;
    height: 100%;
    background-color: $side-bg-color;
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
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &-version {
    border-radius: 6px;
    padding: 6px 12px;
    margin: 6px;
    background-color: #e6e6e6;
  }
}

</style>