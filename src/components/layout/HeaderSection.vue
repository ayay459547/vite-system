<script setup lang="ts">
import type { WritableComputedRef, ComputedRef } from 'vue'
import { computed, inject } from 'vue'

import HamburgerIcon from './HamburgerIcon.vue'
import { useRoutesStore } from '@/stores/routes'

import { options as langOptions } from '@/i18n/i18n'
import { useLocaleStore } from '@/stores/locale'
import type { Hook, EventItem } from '@/declare/hook'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()

const tempIsOpen: WritableComputedRef<boolean> = computed({
  get: () => props.isOpen,
  set: value => emit('update:isOpen', value)
})

const routesStore = useRoutesStore()

type Breadcrumb = {
  type: string
  name: string
}
const currentPath:ComputedRef<Breadcrumb[]> = computed(() => {
  return routesStore.breadcrumb.reduce((res: Breadcrumb[], crumb, crumbIndex): Breadcrumb[] => {
    if (crumbIndex === 0){
      res.push({
        type: 'text',
        name: crumb
      })
    } else {
      res.push({
        type: 'icon',
        name: '/'
      }, {
        type: 'text',
        name: crumb
      })
    }

    return res
  }, [])
})

const userName = 'AAT'

const localeStore = useLocaleStore()

const hook: () => Hook = inject('hook')
const { openEventList } = hook()

const eventList = computed<EventItem[]>(() => {
  return langOptions.map(option => {
    return {
      icon: [],
      label: option.label,
      event: () => {
        localeStore.currentLang = option.value
      }
    }
  })
})

const openLangType = (e: MouseEvent) => {
  openEventList(e, eventList.value)
}

</script>

<template>
  <div class="header-container">
    <div class="header-left">
      <HamburgerIcon v-model:isOpen="tempIsOpen"></HamburgerIcon>

      <template v-for="(path, pathIndex) in currentPath" :key="pathIndex">
        <span v-if="path.type === 'text'">{{ path.name }}</span>
        <span v-else>{{ ' / ' }}</span>
      </template>
    </div>
    <div class="header-right">
      <div class="header-right-effect lang" @click="openLangType">
        <CustomIcon name="earth-americas"/>
        <span>{{ $t('langType') }}</span>
      </div>

      <div class="header-right-effect">
        <CustomIcon name="user" />
        <span>{{ 'hi! ' + userName }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  &-container {
    width: 100%;
    height: 64px;
    background-color: #e6e6e6;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    font-size: 1.2em;
  }

  &-left {
    display: flex;
    align-items: center;
    gap: 16px;
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
      cursor: pointer;
      transition-duration: 0.2s;

      &:hover {
        color: $primary;
      }
      &.lang {
        width: 130px;
      }
    }
  }
}
</style>