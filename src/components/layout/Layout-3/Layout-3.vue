<script setup lang="ts">
import type { PropType } from 'vue'
import { nextTick, ref } from 'vue'
// import type { RouteLocationNormalized } from 'vue-router'

import type { Navigation } from '@/types/types_routes'
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'
import { isEmpty } from '@/lib/lib_utils'

import CustomDividerView from '@/components/feature/CustomDividerView/CustomDividerView.vue'

import SideContent from './SideContent/SideContent.vue'
import HeaderContent from './HeaderContent.vue'

const props = defineProps({
  showRoutes: {
    type: Array as PropType<Navigation[]>,
    default: () => []
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
  }
})

const SideContentRef = ref<InstanceType<typeof SideContent>>()

const init = async () => {
  await nextTick()
  if (isEmpty(props.currentNavigation)) return
  SideContentRef.value?.init()
}

const onRouterChange = async () => {
  await nextTick()
  SideContentRef.value?.setOpen(false)
}

defineExpose({
  init
})

const CustomDividerViewRef = ref<InstanceType<typeof CustomDividerView>>()
const defaultLeftWidth = ref(350)
const setDefaultLeftWidth = (currentLeftWidth: number) => {
  defaultLeftWidth.value = currentLeftWidth
  CustomDividerViewRef.value?.initDefaultCenter()
}

const onBreadCrumbClick = (targetRoutePath: string[]) => {
  if (targetRoutePath.length === 0) {
    SideContentRef.value?.setOpen(false)
  }

  // level1 被點擊
  if (targetRoutePath.length === 1) {
    SideContentRef.value?.setOpen(false)
    // level2 被點擊
  } else if (targetRoutePath.length === 2) {
    SideContentRef.value?.breadCrumbSetLevel2(targetRoutePath)
    // level3 被點擊
  } else {
    SideContentRef.value?.breadCrumbSetLevel2(targetRoutePath)
  }
}
</script>

<template>
  <div class="layout-wrapper">
    <CustomDividerView
      ref="CustomDividerViewRef"
      :left-width="defaultLeftWidth"
      @change="setDefaultLeftWidth"
    >
      <template #left>
        <!-- 側邊選單 -->
        <div class="layout-left">
          <SideContent
            ref="SideContentRef"
            :show-routes="props.showRoutes"
            :current-navigation="props.currentNavigation"
            :current-route-name="props.currentRouteName"
          >
            <template #logo>
              <slot name="logo"></slot>
            </template>
            <template #version>
              <slot name="version"></slot>
            </template>
          </SideContent>
        </div>
      </template>
      <template #right>
        <!-- header + view -->
        <div class="layout-right">
          <div class="layout-header">
            <HeaderContent
              @router-change="onRouterChange"
              @set-router="onBreadCrumbClick"
            >
              <template #MenuUser>
                <slot name="MenuUser"></slot>
              </template>
            </HeaderContent>
          </div>

          <div class="layout-view">
            <slot name="content"></slot>
          </div>
        </div>
      </template>
    </CustomDividerView>
  </div>
</template>

<style lang="scss" scoped>
$header-heigth: 48px;

.layout {
  &-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    background: inherit;
  }

  &-left,
  &-right {
    width: 100%;
    height: 100%;
    transition-duration: 0.3s;
    will-change: width;
    overflow: hidden;
  }
  &-header {
    width: 100%;
    height: $header-heigth;
  }
  &-view {
    width: 100%;
    height: calc(100% - $header-heigth);
  }
}
</style>
