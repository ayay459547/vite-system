<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, inject } from 'vue'
import { ElMenu, ElMenuItem } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import type { Navigation } from '@/declare/routes'
import type { AuthData } from '@/declare/hook' // 全域功能類型
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'
import { useRoutesHook } from '@/lib/lib_routes'
import { defaultModuleType } from '@/i18n/i18n_setting'
import MenuBreadcrumb from '@/components/layout/Menu/MenuBreadcrumb.vue'
import MenuUser from '@/components/layout/Menu/MenuUser.vue'

import ElNavigation from './ElNavigation.vue'

const props = defineProps({
  showRoutes: {
    type: Array as PropType<Navigation[]>,
    default: () => {
      return []
    }
  },
  currentNavigation: {
    type: Object as PropType<Navigation>,
    default: () => {
      return {}
    }
  },
  currentRouteName: {
    type: Object as PropType<CurrentRouteName>,
    default: () => {
      return {
        level1: '',
        level2: '',
        level3: ''
      }
    }
  },
  authData: {
    type: Object as PropType<AuthData>,
    default: () => {
      return {
        user: {},
        role: {},
        roleFunction: [],
        groups: []
      } as AuthData
    }
  },
  breadcrumbName: {
    type: Array as PropType<string[]>,
    default: () => {
      return []
    }
  },
  breadcrumbTitle: {
    type: Array as PropType<string[]>,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits(['logout', 'preference'])

const useHook: UseHook = inject('useHook')
const { i18nTest, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const { getRouteTitle } = useRoutesHook({
  i18nTranslate,
  i18nTest
})

const activeIndex = computed(() => {
  return props.currentNavigation?.name ?? ''
})

</script>

<template>
  <div class="menu-container">
    <div class="menu-logo">
      <slot name="logo"></slot>
    </div>

    <div class="menu-main">
      <ElMenu
        v-if="Array.isArray(props.showRoutes) && props.showRoutes.length > 0"
        :default-active="activeIndex"
        key="ElMenu"
        router
        class="menu-main-nav"
        mode="horizontal"
      >
        <template v-for="route in props.showRoutes" :key="`nav-${route.name}`">
          <ElNavigation
            v-if="Array.isArray(route.leaves)"
            :sub-route="route"
            :key="`ElNavigation-${route.name}`"
          ></ElNavigation>
          <ElMenuItem v-else :index="route.name" :key="`ElMenuItem-${route.name}`">
            <div class="menu-nav-item">
              <span class="menu-nav-title">{{ getRouteTitle(route) }}</span>
            </div>
          </ElMenuItem>
        </template>
      </ElMenu>
    </div>

    <div class="menu-breadcrumb">
      <MenuBreadcrumb
        :breadcrumb-name="props.breadcrumbName"
        :breadcrumb-title="props.breadcrumbTitle"
        text-align="end"
      />
    </div>

    <div class="menu-user">
      <MenuUser
        :auth-data="props.authData"
        @logout="emit('logout')"
        @preference="emit('preference')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>

.menu {
  &-container {
    width: 100%;
    height: 64px;
    min-height: 64px;
    max-height: 64px;
    overflow: hidden;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 0 8px;

    font-size: 1.1em;
    background-color: var(--i-color-menu) !important;
    color: var(--i-color-menu-color) !important;

    --el-menu-bg-color: var(--i-color-menu);
    --el-menu-text-color: var(--i-color-menu-color);
    --el-menu-active-color: var(--el-color-warning);
    --el-menu-base-level-padding: 12px;
    --el-menu-item-font-size: 1em;
  }

  &-logo {
    flex: none;
    min-width: fit-content;
  }

  &-main {
    flex: auto;
    width: 100%;
    overflow: hidden;

    &-nav {
      width: 100%;
      overflow: hidden;
    }
  }

  &-breadcrumb {
    flex: none;
    width: fit-content;
    align-content: center;
  }

  &-user {
    flex: none;
    width: fit-content;
  }
}
</style>
