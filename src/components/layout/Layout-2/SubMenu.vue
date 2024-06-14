<script setup lang="ts">
import { onMounted, shallowRef, ref } from 'vue'

import type { Navigation } from '@/declare/routes'
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'
import { useRoutesHook } from '@/lib/lib_routes'
import { CustomIcon, CustomButton } from '@/components'
import { isEmpty } from '@/lib/lib_utils'

const { getRouteIcon, getRouteTitle } = useRoutesHook()

const props = defineProps<{
  currentNavigation: Navigation
  level2Nav: Navigation
  level2List: Navigation[]
  currentRouteName: CurrentRouteName
}>()

const isOpen = ref(true)

const level3List = shallowRef<Navigation[]>([])

const setLevel3Router = (routerItem: Navigation) => {
  if (isEmpty(routerItem)) return

  const { leaves } = routerItem
  level3List.value = leaves ?? []
}
const clearLevel3List = () => {
  level3List.value = []
}

onMounted(() => {
  console.log(props.level2List)
})

const setOpen = (value: boolean) => {
  isOpen.value = value
}

defineExpose({
  setLevel3Router,
  clearLevel3List,
  setOpen
})
</script>

<template>
  <div class="menu-wrapper">
    <div class="menu-container" :class="isOpen ? 'is-open' : 'is-close'">
      <nav v-show="props.level2List.length > 0" class="menu-list level2">
        <template v-for="routerItem in props.level2List" :key="routerItem.name">
          <!-- 有子路由 -->
          <div
            v-if="Object.prototype.hasOwnProperty.call(routerItem, 'leaves')"
            class="menu-item"
            :class="{ active: props.currentRouteName.level2 === routerItem.name }"
            @click="setLevel3Router(routerItem)"
          >
            <CustomIcon :icon="getRouteIcon(routerItem)" class="item-icon" />
            <span class="item-title">{{ getRouteTitle(routerItem) }}</span>
          </div>
          <!-- 無子路由 -->
          <RouterLink
            v-else
            class="menu-item"
            :class="{ active: props.currentRouteName.level2 === routerItem.name }"
            :to="routerItem.path"
            v-slot="{ navigate }"
            @click="clearLevel3List"
          >
            <div style="display: contents" @click="navigate">
              <CustomIcon :icon="getRouteIcon(routerItem)" class="item-icon" />
              <span class="item-title">{{ getRouteTitle(routerItem) }}</span>
            </div>
          </RouterLink>
        </template>
      </nav>

      <nav v-show="level3List.length > 0" class="menu-list level3">
        <template v-for="leaf in level3List" :key="leaf.name">
          <RouterLink
            class="menu-item"
            :class="{ active: props.currentRouteName.level3 === leaf.name }"
            :to="leaf.path"
            v-slot="{ navigate }"
          >
            <div style="display: contents" @click="navigate">
              <!-- <CustomIcon :icon="getRouteIcon(leaf)" class="item-icon" /> -->
              <span class="item-title">{{ getRouteTitle(leaf) }}</span>
            </div>
          </RouterLink>
        </template>
      </nav>
    </div>

    <div v-show="props.level2List.length > 0" class="menu-collapse">
      <CustomButton
        class="btn"
        :class="isOpen ? 'is-open' : 'is-close'"
        icon-name="chevron-up"
        circle
        @click="setOpen(!isOpen)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  &-wrapper {
    position: relative;
  }

  &-container {
    width: 100%;
    height: fit-content;
    transition-duration: 0.3s;
    overflow: hidden;
    will-change: max-height;
    &.is-open {
      max-height: 300px;
    }
    &.is-close {
      max-height: 0;
    }
  }

  &-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    padding: 8px;

    &.level2 {
      background-color: var(--i-color-menu-sub);

      // &:hover {
      //   & ~ .level3 {
      //     max-height: 100px;
      //   }
      // }
    }
    &.level3 {
      // max-height: 0px;
      // transition-duration: 0.2s;
      transition-timing-function: linear;
      height: fit-content;
      background-color: var(--i-color-menu-sub);
      overflow: hidden;
    }
  }
  &-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #ffffff;
    font-size: 1.1em;
    padding: 4px 6px;
    border-radius: 6px;
    transition-duration: 0.2s;
    cursor: pointer;

    &:hover,
    &.active {
      color: var(--el-color-warning);
    }
  }

  &-collapse {
    width: fit-content;
    position: absolute;
    z-index: 1;
    right: 50%;
    transform: translateY(-16px);

    .btn {
      transition-duration: 0.2s;
      &.is-open {
        transform: rotateZ(0deg);
      }
      &.is-close {
        transform: rotateZ(180deg);
      }
    }
  }
}
</style>
