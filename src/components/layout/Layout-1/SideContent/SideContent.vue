<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, nextTick } from 'vue'

import type { Navigation } from '@/declare/routes'
import { CustomIcon } from '@/components'
import { isEmpty } from '@/lib/lib_utils'
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'

import NavigationView from './NavigationView.vue'

const props = defineProps({
  isOpen: {
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

const emit = defineEmits(['update:isOpen', 'change-page'])

const tempIsOpen = computed<boolean>({
  get () { return props.isOpen },
  set (value) {
    localStorage.setItem('navIsOpen', `${value}`)
    emit('update:isOpen', value)
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
  <div class="side-wrapper" :class="tempIsOpen ? 'is-open': 'is-close'">
    <div class="side-container">
      <div class="side-logo">
        <div class="side-logo-navigate open">
          <slot name="logo" :is-show="true"></slot>
        </div>
        <div class="side-logo-navigate close">
          <slot name="logo" :is-show="false"></slot>
        </div>

        <div class="side-logo-close" @click="tempIsOpen = false">
          <CustomIcon name="close"/>
        </div>
      </div>

      <div class="side-nav">
        <NavigationView
          ref="navRef"
          :is-open="tempIsOpen"
          :level1-list="props.showRoutes"
          :current-route-name="props.currentRouteName"
          @change-page="emit('change-page')"
        />
      </div>

      <div class="side-footer">
        <div class="side-footer-navigate open">
          <slot name="footer" :is-show="true"></slot>
        </div>
        <div class="side-footer-navigate close">
          <slot name="footer" :is-show="false"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../Layout-1.scss';

@mixin navStyle ($isOpen) {
  @if ($isOpen) {
    min-width: $nav-width;
    transition-delay: 0.2s;
    .side-logo .open,
    .side-footer .open {
      display: block;
    }
    .side-logo .close,
    .side-footer .close {
      display: none;
    }
  } @else {
    min-width: $side-width;
    .side-logo .open,
    .side-footer .open {
      display: none;
    }

    .side-logo .close,
    .side-footer .close {
      display: block;
    }
  }

}

.side {
  &-wrapper {
    width: 100%;
    height: 100%;
    background-color: lighten($system-bg-color, 48%);
    padding: $nav-padding 0 $nav-padding $nav-padding;
    transition-duration: 0.3s;
    will-change: min-width;
    @include navStyle(false);

    // 大於 992px 只能使用按鈕打開
    @media (min-width: 992px) {
      left: -$side-width;
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
    background-color: $system-bg-color;
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
