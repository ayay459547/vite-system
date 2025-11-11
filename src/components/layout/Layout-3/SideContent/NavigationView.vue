<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, shallowRef, inject } from 'vue'
import type { NavigationFailure } from 'vue-router'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import type { Navigation } from '@/types/types_routes'
import { useRoutesHook } from '@/lib/lib_routes'

import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'
import { defaultModuleType } from '@/declare/declare_i18n'
import { isEmpty } from '@/lib/lib_utils' // 工具

import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue'
import CustomScrollbar from '@/components/feature/CustomScrollbar/CustomScrollbar.vue'
import CustomTooltip from '@/components/feature/CustomTooltip/CustomTooltip.vue'
import SubNavigationView from './SubNavigationView.vue'

const useHook = inject('useHook') as UseHook
const { i18nTest, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps({
  level1List: {
    type: Array as PropType<Navigation[]>,
    default: () => []
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
  }
})

type Navigate = (e?: MouseEvent) => Promise<void | NavigationFailure>
const onRouterLinkClick = (navigate: Navigate) => {
  navigate()
}

const { getRouteIcon, getRouteTitle } = useRoutesHook({
  i18nTranslate,
  i18nTest
})

// 第二層路由
const isLevel2Open = ref<boolean>(false)
const level2Nav = shallowRef<Navigation>()
const level2List = shallowRef<Navigation[]>([])

// 第二層子路由是否打開
const level2OpenMap = ref<Record<string, boolean>>({})
const changeMap = (name: string): void => {
  level2OpenMap.value[name] = !level2OpenMap.value[name]
}

// 第二層子路由預設全部打開
const setLevel2Router = (level1Router: Navigation): void => {
  const { leaves } = level1Router
  const _leaves = leaves ?? []

  isLevel2Open.value = true
  level2Nav.value = level1Router
  level2List.value = _leaves

  _leaves.forEach(leaf => {
    if (!Object.prototype.hasOwnProperty.call(level2OpenMap.value, leaf.name)) {
      level2OpenMap.value[leaf.name] = true
    }
  })
}
// 切換第二層是否打開
const setOpen = (value: boolean) => {
  isLevel2Open.value = value
}
// 點擊麵包屑切換第二層路由
const breadCrumbSetLevel2 = (breadCrumb: string[]) => {
  const [level1Name, level2Name, level3Name] = breadCrumb

  const level1Router = props.level1List.find(level1Item => {
    return level1Item.name === level1Name
  })

  if (
    typeof level1Router === 'object' &&
    !isEmpty(level1Router) &&
    !isEmpty(level2Name)
  ) {
    setLevel2Router(level1Router)
    isLevel2Open.value = true
  }
  if (!isEmpty(level3Name) && !isEmpty(level2Name)) {
    level2OpenMap.value[level2Name] = true
  }
}

defineExpose({
  setLevel2Router,
  setOpen,
  breadCrumbSetLevel2
})
</script>

<template>
  <div class="nav-container">
    <CustomScrollbar
      class="nav-level1-container"
      :class="[
        `${isLevel2Open ? 'is-close' : 'is-open'}`
      ]"
    >
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
              <CustomTooltip
                placement="right"
                trigger="hover"
                popper-class="cursor-events-none"
                :disabled="!isLevel2Open"
                :offset="12"
                :show-after="300"
              >
                <CustomIcon v-bind="getRouteIcon(level1Item)" class="item-icon"></CustomIcon>
                <template #content>
                  <div>{{ getRouteTitle(level1Item) }}</div>
                </template>
              </CustomTooltip>
              <span class="item-title">{{ getRouteTitle(level1Item) }}</span>
            </div>

            <CustomIcon :icon="['fas', 'angle-right']" class="nav-item-right"></CustomIcon>
          </div>

          <!-- 無子路由 -->
          <RouterLink
            v-else
            :to="{ name: level1Item.name }"
            class="nav-item"
            v-slot="{ navigate }"
          >
            <div
              class="nav-item-left"
              :class="{ active: props.currentRouteName.level1 === level1Item.name }"
              @click="onRouterLinkClick(navigate)"
            >
              <CustomTooltip
                placement="right"
                trigger="hover"
                popper-class="cursor-events-none"
                :disabled="!isLevel2Open"
                :offset="12"
                :show-after="300"
              >
                <CustomIcon v-bind="getRouteIcon(level1Item)" class="item-icon"></CustomIcon>
                <template #content>
                  <div>{{ getRouteTitle(level1Item) }}</div>
                </template>
              </CustomTooltip>
              <span class="item-title">{{ getRouteTitle(level1Item) }}</span>
            </div>

            <div class="nav-item-right"></div>
          </RouterLink>
        </template>
      </nav>
    </CustomScrollbar>

    <div
      class="nav-list nav-level2"
      :class="isLevel2Open ? 'is-open' : 'is-close'"
    >
      <SubNavigationView
        v-model:isLevel2Open="isLevel2Open"
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
    padding: 0 2px;
    position: relative;
  }

  &-level1 {
    &-container {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      background-color: var(--i-color-menu);

      & {
        overflow: hidden {
          y: auto;
        }
        transition-duration: 0.3s;
      }

      &.nav-is-close {
        opacity: 1;
      }
      &.nav-is-open.is-close {
        opacity: 0.2;
      }
    }
  }

  &-list {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-item {
    width: 100%;
    min-height: 48px;
    color: #fff;
    font-weight: 600;
    letter-spacing: 1px;
    background-color: var(--i-color-menu);
    transition-duration: 0.3s;

    border-radius: 6px;
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    overflow: hidden;
    gap: 8px;

    &:hover {
      background-color: var(--i-color-menu-hover);

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
        color: var(--el-color-warning);
      }
      .item-title {
        font-size: 1.4em;
        transform: translateX(0);
        transition-duration: 0.3s;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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

  &-level2 {
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    background-color: var(--i-color-menu);
    z-index: 2;

    &.is-open {
      width: calc(100% - 56px);
      opacity: 1;
    }
    &.is-close {
      width: 0px;
      opacity: 0;
    }
  }
}
</style>
