<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type { Navigation } from '@/declare/routes'
import SubNavigationView from './SubNavigationView.vue'
import { routesHook } from '@/lib/lib_routes'
import { CustomIcon } from '@/components'

import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'

const props = defineProps<{
  level1List: Navigation[]
  currentRouteName: CurrentRouteName
}>()

const { getRouteIcon, getRouteTitle } = routesHook()

// 第二層路由
const level2IsOpen = ref<boolean>(false)
const level2Nav = shallowRef<Navigation>()
const level2List = shallowRef<Navigation[]>([])

// 第二層子路由是否打開
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
    if(!Object.prototype.hasOwnProperty.call(level2OpenMap.value, leaf.name)) {
      level2OpenMap.value[leaf.name] = true
    }
  })
}

const setOpen = (value: boolean) => {
  level2IsOpen.value = value
}

defineExpose({
  setLevel2Router,
  setOpen
})

</script>

<template>
  <div class="nav-container" :class="level2IsOpen ? 'is-open': 'is-clse'">
    <nav class="nav-list level1">
      <template v-for="level1Item in props.level1List" :key="level1Item.name">
        <!-- 有子路由 -->
        <div
          v-if="Object.prototype.hasOwnProperty.call(level1Item, 'leaves')"
          class="nav-item"
          @click="setLevel2Router(level1Item)"
        >
          <div
            class="nav-item-left"
            :class="{ active: props.currentRouteName.level1 === level1Item.name }"
          >
            <CustomIcon :icon="getRouteIcon(level1Item)" class="item-icon"></CustomIcon>
            <span class="item-title">{{ getRouteTitle(level1Item) }}</span>
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
            :class="{ active: props.currentRouteName.level1 === level1Item.name }"
            @click="navigate"
          >
            <CustomIcon :icon="getRouteIcon(level1Item)" class="item-icon"></CustomIcon>
            <span class="item-title">{{ getRouteTitle(level1Item) }}</span>
          </div>

          <div class="nav-item-right"></div>
        </RouterLink>

      </template>
    </nav>

    <div class="nav-list level2">
      <SubNavigationView
        v-model:isOpen="level2IsOpen"
        :title="getRouteTitle(level2Nav)"
        :level2-list="level2List"
        :open-map="level2OpenMap"
        :current-route-name="props.currentRouteName"
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

    white-space: nowrap;
    text-overflow: ellipsis;

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