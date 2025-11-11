<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, nextTick } from 'vue'

import type { Navigation } from '@/types/types_routes'
import { isEmpty, scrollToEl } from '@/lib/lib_utils' // 工具
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'

import NavigationView from './NavigationView.vue'

const props = defineProps({
  showRoutes: {
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

const NavigationViewRef = ref<InstanceType<typeof NavigationView>>()

const setOpen = async (value: boolean) => {
  await nextTick()
  if (NavigationViewRef.value) {
    NavigationViewRef.value?.setOpen(value)
  }
}

const init = async () => {
  const currentLevel1 = props.showRoutes.find(level1Item => {
    return level1Item.name === props.currentRouteName.level1
  })
  const hasChild = !isEmpty(currentLevel1?.leaves ?? [])

  if (hasChild) {
    NavigationViewRef.value?.setLevel2Router(currentLevel1)
  }
  setOpen(hasChild)

  await nextTick()
  setTimeout(() => {
    const el = document.querySelector('.router-link-active')
    scrollToEl(el, { behavior: 'auto' })
  }, 300)
}

defineExpose({
  init,
  setOpen,
  breadCrumbSetLevel2: (breadCrumb: string[]) => {
    if (NavigationViewRef.value) {
      NavigationViewRef.value.breadCrumbSetLevel2(breadCrumb)
    }
  }
})
</script>

<template>
  <div class="side-wrapper">
    <div class="side-container">
      <div class="side-logo">
        <div class="side-logo-navigate">
          <slot name="logo"></slot>
        </div>
      </div>

      <div class="side-nav">
        <NavigationView
          ref="NavigationViewRef"
          :level1-list="props.showRoutes"
          :current-route-name="props.currentRouteName"
        />
      </div>

      <div class="side-footer">
        <div class="side-footer-navigate">
          <slot name="version"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side {
  &-wrapper {
    width: 100%;
    height: 100%;
    padding: 8px;
    transition-duration: 0.3s;
    will-change: min-width;
  }

  &-container {
    width: 100%;
    height: 100%;
    background-color: var(--i-color-menu);
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    border-radius: 6px;
    transition-duration: 0.3s;
    transition-delay: 0.2s;
    &:hover {
      box-shadow: 1px 0px 20px 0px #707070;
    }
  }

  &-logo,
  &-footer {
    display: flex;
    align-items: center;

    color: #fff;
    transition-duration: 0.3s;
    width: 100%;

    &-navigate {
      display: flex;
      align-items: center;
      white-space: nowrap;
      cursor: default;
      flex: 1;
    }
  }

  &-nav {
    width: 100%;
    height: 100%;
    padding: 0 2px;
    overflow: hidden;
  }
}
</style>
