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
const setRoutesConfig = () => {
  routesStore.setBreadcrumb(['首頁'])
  routesStore.setCurrentNavigation(null)
}
onMounted(() => {
  setRoutesConfig()
})

</script>

<template>
  <div class="side-container">
    <RouterLink to="/home" class="side-logo" @click="setRoutesConfig()">
      <slot name="logo">
        <div>LOGO</div>
      </slot>
    </RouterLink>

    <div class="side-nav">
      <NavigationView :router="showRoutes"></NavigationView>
    </div>

    <div class="side-footer">
      <slot name="footer">
        <div>FOOTER</div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side {
  &-container {
    width: $nav-lg-width;
    height: 100%;
    background-color: $system-bg-color;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    transition-duration: 0.3s;
    will-change: width margin-left;

    @media (max-width: 992px) {
      width: $nav-md-width;
    }
    @media (max-width: 576px) {
      width: $nav-xs-width;
      margin-left: -8px;

      .side-logo,
      .side-footer {
        visibility: hidden;
      }

      &:hover {
        width: $nav-md-width;
        margin-left: 0;

        .side-logo,
        .side-footer {
          visibility: visible;
        }
      }
    }
  }

  &-logo {
    padding: 16px 0;
    cursor: pointer;
    color: #fff;
    font-size: 2em;
    will-change: width;
    white-space: nowrap;
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
    white-space: nowrap;
  }
}

</style>