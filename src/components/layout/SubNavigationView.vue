<script lang="ts">
import { ComputedRef, PropType, WritableComputedRef } from 'vue'
import type { RouterTree } from '@/declare/router'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'SubNavigationView',
  props: {
    isOpen: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    title: {
      type: String as PropType<string>,
      default: ''
    },
    router: {
      type: Array as PropType<RouterTree[]>,
      required: true
    },
    openMap: {
      type: Object as PropType<Record<string, boolean>>,
      required: true
    }
  },
  emits: ['update:isOpen', 'changeMap'],
  setup (props, { emit }) {
    const tempIsOpen: WritableComputedRef<Boolean> = computed({
      get: () => props.isOpen,
      set: value => emit('update:isOpen', value)
    })
    const onTitleClick = (): void => {
      tempIsOpen.value = !tempIsOpen.value
    }

    const routerList: ComputedRef<RouterTree[]> = computed(() => {
      return props.router
    })

    const changeOpen = (name: string): void => {
      emit('changeMap', name)
    }

    return {
      navHeight: 54,
      changeOpen,
      routerList,
      tempIsOpen,
      onTitleClick
    }
  }
})

</script>

<template>
  <div class="nav-container">
    <div class="nav-title" @click="onTitleClick">
      <AdvantIcon :icon="['fas', 'angle-left']"></AdvantIcon>
      <h3>{{ $props.title }}</h3>
    </div>

    <nav class="nav-list">
      <template v-for="routerItem in routerList" :key="routerItem.name">
          <!-- 有子路由 -->
          <template v-if="Object.hasOwnProperty.call(routerItem, 'leaves')">
            <div class="nav-item" @click="changeOpen(routerItem.name)">
              <div class="nav-item-left">
                <div v-if="routerItem.complete" class="item-icon"></div>
                <AdvantIcon v-else name="wrench" class="item-icon"></AdvantIcon>
                <span class="item-title">{{ routerItem.title }}</span>
              </div>

              <AdvantIcon
                :icon="['fas', 'angle-left']"
                class="nav-item-right nav-arrow"
                :class="openMap[routerItem.name] ? 'is-open' : 'is-close'"
              ></AdvantIcon>
            </div>

            <div
              class="nav-sub-list"
              :class="openMap[routerItem.name] ? 'is-open' : 'is-close'"
              :style="{
                'min-height': `${navHeight * (routerItem.leaves.length)}px`,
                'max-height': `${navHeight * (routerItem.leaves.length)}px`
              }"
            >
              <RouterLink
                v-for="leaf in routerItem.leaves"
                :key="leaf.name"
                :to="leaf.path"
                class="nav-sub-item"
              >
                <div class="nav-item-left">
                  <div v-if="leaf.complete" class="item-icon"></div>
                  <AdvantIcon v-else name="wrench" class="item-icon"></AdvantIcon>
                  <span class="item-title">{{ leaf.title }}</span>
                </div>

                <div class="nav-item-right"></div>
              </RouterLink>
            </div>
          </template>

          <!-- 無子路由 -->
          <RouterLink v-else :to="routerItem.path" class="nav-item">
            <div class="nav-item-left">
              <div v-if="routerItem.complete" class="item-icon"></div>
              <AdvantIcon v-else name="wrench" class="item-icon"></AdvantIcon>
              <span class="item-title">{{ routerItem.title }}</span>
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
    gap: 16px;
    cursor: pointer;
    color: #fff;

    & > h3 {
      font-size: 1.2em;
      letter-spacing: 1px;
      transform: translateX(0);
      transition-duration: 0.3s;
    }

    &:hover {
      background-color: #606060;

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
    background-color: $side-bg-color;
    transition-duration: 0.3s;

    border-radius: 6px;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: #606060;
      .item-title {
        transform: translateX(4px);
      }
    }

    &-left {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      .item-title {
        font-size: 1.1em;
        transform: translateX(0);
        transition-duration: 0.3s;
      }
      .item-icon {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
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
}
</style>