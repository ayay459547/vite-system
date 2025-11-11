<script setup lang="ts">
import { ref, inject, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { useRoutesStore } from '@/stores/useRoutesStore'
import type { Navigation } from '@/types/types_routes'

import { CustomIcon } from '@/components/feature' // 系統組件
import { hasOwnProperty, isEmpty } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/declare/declare_i18n'

import LicensesView from './LicensesView.vue'

const router = useRouter()
const useHook = inject('useHook') as UseHook
const { i18nTranslate, i18nTest, env } = useHook({
  i18nModule: defaultModuleType
})
const { company } = env()

const nowDate = new Date()
const year = nowDate.getFullYear()

const routesStore = useRoutesStore()
const { navigationRoutes } = storeToRefs(routesStore)

const isLoading = ref(false)

const emit = defineEmits(['router-change'])
const onRouteClick = async (route: any) => {
  isLoading.value = true
  await nextTick()

  // 優先去主要功能
  const getMainRouteName = (route: any) => {
    const isMain = route?.meta?.isMain ?? false
    if (isMain) return route.name

    if (hasOwnProperty(route, 'leaves') && Array.isArray(route.leaves)) {
      for (const routeItem of route.leaves) {
        const routeName = getMainRouteName(routeItem)
        if (!isEmpty(routeName)) return routeName
      }
    }
  }

  const mainRouteName = getMainRouteName(route)
  if (!isEmpty(mainRouteName)) {
    router.push({ name: mainRouteName })
    emit('router-change')
    setTimeout(() => {
      isLoading.value = false
    }, 300)
    return
  }

  // 沒有設定主要功能 到第一個功能
  const getFirstRouteName = (route: any) => {
    if (hasOwnProperty(route, 'leaves') && Array.isArray(route.leaves)) {
      return getFirstRouteName(route.leaves[0])
    }
    return route.name
  }

  const firstRouteName = getFirstRouteName(route)
  router.push({ name: firstRouteName })
  emit('router-change')
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

const getIcon = (nav: Navigation | any): any => {
  if ([null, undefined].includes(nav)) return ['fas', 'question']
  const meta = nav.meta
  if (!isEmpty(meta.icon)) return meta.icon
  return { icon: ['fas', 'hashtag'] }
}

const getRouteClass = (index: number) => {
  const length = navigationRoutes.value.length
  const temp = (length - index)

  const getLineOfThree = () => {
    switch (length % 3) {
      case 1:
        return temp <= 4 ? 'item-6-3' : 'item-6-2'
      case 2:
        return temp <= 2 ? 'item-6-3' : 'item-6-2'
      case 0:
        return 'item-6-2'
    }
  }
  const getLineOfTwo = () => {
    if (temp <= 1) {
      return length % 2 === 1 ? 'item-2-2' : 'item-2-1'
    }
    return 'item-2-1'
  }
  const getLineOfOne = () => {
    return length === 1 ? 'item-1-1' : ''
  }

  return `${getLineOfThree()} ${getLineOfTwo()} ${getLineOfOne()} `
}
</script>

<template>
  <div v-loading="isLoading" class="home flex-column align-center i-ga-md">
    <div class="home-logo">
      <img src="@/assets/images/logo.png" class="home-logo-img" alt="demo" />
    </div>
    <!-- <div class="home-line"></div> -->
    <!-- <div class="home-title">
      <span>{{ i18nTranslate('intelligent') }}</span>
      <span>{{ i18nTranslate('integrated') }}</span>
      <span>{{ i18nTranslate('interactive') }}</span>
    </div> -->

    <div class="home-list">
      <div
        v-for="(route, index) in navigationRoutes"
        :class="`home-item ${getRouteClass(index)}`"
        :key="route.name"
        @click="onRouteClick(route ?? {})"
      >
        <div class="home-nav">
          <CustomIcon v-bind="getIcon(route)" />
          <span class="home-list-text">{{ i18nTest(route.name) ? i18nTranslate(route.name) : route.title }}</span>
        </div>
      </div>
    </div>

    <div class="home-copyright">
      <span>
        Copyright ©{{ year }}
        <a
          href="https://vuejs.org/"
          target="_blank"
          style="color: inherit"
        >
          {{ company }}
        </a>
      </span>
      <LicensesView />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

$base-width: 4px;
$item-width: 360px;
$gap-width: 18px;
$hover-color: #ff9900;

.home {
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: var(--i-color-system-bg);
  overflow: auto;

  &-logo {
    width: 220px;
    display: flex;
    align-items: center;
    padding: 12px 36px;
    border-radius: 6px;

    &-img {
      width: 100%;
      object-fit: cover;
    }
  }

  &-line {
    width: max(25%, 280px);
    height: max(3px, 3px);
    border-radius: 50%;
    background-color: var(--i-color-danger);
  }

  &-title {
    display: flex;
    gap: 32px;
    font-size: 2em;
    font-weight: 600;
    color: var(--i-color-system);
  }

  &-list {
    width: calc($item-width * 3 + $gap-width * 2 + $base-width);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: $gap-width;
    transition-duration: 0.3s;

    @media (max-width: 1512px) {
      width: calc($item-width * 2 + $gap-width * 2 + $base-width);
    }

    @media (max-width: 1128px) {
      width: calc($item-width * 1 + $gap-width * 2 + $base-width);
    }
  }

  &-item {
    height: 120px;
    background-color: var(--i-color-system);
    color: #fff;
    font-size: 1.6em;
    border-radius: 6px;
    transition-duration: 0.3s;
    cursor: pointer;

    &:hover {
      background-color: color.adjust($hover-color, $lightness: 15%);
    }
  }

  &-nav {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 32px;
  }

  &-copyright {
    padding-top: 6px;
    font-weight: 300;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    color: var(--el-text-color-primary);
  }
}

.item {
  // Total 6 space in a line
  &-6 {
    &-3 {
      width: calc($item-width * 1.5 + $gap-width / 4);
    }
    &-2 {
      width: $item-width;
    }
  }
  // Total 1 space in a line
  &-1 {
    &-1 {
      width: $item-width * 3;
    }
  }
  // Total 2 space in a line
  &-2 {
    &-1 {
      @media (max-width: 1512px) {
        width: calc($item-width + $gap-width / 2);
      }
    }
    &-2 {
      @media (max-width: 1512px) {
        width: calc($item-width * 2 + $gap-width * 3);
      }
      @media (max-width: 1128px) {
        width: calc($item-width + $gap-width / 2);
      }
    }
  }
}
</style>
