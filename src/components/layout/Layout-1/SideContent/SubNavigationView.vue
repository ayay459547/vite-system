<script lang="ts">
import type { PropType, WritableComputedRef } from 'vue'
import { defineComponent, computed } from 'vue'
import type { Navigation } from '@/declare/routes'
import { CustomIcon } from '@/components'
import { routesHook } from '@/lib/lib_routes'

import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'

export default defineComponent({
  name: 'SubNavigationView',
  components: { CustomIcon },
  props: {
    isOpen: {
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
  },
  emits: ['update:isOpen', 'changeMap'],
  setup (props, { emit }) {
    const { getRouteIcon, getRouteTitle } = routesHook()

    const tempIsOpen: WritableComputedRef<Boolean> = computed({
      get: () => props.isOpen,
      set: value => emit('update:isOpen', value)
    })

    const onTitleClick = (): void => {
      tempIsOpen.value = !tempIsOpen.value
    }

    const changeOpen = (name: string): void => emit('changeMap', name)

    return {
      getRouteIcon,
      getRouteTitle,
      navHeight: 54,
      changeOpen,
      tempIsOpen,
      onTitleClick
    }
  }
})

</script>

<template>
  <div class="nav-container">
    <div class="nav-title" @click="onTitleClick">
      <CustomIcon :icon="['fas', 'angle-left']" />
      <h3>{{ $props.title }}</h3>
    </div>

    <nav class="nav-list">
      <template v-for="routerItem in $props.level2List" :key="routerItem.name">
          <!-- 有子路由 -->
          <template v-if="Object.prototype.hasOwnProperty.call(routerItem, 'leaves')">
            <div class="nav-item" @click="changeOpen(routerItem.name)">
              <div
                class="nav-item-left"
                :class="{ active: $props.currentRouteName.level2 === routerItem.name }"
              >
                <CustomIcon :icon="getRouteIcon(routerItem)" class="item-icon" />
                <span class="item-title">{{ getRouteTitle(routerItem) }}</span>
              </div>

              <CustomIcon
                :icon="['fas', 'angle-left']"
                class="nav-item-right nav-arrow"
                :class="$props.openMap[routerItem.name] ? 'is-open' : 'is-close'"
              />
            </div>

            <div
              class="nav-sub-list"
              :class="$props.openMap[routerItem.name] ? 'is-open' : 'is-close'"
              :style="{
                'min-height': `${navHeight * (routerItem.leaves.length)}px`,
                'max-height': `${navHeight * (routerItem.leaves.length)}px`
              }"
            >
              <RouterLink
                v-for="leaf in routerItem.leaves"
                class="nav-sub-item"
                :key="leaf.name"
                :to="leaf.path"
                v-slot="{ navigate }"
              >
                <div
                  class="nav-item-left"
                  :class="{ active: $props.currentRouteName.level3 === leaf.name }"
                  @click="navigate"
                >
                  <CustomIcon :icon="getRouteIcon(leaf)" class="item-icon" />
                  <span class="item-title">{{ getRouteTitle(leaf) }}</span>
                </div>

                <div class="nav-item-right"></div>
              </RouterLink>
            </div>
          </template>

          <!-- 無子路由 -->
          <RouterLink
            v-else
            :to="routerItem.path"
            class="nav-item"
            v-slot="{ navigate }"
          >
            <div
              class="nav-item-left"
              :class="{ active: $props.currentRouteName.level2 === routerItem.name }"
              @click="navigate"
            >
              <CustomIcon :icon="getRouteIcon(routerItem)" class="item-icon" />
              <span class="item-title">{{ getRouteTitle(routerItem) }}</span>
            </div>

            <div class="nav-item-right"></div>
          </RouterLink>
        </template>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  &-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &-title {
    border-radius: 6px;
    padding: 12px 26px;
    display: flex;
    align-items: center;
    gap: 28px;
    cursor: pointer;
    color: #fff;

    & > h3 {
      font-size: 1.4em;
      letter-spacing: 1px;
      transform: translateX(0);
      transition-duration: 0.3s;

      @media (max-width: 768px) {
        font-size: 1.3em;
      }
    }

    &:hover {
      background-color: lighten($system-bg-color, 5%);

      & > h3 {
        transform: translateX(4px);
      }
    }
  }
  &-list {
    overflow: auto;
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
    color: #fff;
    background-color: $system-bg-color;
    transition-duration: 0.3s;

    border-radius: 6px;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: lighten($system-bg-color, 5%);
      .item-title {
        transform: translateX(4px);
      }
    }

    &-left {
      display: flex;
      align-items: center;
      gap: 22px;
      flex: 1;
      &.active {
        color: $warning;
      }
      .item-title {
        width: 100%;
        display: inline-block;
        font-size: 1.3em;
        transform: translateX(0);
        transition-duration: 0.3s;

        overflow: hidden;
        white-space: nowrap;

        @media (max-width: 768px) {
          font-size: 1.2em;
        }
      }
      .item-icon {
        width: 30px;
        height: 30px;
        @extend %flex-center;
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
    padding: 12px 0;
    padding-left: 62px;
    .item-icon {
      font-size: 1.2em;
    }
  }
}
</style>