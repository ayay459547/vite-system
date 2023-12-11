<script setup lang="ts">
import MenuContent from './MenuContent.vue'
import SubMenu from './SubMenu.vue'

import type { Navigation } from '@/declare/routes'
import { isEmpty } from '@/lib/lib_utils'
import type { AuthData } from '@/stores/api'
import { ref, shallowRef, nextTick } from 'vue'

import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'

const props = defineProps<{
  isShow: boolean

  showRoutes: Navigation[]
  currentNavigation: Navigation
  currentRouteName: CurrentRouteName

  historyIsOpen: boolean
  authData: AuthData
  breadcrumbTitle: string[]
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'changeHistory', value: boolean): void
  (e: 'preferences'): void
}>()

const onChangeHistory = (v: boolean) => {
  emit('changeHistory', v)
}

// 第二層路由
const level2Nav = shallowRef<Navigation>()
const level2List = shallowRef<Navigation[]>([])

const subMenuRef = ref()

const setLevel2Router = async (level2Router: Navigation) => {
  if (isEmpty(level2Router)) return

  const { leaves } = level2Router
  level2Nav.value = level2Router
  level2List.value = leaves ?? []

  await nextTick()
  subMenuRef.value.setOpen(true)
}

const init = async () => {
  await nextTick()
  if (isEmpty(props.currentNavigation)) return

  const currentLevel1 = props.showRoutes.find(level1Item => {
    return level1Item.name === props.currentRouteName.level1
  })
  setLevel2Router(currentLevel1)

  const tempLevel2List = currentLevel1?.leaves ?? []
  const currentLevel2 = tempLevel2List.find(level2Item => {
    return level2Item.name === props.currentRouteName.level2
  })

  subMenuRef.value.clearLevel3List()
  subMenuRef.value.setLevel3Router(currentLevel2)
}

// 回首頁
const onChangeRouter = async () => {
  await nextTick()
  level2List.value = []
  subMenuRef.value.clearLevel3List()
}

defineExpose({
  init
})

</script>

<template>
  <div class="layout-wrapper">
    <div class="layout-menu level1">
      <MenuContent
        :show-routes="props.showRoutes"
        :current-navigation="props.currentNavigation"
        :current-route-name="props.currentRouteName"
        :history-is-open="props.historyIsOpen"
        :auth-data="props.authData"
        :breadcrumb-title="props.breadcrumbTitle"
        @change-history="onChangeHistory"
        @logout="emit('logout')"
        @preferences="emit('preferences')"
        @set-level2-router="setLevel2Router"
        @change-router="onChangeRouter"
      >
        <template #logo>
          <slot name="logo"></slot>
        </template>
        <template #menu-left>
          <slot name="menu-left"></slot>
        </template>
        <template #menu-right>
          <slot name="menu-right"></slot>
        </template>
      </MenuContent>

      <div class="level2">
        <SubMenu
          ref="subMenuRef"
          :current-navigation="props.currentNavigation"
          :level2-nav="level2Nav"
          :level2-list="level2List"
          :current-route-name="props.currentRouteName"
        />
      </div>
    </div>


    <div class="layout-view">
      <slot name="content"></slot>
    </div>

    <slot></slot>
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
    background-color: lighten($system-bg-color, 60%);
  }

  &-menu {
    width: 100%;
    height: fit-content;
  }

  &-view {
    width: 100%;
    height: 100%;
    flex: 1;
  }
}
</style>
