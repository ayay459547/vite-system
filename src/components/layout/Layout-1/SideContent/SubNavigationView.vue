<script setup lang="ts">
import type { PropType, WritableComputedRef } from 'vue'
import { computed, inject, ref, nextTick } from 'vue'
import type { NavigationFailure } from 'vue-router'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import type { Navigation } from '@/declare/routes'
import { CustomIcon, CustomScrollbar, CustomTooltip } from '@/components' // 系統組件
import { useRoutesHook } from '@/lib/lib_routes'
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'
import { defaultModuleType } from '@/i18n/i18n_setting'

const props = defineProps({
  isLevel2Open: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  title: {
    type: String as PropType<string>,
    default: ''
  },
  level2List: {
    type: Array as PropType<Navigation[]>,
    required: true
  },
  openMap: {
    type: Object as PropType<Record<string, boolean>>,
    required: true
  },
  currentRouteName: {
    type: Object as PropType<CurrentRouteName>,
    required: true
  }
})

const emit = defineEmits(['update:isLevel2Open', 'change-map'])

const navHeight = 39.5
const useHook: UseHook = inject('useHook')
const { i18nTest, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const { getRouteTitle } = useRoutesHook({
  i18nTranslate,
  i18nTest
})

const tempIsOpen: WritableComputedRef<Boolean> = computed({
  get: () => props.isLevel2Open,
  set: value => emit('update:isLevel2Open', value)
})

const titleClick = (): void => {
  tempIsOpen.value = false
}

const changeMap = (name: string): void => emit('change-map', name)

const activeRouteName = ref('')

type Navigate = (e?: MouseEvent) => Promise<void | NavigationFailure>
const onRouterLinkClick = async (navigate: Navigate, routerName: string, active: boolean) => {
  if (active) return // 是現在的頁面則取消跳轉

  activeRouteName.value = routerName
  await Promise.all([navigate(), nextTick()])
  setTimeout(() => {
    activeRouteName.value = ''
  }, 0)
}

</script>

<template>
  <div class="nav-wrapper">
    <div class="nav-title" @click="titleClick">
      <CustomIcon :icon="['fas', 'angle-left']" />

      <h3>{{ props.title }}</h3>
    </div>

    <CustomScrollbar class="nav-conatiner">
      <nav class="nav-list">
        <template v-for="routerItem in props.level2List" :key="routerItem.name">
          <!-- 有子路由 -->
          <template v-if="Object.prototype.hasOwnProperty.call(routerItem, 'leaves')">
            <div class="nav-item" @click="changeMap(routerItem.name)">
              <div
                class="nav-item-left"
                :class="{ active: props.currentRouteName.level2 === routerItem.name }"
              >
                <CustomTooltip :show-after="800">
                  <span class="item-title">{{ getRouteTitle(routerItem) }}</span>
                  <template #content>
                    <span class="item-title">{{ getRouteTitle(routerItem) }}</span>
                  </template>
                </CustomTooltip>
              </div>

              <CustomIcon
                :icon="['fas', 'angle-left']"
                class="nav-item-right nav-arrow"
                :class="props.openMap[routerItem.name] ? 'is-open' : 'is-close'"
              />
            </div>

            <div
              class="nav-sub-list"
              :class="props.openMap[routerItem.name] ? 'is-open' : 'is-close'"
              :style="{
                'min-height': `${navHeight * routerItem.leaves.length}px`,
                'max-height': `${navHeight * routerItem.leaves.length}px`
              }"
            >
              <RouterLink
                v-for="leaf in routerItem.leaves"
                class="nav-sub-item"
                :key="leaf.name"
                :to="{ name: leaf.name }"
                v-slot="{ navigate }"
              >
                <div
                  class="nav-item-left"
                  :class="{
                    active: [props.currentRouteName.level3, activeRouteName].includes(leaf.name)
                  }"
                  @click="
                    onRouterLinkClick(
                      navigate,
                      leaf.name,
                      [props.currentRouteName.level3, activeRouteName].includes(leaf.name)
                    )
                  "
                >
                  <CustomTooltip :show-after="800">
                    <span class="item-title">{{ getRouteTitle(leaf) }}</span>
                    <template #content>
                      <span class="item-title">{{ getRouteTitle(leaf) }}</span>
                    </template>
                  </CustomTooltip>
                </div>

                <div class="nav-item-right"></div>
              </RouterLink>
            </div>
          </template>

          <!-- 無子路由 -->
          <RouterLink
            v-else
            :to="{ name: routerItem.name }"
            class="nav-item"
            v-slot="{ navigate }"
          >
            <div
              class="nav-item-left"
              :class="{
                active: [props.currentRouteName.level2, activeRouteName].includes(routerItem.name)
              }"
              @click="
                onRouterLinkClick(
                  navigate,
                  routerItem.name,
                  [props.currentRouteName.level2, activeRouteName].includes(routerItem.name)
                )
              "
            >
              <CustomTooltip :show-after="800">
                <span class="item-title">{{ getRouteTitle(routerItem) }}</span>
                <template #content>
                  <span class="item-title">{{ getRouteTitle(routerItem) }}</span>
                </template>
              </CustomTooltip>
            </div>

            <div class="nav-item-right"></div>
          </RouterLink>
        </template>
      </nav>
    </CustomScrollbar>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  &-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  &-container {
    width: 100%;
    height: 100%;
  }

  &-title {
    border-radius: 6px;
    padding: 12px 22px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    color: var(--i-color-menu-color);

    h3 {
      font-size: 1.2em;
      letter-spacing: 1px;
      transform: translateX(0);
      transition-duration: 0.3s;
    }

    &:hover {
      background-color: var(--i-color-menu-hover);

      & > h3 {
        transform: translateX(4px);
      }
    }
  }
  &-list {
    overflow: hidden {
      y: auto;
    }
  }

  &-sub-list,
  &-list {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-sub-item,
  &-item {
    width: 100%;
    color: var(--i-color-menu-color);
    background-color: var(--i-color-menu);
    transition-duration: 0.3s;

    border-radius: 6px;
    padding: 8px 16px 8px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: var(--i-color-menu-hover);
      .item-title {
        transform: translateX(4px);
      }
    }

    &-left {
      display: flex;
      align-items: center;
      gap: 22px;
      flex: 1;
      width: 100%;

      &.active {
        color: var(--el-color-warning);
      }
      .item-title {
        width: 100%;
        display: inline-block;
        font-size: 1.25em;
        transform: translateX(0);
        transition-duration: 0.3s;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .item-icon {
        width: 30px;
        height: 30px;
        @extend %flex-center;
      }

      .item-empty {
        height: 30px;
      }
    }
  }

  // 與第二層相關
  &-arrow {
    transition-duration: 0.3s;
    &.is-open {
      transform: rotateZ(-90deg);
    }
    &.is-close {
      transform: rotateZ(0deg);
    }
  }

  &-sub-list {
    width: 100%;
    overflow: hidden;
    transition-duration: 0.3s;
    will-change: min-height max-height;
    &.is-close {
      min-height: 0 !important;
      max-height: 0 !important;
    }
  }

  &-sub-item {
    padding: 8px 0;
    padding-left: 38.5px;
    .item-icon {
      font-size: 1.2em;
    }
  }
}
</style>
