<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, shallowRef, inject } from 'vue'
import type { NavigationFailure } from 'vue-router'

import type { UseHook } from '@/declare/hook'
import type { Navigation } from '@/declare/routes'
import { useRoutesHook } from '@/lib/lib_routes'
import { CustomIcon, CustomScrollbar } from '@/components'
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'
import { defaultModuleType } from '@/i18n/i18n_setting'
import { isEmpty } from '@/lib/lib_utils'

import SubNavigationView from './SubNavigationView.vue'

const useHook: UseHook = inject('useHook')
const { i18nTest, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps({
  isOpen: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  level1List: {
    type: Array as PropType<Navigation[]>,
    default: () => {
      return []
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
  }
})

const emit = defineEmits(['change-page'])

type Navigate = (e?: MouseEvent) => Promise<void | NavigationFailure>
const onRouterLinkClick = (navigate: Navigate) => {
  emit('change-page')
  navigate()
}

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
const setLevel2Router = (level1Router: Navigation): void => {
  const { leaves } = level1Router

  level2IsOpen.value = true
  level2Nav.value = level1Router
  level2List.value = leaves

  leaves.forEach(leaf => {
    if (!Object.prototype.hasOwnProperty.call(level2OpenMap.value, leaf.name)) {
      level2OpenMap.value[leaf.name] = true
    }
  })
}
// 切換第二層是否打開
const setOpen = (value: boolean) => {
  level2IsOpen.value = value
}
// 點擊麵包屑切換第二層路由
const breadCrumbSetLevel2 = (breadCrumb: string[]) => {
  const [level1Name, level2Name, level3Name] = breadCrumb

  const level1Router = props.level1List.find(level1Item => {
    return level1Item.name === level1Name
  })

  if (!isEmpty(level1Router) && !isEmpty(level2Name)) {
    setLevel2Router(level1Router)
    level2IsOpen.value = true
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
        `${props.isOpen ? 'nav-is-open' : 'nav-is-close'}`,
        `${level2IsOpen ? 'is-close' : 'is-open'}`
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
              <CustomIcon :icon="getRouteIcon(level1Item)" class="item-icon"></CustomIcon>
              <span class="item-title">{{ getRouteTitle(level1Item) }}</span>
            </div>

            <CustomIcon :icon="['fas', 'angle-right']" class="nav-item-right"></CustomIcon>
          </div>

          <!-- 無子路由 -->
          <RouterLink v-else :to="level1Item.path" class="nav-item" v-slot="{ navigate }">
            <div
              class="nav-item-left"
              :class="{ active: props.currentRouteName.level1 === level1Item.name }"
              @click="onRouterLinkClick(navigate)"
            >
              <CustomIcon :icon="getRouteIcon(level1Item)" class="item-icon"></CustomIcon>
              <span class="item-title">{{ getRouteTitle(level1Item) }}</span>
            </div>

            <div class="nav-item-right"></div>
          </RouterLink>
        </template>
      </nav>
    </CustomScrollbar>

    <div class="nav-list level2">
      <SubNavigationView
        v-model:level2-is-open="level2IsOpen"
        :title="getRouteTitle(level2Nav)"
        :level2-list="level2List"
        :open-map="level2OpenMap"
        :current-route-name="props.currentRouteName"
        @change-map="changeMap"
        @change-page="emit('change-page')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../Layout-1.scss';

.nav {
  &-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    padding: 0 2px;
    // transition-duration: 0.3s;
    // &.is-open {
    //   transform: translateX(-$nav-width + $nav-padding * 2);
    // }
    // &.is-close {
    //   transform: translateX(0px);
    // }

    &:hover {
      .nav-level1-container {
        &.is-close {
          opacity: 0.2;

          &:hover {
            opacity: 1;
          }
        }
        &.is-open {
          opacity: 1;
        }
      }
    }
  }

  &-level1 {
    &-container {
      &.nav-is-close {
        opacity: 1;
      }
      &.nav-is-open.is-close {
        opacity: 0.2;
      }
      overflow: hidden {
        y: auto;
      }
      transition-duration: 0.3s;

      &.is-close {
        min-width: $side-width - $nav-padding * 2;
      }
      &.is-open {
        min-width: $nav-width - $nav-padding * 2;
      }
    }
  }

  &-list {
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.level1 {
      min-width: $nav-width - $nav-padding * 2;
    }
    &.level2 {
      min-width: $nav-width - $side-width;
      padding: 0;
    }
  }

  &-item {
    width: 100%;
    min-height: 48px;
    color: #fff;
    font-weight: 600;
    letter-spacing: 1px;
    background-color: $system-bg-color;
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
