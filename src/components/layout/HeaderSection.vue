<script setup lang="ts">
import type { WritableComputedRef, ComputedRef } from 'vue'
import { defineProps, computed } from 'vue'

import HamburgerIcon from './HamburgerIcon.vue'
import { useRoutesStore } from '@/stores/routes'

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
      <AdvantIcon></AdvantIcon>
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
    width: 30px;
    height: 30px;
    border: 1px solid #e6e6e6;
    border-radius: 6px;
  }
}
</style>