<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import type { Navigation } from '@/declare/routes'
import { storeToRefs } from 'pinia'
import { useRoutesStore } from '@/stores/routes'
import SubNavigationView from './SubNavigationView.vue'
import { CustomIcon } from '@/components'
import type { RouterType } from '@/router/setting'
import { routerTypeIcon } from '@/router/setting'

const props = defineProps<{
  router: Navigation[]
}>()

const level1List: ComputedRef<Navigation[]> = computed(() => {
  return props.router
})

// 第二層路由
const level2IsOpen: Ref<boolean> = ref(false)
const level2Title: Ref<string> = ref('')
const level2List: Ref<Navigation[]> = ref([])

const level2OpenMap: Ref<Record<string, boolean>> = ref({})
const changeMap = (name: string): void => {
  level2OpenMap.value[name] = !level2OpenMap.value[name]
}

const setLevel2Router = (level2Router: Navigation): void => {
  level2IsOpen.value = true
  level2Title.value = level2Router.title
  level2List.value = level2Router.leaves

  level2Router.leaves.forEach(leaf => {
    if(!Object.hasOwnProperty.call(level2OpenMap.value, leaf.name)) {
      level2OpenMap.value[leaf.name] = true
    }
  })
}

// 路由圖示
const getLastTypeIcon = (systemType: RouterType[]) => {
  const lastType = systemType[systemType.length - 1]
  return routerTypeIcon[lastType]
}

// active
const routesStore = useRoutesStore()
const { breadcrumbName, currentRouteName } = storeToRefs(routesStore)

</script>

<template>
  <div class="nav-container" :class="level2IsOpen ? 'is-open': 'is-clse'">
    <nav class="nav-list level1">
      <template v-for="level1Item in level1List" :key="level1Item.name">
        <!-- 有子路由 -->
        <div
          v-if="Object.hasOwnProperty.call(level1Item, 'leaves')"
          class="nav-item"
          @click="setLevel2Router(level1Item)"
        >
          <div
            class="nav-item-left"
            :class="{ active: breadcrumbName[0] === level1Item.name }"
          >
            <CustomIcon v-if="level1Item.icon" :name="level1Item.icon" class="item-icon"></CustomIcon>
            <CustomIcon v-else :icon="getLastTypeIcon(level1Item.systemType)" class="item-icon"></CustomIcon>
            <span class="item-title">
              {{ level1Item.title }}
            </span>
          </div>

          <CustomIcon :icon="['fas', 'angle-right']" class="nav-item-right"></CustomIcon>
        </div>

        <!-- 無子路由 -->
        <RouterLink
          v-else
          :to="level1Item.path"
          class="nav-item"
          v-slot="{ navigate }"
        >
          <div
            class="nav-item-left"
            :class="{ active: currentRouteName === level1Item.name }"
            @click="navigate"
          >
            <CustomIcon v-if="level1Item.icon" :name="level1Item.icon" class="item-icon"></CustomIcon>
            <CustomIcon v-else :icon="getLastTypeIcon(level1Item.systemType)" class="item-icon"></CustomIcon>
            <span class="item-title">
              {{ level1Item.title }}
            </span>
          </div>

          <div class="nav-item-right"></div>
        </RouterLink>

      </template>
    </nav>

    <div class="nav-list level2">
      <SubNavigationView
        v-model:isOpen="level2IsOpen"
        :title="level2Title"
        :router="level2List"
        :open-map="level2OpenMap"
        @change-map="changeMap"
      ></SubNavigationView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  &-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    transition-duration: 0.3s;
    will-change: margin-left;
    &.is-open {
      margin-left: -$nav-lg-width;

      @media (max-width: 992px) {
        margin-left: -$nav-md-width;
      }
    }
    &.is-close {
      margin-left: 0;
    }
  }

  &-list {
    min-width: $nav-lg-width;
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition-duration: 0.3s;

    &.level1 {
      overflow-y: auto;
    }

    @media (max-width: 992px) {
      min-width: $nav-md-width;
    }
  }

  &-item {
    width: 100%;
    color: #fff;
    font-weight: 600;
    letter-spacing: 1px;
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
      gap: 8px;
      flex: 1;
      &.active {
        color: $warning;
      }
      .item-title {
        font-size: 1.3em;
        transform: translateX(0);
        transition-duration: 0.3s;

        @media (max-width: 992px) {
          font-size: 1.1em;
        }
      }
      .item-icon {
        font-size: 1.2em;
        width: 30px;
        height: 30px;
        @extend %flex-center;

        @media (max-width: 992px) {
          font-size: 1em;
        }
      }
    }

    &-right {
      font-size: 1.2em;
    }
  }
}
</style>