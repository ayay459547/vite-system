<script lang="ts">
import { ComputedRef, PropType, WritableComputedRef, Ref } from 'vue'
import type { RouterTree } from '@/declare/router'
import { defineComponent, computed, ref } from 'vue'

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
    }
  },
  emits: ['update:isOpen'],
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

    const closeList: Ref<string[]> = ref([])
    const addClose = (name: string) => {
      closeList.value.push(name)
    }

    return {
      addClose,
      closeList,
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
            <div class="nav-item">
              <div class="nav-item-left">
                <div v-if="routerItem.complete" class="item-icon"></div>
                <AdvantIcon v-else name="wrench" class="item-icon"></AdvantIcon>
                <span class="item-title">{{ routerItem.title }}</span>
              </div>

              <AdvantIcon 
                :icon="['fas', 'angle-left']"
                class="nav-item-right"
                :class="closeList.includes(routerItem.title) ? 'is-open' : 'is-close'"
              ></AdvantIcon>
            </div>

            <RouterLink
              v-for="leaf in routerItem.leaves"
              :key="leaf.name"
              :to="leaf.path"
              class="nav-item"
            >
              <div class="nav-item-left">
                <div v-if="leaf.complete" class="item-icon"></div>
                <AdvantIcon v-else name="wrench" class="item-icon"></AdvantIcon>
                <span class="item-title">{{ leaf.title }}</span>
              </div>

              <div class="nav-item-right"></div>
            </RouterLink>
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
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
  }

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
}
</style>