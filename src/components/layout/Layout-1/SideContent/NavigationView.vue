<script setup lang="ts">
import { ref, shallowRef, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import type { Navigation } from '@/declare/routes'
import { useRoutesHook } from '@/lib/lib_routes'
import { CustomIcon } from '@/components'
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'

import SubNavigationView from './SubNavigationView.vue'

const useHook: UseHook = inject('useHook')
const { i18nTest, i18nTranslate } = useHook({
  i18nModule: 'system'
})

const props = defineProps<{
  level1List: Navigation[]
  currentRouteName: CurrentRouteName
}>()

const { getRouteIcon, getRouteTitle } = useRoutesHook({
  i18nTranslate,
  i18nTest
})

// 第二層路由
const level2IsOpen = ref<boolean>(false)
const level2Nav = shallowRef<Navigation>()
const level2List = shallowRef<Navigation[]>([])

// 第二層子路由是否打開
const level2OpenMap = ref<Record<string, boolean>>({})
const changeMap = (name: string): void => {
  level2OpenMap.value[name] = !level2OpenMap.value[name]
}

// 第二層子路由預設全部打開
const setLevel2Router = (level2Router: Navigation): void => {
  console.log('open level2')
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
  <div class="nav-container">
    <!-- 模組 -->
    <div class="nav-level1-wrapper" :class="level2IsOpen ? 'is-close' : 'is-open'">
      <nav class="nav-level1-container nav-list">
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
    </div>
    <!-- 分類 + 子功能 -->
    <div class="nav-level2-wrapper" :class="level2IsOpen ? 'is-open' : 'is-close'">
      <div class="nav-level2-container nav-list">
        <SubNavigationView
          v-model:level2-is-open="level2IsOpen"
          :title="getRouteTitle(level2Nav)"
          :level2-list="level2List"
          :open-map="level2OpenMap"
          :current-route-name="props.currentRouteName"
          @change-map="changeMap"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../Layout-1.scss';

@mixin level1Style ($is-open) {
  @if ($is-open) {
    // 展開的寬度 - 左右
    max-width: $nav-width - $nav-padding * 2;

    &:hover {
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px #dedede;
      }
      &::-webkit-scrollbar-thumb {
        background: #dadada80;
      }
    }
  } @else {
    // 縮起來的寬度 - 左右
    max-width: $side-width - $nav-padding * 2;
  }
};

.nav {
  &-container {
    width: 100%;
    height: 100%;
    padding: 0 4px;
    position: relative;
  }

  &-level1 {
    &-wrapper {
      left: 0;
      top: 0;
      z-index: 2;
      position: absolute;
      will-change: max-width;
      transition-duration: 0.3s;
      overflow: hidden {
        y: auto;
      };
      width: 100%;
      height: 100%;
      padding: 0 2px;

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px #ffffff00;
      }
      &::-webkit-scrollbar-thumb {
        background: #ffffff00;
      }

      &.is-close {
        @include level1Style(false);
      }
      &.is-open {
        @include level1Style(true);
      }
    }
    &-container {
      width: 100%;
      // 展開的寬度 - 左右
      min-width: $nav-width - $nav-padding * 2;
      height: fit-content;
    }
  }
  &-level2 {
    &-wrapper {
      left: $side-width - $nav-padding * 2;
      top: 0;
      z-index: 1;
      position: absolute;
      will-change: max-width;
      transition-duration: 0.3s;
      overflow: hidden {
        y: auto;
      };
      width: 100%;
      height: 100%;
      &.is-close {
        opacity: 0;
      }
      &.is-open {
        opacity: 1;
      }
    }
    &-container {
      // 選單全部寬度 - 第一階選單縮起來的寬度
      min-width: $nav-width - $side-width;
      height: fit-content;
    }
  }

  &-list {
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition-duration: 0.3s;
  }

  &-item {
    width: 100%;
    min-height: 54px;
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

    overflow: hidden;
    gap: 8px;

    &:hover {
      background-color: lighten($system-bg-color, 5%);

      .item-title {
        transform: translateX(4px);
      }
    }

    &-left {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 24px;
      flex: 1;
      overflow: hidden;
      &.active {
        color: $warning;
      }
      .item-title {
        font-size: 1.4em;
        transform: translateX(0);
        transition-duration: 0.3s;
        width: 100%;
      }
      .item-icon {
        font-size: 1.3em;
        width: 30px;
        height: 30px;
        @extend %flex-center;
      }
    }

    &-right {
      font-size: 1.2em;
    }
  }
}
</style>
