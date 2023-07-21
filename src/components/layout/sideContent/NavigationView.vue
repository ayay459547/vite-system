<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import { ref, inject } from 'vue'
import type { Navigation } from '@/declare/routes'
import type { RouterType } from '@/router/setting'
import { routerTypeIcon } from '@/router/setting'
import SubNavigationView from './SubNavigationView.vue'

import type { IconType } from '@/components'
import { CustomIcon } from '@/components'

const props = defineProps<{
  level1List: Navigation[]
  currentRouteName: string
  breadcrumbName: string[]
}>()

const hook: Hook = inject('hook')
const { i18nTest, i18nTranslate } = hook()

// 第二層路由
const level2IsOpen = ref<boolean>(false)
const level2Nav = ref<Navigation>()
const level2List = ref<Navigation[]>([])

const level2OpenMap = ref<Record<string, boolean>>({})
const changeMap = (name: string): void => {
  level2OpenMap.value[name] = !level2OpenMap.value[name]
}

const setLevel2Router = (level2Router: Navigation): void => {
  const { leaves } = level2Router

  level2IsOpen.value = true
  level2Nav.value = level2Router
  level2List.value = leaves

  leaves.forEach(leaf => {
    if(!Object.hasOwnProperty.call(level2OpenMap.value, leaf.name)) {
      level2OpenMap.value[leaf.name] = true
    }
  })
}

// 路由圖示
const getIcon = (icon:  [IconType, string] | string): [IconType, string] => {
  if (typeof icon === 'string') return ['fas', icon]
  return icon
}
const getLastTypeIcon = (systemType: RouterType[]) => {
  const lastType = systemType[systemType.length - 1]
  return routerTypeIcon[lastType]
}
const getNavTitle = (nav: Navigation | null | undefined): string => {
  if ([null, undefined].includes(nav)) return ''

  if (i18nTest(nav.name)) return i18nTranslate(nav.name)
  return nav.title
}

</script>

<template>
  <div class="nav-container" :class="level2IsOpen ? 'is-open': 'is-clse'">
    <nav class="nav-list level1">
      <template v-for="level1Item in props.level1List" :key="level1Item.name">
        <!-- 有子路由 -->
        <div
          v-if="Object.hasOwnProperty.call(level1Item, 'leaves')"
          class="nav-item"
          @click="setLevel2Router(level1Item)"
        >
          <div
            class="nav-item-left"
            :class="{ active: props.breadcrumbName[0] === level1Item.name }"
          >
            <CustomIcon v-if="level1Item.icon" :icon="getIcon(level1Item.icon)" class="item-icon"></CustomIcon>
            <CustomIcon v-else :icon="getLastTypeIcon(level1Item.systemType)" class="item-icon"></CustomIcon>
            <span class="item-title">{{ getNavTitle(level1Item) }}</span>
          </div>

          <CustomIcon :icon="['fas', 'angle-right']" class="nav-item-right"></CustomIcon>
        </div>

        <!-- 無子路由 -->
        <RouterLink
          v-else
          :to="level1Item.path"
          class="nav-item"
          v-slot="{ navigate }"
        >
          <div
            class="nav-item-left"
            :class="{ active: props.currentRouteName === level1Item.name }"
            @click="navigate"
          >
            <CustomIcon v-if="level1Item.icon" :icon="getIcon(level1Item.icon)" class="item-icon"></CustomIcon>
            <CustomIcon v-else :icon="getLastTypeIcon(level1Item.systemType)" class="item-icon"></CustomIcon>
            <span class="item-title">{{ getNavTitle(level1Item) }}</span>
          </div>

          <div class="nav-item-right"></div>
        </RouterLink>

      </template>
    </nav>

    <div class="nav-list level2">
      <SubNavigationView
        v-model:isOpen="level2IsOpen"
        :title="getNavTitle(level2Nav)"
        :level2-list="level2List"
        :open-map="level2OpenMap"
        :current-route-name="props.currentRouteName"
        :breadcrumb-name="props.breadcrumbName"
        :get-icon="getIcon"
        :get-last-type-icon="getLastTypeIcon"
        :get-nav-title="getNavTitle"
        @change-map="changeMap"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  &-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    transition-duration: 0.35s;
    &.is-open {
      transform: translateX(-$nav-lg-width);

      @media (max-width: 768px) {
        transform: translateX(-$nav-md-width);
      }
    }
    &.is-close {
      transform: translateX(0px);
    }
  }

  &-list {
    min-width: $nav-lg-width;
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition-duration: 0.3s;

    &.level1 {
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      min-width: $nav-md-width;
    }
  }

  &-item {
    width: 100%;
    color: #fff;
    font-weight: 600;
    letter-spacing: 1px;
    background-color: $system-bg-color;
    transition-duration: 0.3s;

    border-radius: 6px;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: lighten($system-bg-color, 5%);

      .item-title {
        transform: translateX(4px);
      }
    }

    &-left {
      display: flex;
      align-items: center;
      gap: 24px;
      flex: 1;
      &.active {
        color: $warning;
      }
      .item-title {
        font-size: 1.4em;
        transform: translateX(0);
        transition-duration: 0.3s;

        @media (max-width: 768px) {
          font-size: 1.3em;
        }
      }
      .item-icon {
        font-size: 1.3em;
        width: 30px;
        height: 30px;
        @extend %flex-center;

        @media (max-width: 768px) {
          font-size: 1.2em;
        }
      }
    }

    &-right {
      font-size: 1.2em;
    }
  }
}
</style>