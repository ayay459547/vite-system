<script setup lang="ts">
import { computed } from 'vue'

import { setLocalStorage } from '@/lib/lib_storage'
import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue'
import MenuBreadcrumb from '@/components/layout/Menu/MenuBreadcrumb.vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'setRouter', value: string[]): void
}>()

const tempIsOpen = computed<boolean>({
  get: () => props.isOpen,
  set: (value: boolean) => {
    setLocalStorage('isNavOpen', `${value}`)
    emit('update:isOpen', value)
  }
})

const onBreadCrumbClick = (targetRoutePath: string[]) => {
  emit('setRouter', targetRoutePath)
}
</script>

<template>
  <div class="header-container">
    <div class="header-left">
      <div
        class="header-menu"
        :class="tempIsOpen ? 'is-open' : 'is-close'"
        @click="tempIsOpen = !tempIsOpen"
      >
        <CustomIcon x-type="material" name="MenuOpenTwotone" />
      </div>

      <RouterLink
        class="header-left-effect"
        :to="{ name: 'locatehome' }"
        v-slot="{ navigate }"
      >
        <CustomIcon name="home" @click="navigate" />
      </RouterLink>
      <MenuBreadcrumb text-align="start" @set-router="onBreadCrumbClick" />
    </div>

    <div class="header-right">
      <div class="header-right-effect">
        <slot name="MenuUser"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
%effect {
  display: flex;
  justify-content: flex-start;
  width: fit-content;
  align-items: center;
  padding: 8px;
  gap: 8px;
  overflow: hidden;
  white-space: nowrap;

  transition-duration: 0.3s;
  color: var(--i-color-menu);
  &:hover {
    color: var(--i-color-menu-hover);
  }
}

.header {
  &-container {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    font-size: 1.2em;
  }

  &-menu {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    font-size: 1.2em;
    cursor: pointer;

    transition-duration: 0.3s;
    color: var(--i-color-menu);
    &:hover {
      color: var(--i-color-menu-hover);
    }
    &.is-open {
      transform: rotateZ(360deg);
    }
    &.is-close {
      transform: rotateZ(180deg);
    }
  }

  &-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;

    &-effect {
      @extend %effect;
    }
  }

  &-right {
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 8px;

    &-effect {
      @extend %effect;
    }
  }
}
</style>
