<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import type { Navigation } from '@/declare/routes'
import { useRoutesStore } from '@/stores/routes'

// import { CustomIcon } from '@/components'
import FeatureTree from './FeatureTree.vue'

const routesStore = useRoutesStore()

const level1Routes: ComputedRef<Navigation[]> = computed(() => {
  return routesStore.navigationRoutes
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
  <div class="home">
    <FeatureTree :tree="showRoutes"></FeatureTree>
  </div>
</template>

<style lang="scss" scoped>
.home {
  padding: 16px;
}
</style>