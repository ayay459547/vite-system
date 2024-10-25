<script setup lang="ts">
import type { PropType } from 'vue'
import { nextTick } from 'vue'

import type { Navigation } from '@/declare/routes'
import type { AuthData } from '@/declare/hook' // 全域功能類型
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'
import { isEmpty } from '@/lib/lib_utils' // 工具

import MenuContent from './MenuContent.vue'

const props = defineProps({
  isShow: {
    type: Boolean as PropType<boolean>,
    default: false
  },
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

const init = async () => {
  await nextTick()
  if (isEmpty(props.currentNavigation)) return
}

defineExpose({
  init
})
</script>

<template>
  <div class="layout-wrapper">
    <div class="layout-menu">
      <MenuContent
        :show-routes="props.showRoutes"
        :current-navigation="props.currentNavigation"
        :current-route-name="props.currentRouteName"
        :auth-data="props.authData"
        :breadcrumb-name="props.breadcrumbName"
        :breadcrumb-title="props.breadcrumbTitle"
        @logout="emit('logout')"
        @preference="emit('preference')"
      >
        <template #logo>
          <slot name="logo"></slot>
        </template>
      </MenuContent>
    </div>

    <div class="layout-view">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  &-wrapper {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    position: relative;
    gap: 8px;
  }

  &-menu {
    width: 100%;
    height: fit-content;
  }

  &-view {
    width: 100%;
    height: calc(100% - 64px);
  }
}
</style>
