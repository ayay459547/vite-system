<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'
import type { RouterTree } from '@/declare/router'
import { defineProps, computed, ref } from 'vue'
import SubNavigationView from './SubNavigationView.vue'

const props = defineProps<{
  router: RouterTree[]
}>()

const level1List: ComputedRef<RouterTree[]> = computed(() => {
  return props.router
})

const level2IsOpen: Ref<boolean> = ref(false)
const level2Title: Ref<string> = ref('')
const level2List: Ref<RouterTree[]> = ref([])

const setLevel2Router = (level2Router: RouterTree): void => {
  level2IsOpen.value = true
  level2Title.value = level2Router.title
  level2List.value = level2Router.leaves
}

</script>

<template>
  <div class="nav-container" :class="level2IsOpen ? 'is-open': 'is-clse'">
    <nav class="nav-list level1">
      <template v-for="level1Item in level1List" :key="level1Item.name">
        <div v-if="Object.hasOwnProperty.call(level1Item, 'leaves')" class="nav-item" @click="setLevel2Router(level1Item)">
          <div class="nav-item-left">
            <AdvantIcon v-if="level1Item.complete" :name="level1Item.icon" class="item-icon"></AdvantIcon>
            <AdvantIcon v-else name="wrench" class="item-icon"></AdvantIcon>
            <span class="item-title">{{ level1Item.title }}</span>
          </div>

          <AdvantIcon :icon="['fas', 'angle-right']" class="nav-item-right"></AdvantIcon>
        </div>

        <RouterLink v-else :to="level1Item.path" class="nav-item">
          <div class="nav-item-left">
            <AdvantIcon v-if="level1Item.complete" :name="level1Item.icon" class="item-icon"></AdvantIcon>
            <AdvantIcon v-else name="wrench" class="item-icon"></AdvantIcon>
            <span class="item-title">{{ level1Item.title }}</span>
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
      margin-left: -$nav-width;
    }
    &.is-close {
      margin-left: 0;
    }
  }

  &-list {
    min-width: $nav-width;
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-item {
    width: 100%;
    color: #fff;
    font-weight: 600;
    letter-spacing: 1px;
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
        font-size: 1.3em;
        transform: translateX(0);
        transition-duration: 0.3s;
      }
      .item-icon {
        font-size: 1.2em;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    &-right {
      font-size: 1.2em;
    }
  }
}
</style>