<script setup lang="ts">
import type { PropType } from 'vue'
import { inject, computed } from 'vue'
import { ElSubMenu, ElMenuItem } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import type { Navigation } from '@/declare/routes'
import { useRoutesHook } from '@/lib/lib_routes'
import { defaultModuleType } from '@/i18n/i18n_setting'

const props = defineProps({
  subRoute: {
    type: Object as PropType<Navigation>,
    default: () => {
      return {}
    }
  }
})

const showRoutes = computed(() => {
  return props.subRoute?.leaves ?? []
})

const useHook: UseHook = inject('useHook')
const { i18nTest, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const { getRouteTitle } = useRoutesHook({
  i18nTranslate,
  i18nTest
})

</script>

<template>
  <ElSubMenu :index="props.subRoute.name">
    <template #title>
      <div class="menu-nav-item">
        <span class="menu-nav-title">{{ getRouteTitle(props.subRoute) }}</span>
      </div>
    </template>
    <template v-for="route in showRoutes" :key="`sub-nav-${route.name}`">
      <ElNavigation
        v-if="Array.isArray(route.leaves)"
        :sub-route="route"
        :key="`ElNavigation-${route.name}`"
      ></ElNavigation>
      <ElMenuItem v-else :index="route.name" :key="`ElMenuItem-${route.name}`">
        <div class="menu-nav-item">
          <span class="menu-nav-title">
            {{ getRouteTitle(route) }}
          </span>
        </div>
      </ElMenuItem>
    </template>
  </ElSubMenu>
</template>

<style lang="scss" scoped>

</style>
