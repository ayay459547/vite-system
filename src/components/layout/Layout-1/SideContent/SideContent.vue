<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, nextTick } from 'vue'

import type { Navigation } from '@/declare/routes'
import { CustomIcon } from '@/components'
import { isEmpty } from '@/lib/lib_utils'
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'

import NavigationView from './NavigationView.vue'

const props = defineProps({
  isNavOpen: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  isNavHover: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  showRoutes: {
    type: Array as PropType<Navigation[]>,
    default: () => {
      return []
    }
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

const emit = defineEmits(['update:isNavOpen'])

const tempIsOpen = computed<boolean>({
  get() {
    return props.isNavOpen
  },
  set(value) {
    emit('update:isNavOpen', value)
  }
})

const navRef = ref()

const init = async () => {
  await nextTick()
  if (isEmpty(props.currentNavigation)) return

  const currentLevel1 = props.showRoutes.find(level1Item => {
    return level1Item.name === props.currentRouteName.level1
  })
  const hasChild = !isEmpty(currentLevel1?.leaves ?? [])

  if (hasChild) {
    navRef.value.setLevel2Router(currentLevel1)
  }
  navRef.value.setOpen(hasChild)

  // await nextTick()
  // setTimeout(() => {
  //   const el = document.querySelector('.router-link-active')
  //   if (el) {
  //     scrollToEl(el)
  //   }
  // }, 1200)
}

defineExpose({
  init,
  setOpen: (value: boolean) => {
    if (navRef.value) {
      navRef.value.setOpen(value)
    }
  },
  breadCrumbSetLevel2: (breadCrumb: string[]) => {
    if (navRef.value) {
      navRef.value.breadCrumbSetLevel2(breadCrumb)
    }
  }
})
</script>

<template>
  <div
    class="side-wrapper"
    :class="[
      tempIsOpen ? 'is-open' : 'is-close',
      props.isNavHover ? 'is-hover' : ''
    ]"
  >
    <div class="side-container">
      <div class="side-logo">
        <div class="side-logo-navigate">
          <slot name="logo" :is-open="tempIsOpen"></slot>
        </div>

        <div class="side-logo-close" @click="tempIsOpen = false">
          <CustomIcon name="close" />
        </div>
      </div>

      <div class="side-nav">
        <NavigationView
          ref="navRef"
          :is-nav-open="tempIsOpen"
          :level1-list="props.showRoutes"
          :current-route-name="props.currentRouteName"
        />
      </div>

      <div class="side-footer">
        <div class="side-footer-navigate">
          <slot name="version" :is-open="tempIsOpen"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../Layout-1.scss' as *;

@mixin navStyle($isNavOpen) {
  @if ($isNavOpen) {
    min-width: $nav-width;
    transition-delay: 0.25s;
  } @else {
    min-width: $side-width;
  }
}

.side {
  &-wrapper {
    width: 100%;
    height: 100%;
    padding: $nav-padding 0 $nav-padding $nav-padding;
    transition-duration: 0.3s;
    will-change: min-width;
    @include navStyle(false);

    // 大於 992px 只能使用按鈕打開
    @media (min-width: 992px) {
      left: -$side-width;
      &.is-hover,
      &:hover {
        @include navStyle(true);
      }
    }
    &.is-open {
      @include navStyle(true);
    }
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

    &-close {
      padding: 4px 8px;
      margin: 0 6px;
      cursor: pointer;
      font-size: 1.5em;
      // 大於 992px 不用顯示
      @media (min-width: 992px) {
        display: none;
      }
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
