<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { computed, onMounted } from 'vue'

import type { Navigation } from '@/declare/routes'
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

</script>

<template>
  <div class="side-container">
    <RouterLink to="/home" class="side-logo" @click="setHome()">
      <slot name="logo">
        <div>LOGO</div>
      </slot>
    </RouterLink>

    <div class="side-nav">
      <NavigationView :router="showRoutes"></NavigationView>
    </div>

    <div class="side-footer">
      <slot name="footer">
        <div>Footer</div>
      </slot>
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

  &-footer {
    border-radius: 6px;
    padding: 6px 12px;
    margin: 6px;
    background-color: #e6e6e6;
  }
}

</style>