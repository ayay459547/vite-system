<script setup lang="ts">
import { shallowRef, computed, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import type { Navigation } from '@/declare/routes'
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'
import { CustomIcon } from '@/components'
import { deepClone, isEmpty } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'
// import routes from '@/router/routes'

const useHook: UseHook = inject('useHook')
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps<{
  showRoutes: Navigation[]
  currentNavigation: Navigation
  currentRouteName: CurrentRouteName
}>()

// const isOpen = ref(true)
const isOpen = computed(() => {
  return !isEmpty(routeList.value)
})

const level3List = shallowRef<Navigation[]>([])

const setLevel3Router = (routerItem: Navigation) => {
  if (isEmpty(routerItem)) return

  const { leaves } = routerItem
  level3List.value = leaves ?? []
}
const clearLevel3List = () => {
  level3List.value = []
}

const routeList = shallowRef<Navigation[]>([])
const levelRecord = []
const resetMenu = (navigation?: Navigation) => {
  levelRecord.splice(0)

  if (navigation) {
    const routeLevel = deepClone([], navigation.breadcrumbName)
    routeLevel.reduce(
      (curRoutes: any, leaveName: string) => {
        const leaves = curRoutes.leaves
        setMenu(leaves)
        return leaves.find(route => leaveName === route.name)
      },
      { leaves: props.showRoutes }
    )
    if (navigation.leaves) setMenu(navigation.leaves)
  } else {
    setMenu(props.showRoutes)
  }
}
const setMenu = routes => {
  routeList.value = deepClone([], routes)
  levelRecord.push(routes)
}
const backMenu = () => {
  levelRecord.pop()
  if (isEmpty(levelRecord)) {
    routeList.value = []
  } else {
    setMenu(levelRecord.pop())
  }
}
const getActive = routeName => {
  return Object.values(props.currentRouteName).includes(routeName)
}

defineExpose({
  setLevel3Router,
  clearLevel3List,
  // setOpen,
  resetMenu
})

const geti18nTranslate = root => {
  if (i18nTest(root.name)) return i18nTranslate(root.name)
  else return root.title
}
</script>

<template>
  <div class="menu-wrapper">
    <div class="menu-container" :class="isOpen ? 'is-open' : 'is-close'">
      <nav class="menu-list level2">
        <div class="menu-item back" @click="backMenu">
          <CustomIcon :icon="['fas', 'left-long']" class="item-icon" />
        </div>

        <template v-for="routerItem in routeList" :key="routerItem.name">
          <!-- 有子路由 -->
          <div
            v-if="Object.prototype.hasOwnProperty.call(routerItem, 'leaves')"
            class="menu-item"
            :class="{ active: getActive(routerItem.name) }"
            @click="setMenu(routerItem.leaves)"
          >
            <span class="item-title">{{ geti18nTranslate(routerItem) }}</span>
          </div>
          <!-- 無子路由 -->
          <RouterLink
            v-else
            class="menu-item"
            :class="{ active: getActive(routerItem.name) }"
            :to="{ name: routerItem.name }"
            v-slot="{ navigate }"
          >
            <div style="display: contents" @click="navigate">
              <span class="item-title">{{ geti18nTranslate(routerItem) }}</span>
            </div>
          </RouterLink>
        </template>
      </nav>
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
    transition-duration: 0.5s;
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

    &.back {
      width: 50px;
      justify-content: center;
      transition-duration: 0.5s;

      &:hover {
        transform: rotateZ(90deg);
      }
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
