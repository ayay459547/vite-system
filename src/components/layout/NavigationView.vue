<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'
import type { RouterTree } from '@/declare/router'
import { defineProps, computed, ref } from 'vue'

// interface Props {
//   router: RouterTree[]
// }
// const props = withDefaults(defineProps<Props>(), {
//   router: () => []
// })

const props = defineProps<{
  router: RouterTree[]
}>()

const level1List: ComputedRef<RouterTree[]> = computed(() => {
  return props.router
})
const level2List: Ref<RouterTree[]> = ref([])

const setLevel2Router = (level2Router: RouterTree[]): void => {
  level2List.value = level2Router
}

</script>

<template>
  <div class="nav-container">
    <nav class="nav-list level1">
      <template v-for="level1Item in level1List" :key="level1Item.name">
        <div v-if="Object.hasOwnProperty.call(level1Item, 'leaves')" class="nav-item" @click="setLevel2Router(level1Item.leaves)">
          <div class="nav-item-left">
            <AdvantIcon v-if="level1Item.complete" :name="level1Item.icon" class="item-icon"></AdvantIcon>
            <AdvantIcon v-else name="wrench" class="item-icon"></AdvantIcon>
            <span>{{ level1Item.title }}</span>
          </div>

          <AdvantIcon :icon="['fas', 'angle-right']" class="nav-item-right"></AdvantIcon>
        </div>

        <RouterLink v-else :to="level1Item.path" class="nav-item">
          <div class="nav-item-left">
            <AdvantIcon v-if="level1Item.complete" :name="level1Item.icon" class="item-icon"></AdvantIcon>
            <AdvantIcon v-else name="wrench" class="item-icon"></AdvantIcon>
            <span>{{ level1Item.title }}</span>
          </div>

          <div class="nav-item-right"></div>
        </RouterLink>

      </template>
    </nav>

    <nav class="nav-list level2">
      <template v-for="level2Item in level2List" :key="level2Item.name">
        <div v-if="Object.hasOwnProperty.call(level2Item, 'leaves')" class="nav-item" @click="setLevel2Router(level2Item.leaves)">
          <div class="nav-item-left">
            <div v-if="level2Item.complete" class="item-icon"></div>
            <AdvantIcon v-else name="wrench" class="item-icon"></AdvantIcon>
            <span>{{ level2Item.title }}</span>
          </div>

          <AdvantIcon :icon="['fas', 'angle-left']" class="nav-item-right"></AdvantIcon>
        </div>

        <RouterLink v-else :to="level2Item.path" class="nav-item">
          <div class="nav-item-left">
            <div v-if="level2Item.complete" class="item-icon"></div>
            <AdvantIcon v-else name="wrench" class="item-icon"></AdvantIcon>
            <span>{{ level2Item.title }}</span>
          </div>

          <div class="nav-item-right"></div>
        </RouterLink>

      </template>
    </nav>

  </div>
</template>

<style lang="scss" scoped>
$bg-color: #535353;

.nav {
  &-container {
    width: 100%;
    height: 100%;
  }

  &-list {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-item {
    width: 100%;
    color: #fff;
    background-color: $bg-color;
    transition-duration: 0.3s;

    border-radius: 6px;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 1.3em;

    &:hover {
      background-color: #606060;
    }

    &-left {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;

      .item-icon {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>