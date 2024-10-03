<script setup lang="ts">
import { computed } from 'vue'

import MenuBreadcrumb from '@/components/layout/Menu/MenuBreadcrumb.vue'
import MenuUser from '@/components/layout/Menu/MenuUser.vue'
import type { AuthData } from '@/declare/hook'

import HamburgerIcon from './HamburgerIcon.vue'

const props = defineProps<{
  isOpen: boolean
  authData: AuthData
  breadcrumbName: string[]
  breadcrumbTitle: string[]
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'logout'): void
  (e: 'preference'): void
  (e: 'setRouter', value: string[]): void
}>()

const tempIsOpen = computed<boolean>({
  get() {
    return props.isOpen
  },
  set(value) {
    localStorage.setItem('isNavOpen', `${value}`)
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
      <HamburgerIcon v-model:isOpen="tempIsOpen" class="header-hamburger" />
      <RouterLink
        class="header-left-effect"
        :to="{ name: 'locatehome' }"
        v-slot="{ navigate }"
      >
        <CustomIcon name="home" @click="navigate" />
      </RouterLink>
      <MenuBreadcrumb
        :breadcrumb-name="props.breadcrumbName"
        :breadcrumb-title="props.breadcrumbTitle"
        text-align="start"
        @set-router="onBreadCrumbClick"
      />
    </div>

    <div class="header-right">
      <div class="header-right-effect">
        <MenuUser
          :auth-data="props.authData"
          @logout="emit('logout')"
          @preference="emit('preference')"
        />
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

  &-hamburger {
    display: block;
  }

  &-left {
    display: flex;
    align-items: center;
    gap: 16px;
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
