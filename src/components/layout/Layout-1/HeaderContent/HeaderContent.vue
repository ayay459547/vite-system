<script setup lang="ts">
import { computed, useSlots } from 'vue'

import MenuBreadcrumb from '@/components/layout/Menu/MenuBreadcrumb.vue'
import MenuHome from '@/components/layout/Menu/MenuHome.vue'
import MenuUser from '@/components/layout/Menu/MenuUser.vue'
import type { AuthData } from '@/stores/api'
// import MenuLang from '@/components/layout/Menu/MenuLang.vue'

import HamburgerIcon from './HamburgerIcon.vue'

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const props = defineProps<{
  isOpen: boolean
  historyIsOpen: boolean
  authData: AuthData
  breadcrumbTitle: string[]
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'logout'): void
  (e: 'changeHistory', value: boolean): void
  (e: 'preferences'): void
  (e: 'changeRouter'): void
}>()

const onChangeHistory = ($event: boolean) => {
  emit('changeHistory', $event)
}

const tempIsOpen = computed<boolean>({
  get () { return props.isOpen },
  set (value) {
    localStorage.setItem('navIsOpen', `${value}`)
    emit('update:isOpen', value)
  }
})

const onChangeRouter = () => {
  emit('changeRouter')
}

</script>

<template>
  <div class="header-container">
    <div class="header-left">
      <HamburgerIcon v-model:isOpen="tempIsOpen" class="header-hamburger" />
      <slot name="header-left"></slot>
      <MenuBreadcrumb :breadcrumb-title="props.breadcrumbTitle" text-align="start"/>
    </div>

    <div class="header-right">

      <div v-if="hasSlot('header-right')" class="header-right-effect">
        <slot name="header-right"></slot>
      </div>

      <div class="header-right-effect">
        <MenuHome @change-router="onChangeRouter"/>
      </div>
      <div class="header-right-effect">
        <MenuUser
          :auth-data="props.authData"
          :history-is-open="props.historyIsOpen"
          @change-history="onChangeHistory"
          @logout="emit('logout')"
          @preferences="emit('preferences')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  &-container {
    width: 100%;
    height: 56px;

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
  }

  &-right {
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 8px;

    &-effect {
      display: flex;
      justify-content: flex-start;
      width: fit-content;
      align-items: center;
      padding: 8px;
      gap: 8px;
      overflow: hidden;
      white-space: nowrap;

      transition-duration: 0.3s;
      color: #535353;

      &:hover {
        color: $primary;
      }
    }
  }
}
</style>
