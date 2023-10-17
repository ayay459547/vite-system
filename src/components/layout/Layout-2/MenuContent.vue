<script setup lang="ts">
import type { Navigation } from '@/declare/routes'
import type { AuthData } from '@/stores/stores_api'

import { CustomIcon, CustomTooltip } from '@/components'

import { computed } from 'vue'

const props = defineProps<{
  showRoutes: Navigation[]
  currentRouteName: string
  breadcrumbName: string[]

  historyIsOpen: boolean
  authData: AuthData
  breadcrumbTitle: string[]
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'changeHistory', value: boolean): void
  (e: 'changeLocale'): void
}>()

type Breadcrumb = {
  type: string
  name: string
}
const currentPath = computed<Breadcrumb[]>(() => {
  return props.breadcrumbTitle.reduce((res: Breadcrumb[], crumb, crumbIndex): Breadcrumb[] => {
    if (crumbIndex === 0){
      res.push({
        type: 'text',
        name: crumb
      })
    } else {
      res.push({
        type: 'icon',
        name: ' / '
      }, {
        type: 'text',
        name: crumb
      })
    }

    return res
  }, [])
})

const breadcrumbSpan = computed<string>(() => {
  return currentPath.value.reduce((res, crumb) => {
    return res + crumb.name
  }, '')
})

const getBreadcrumbSpan = () => {
  return breadcrumbSpan.value
}

</script>

<template>
  <div class="menu-wrapper">
    <div class="menu-left">
      <slot name="menu-left"></slot>

      <div class="menu-breadcrumb">
        <div
          v-fixed="{
            text: getBreadcrumbSpan,
            class: 'text-white',
            style: ''
          }"
          class="text ellipsis"
        >{{ breadcrumbSpan }}</div>
      </div>
    </div>

    <div class="menu-right">

    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  &-wrapper {
    width: 100%;
    height: 64px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    font-size: 1.2em;

    background-color: lighten($system-bg-color, 10%);

    color: #ffffff;
  }

  &-left {
    flex: 1;
    display: flex;
    align-content: center;
    gap: 8px;
  }
  &-breadcrumb {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    flex: 1;
    width: 100%;
    height: 40px;
    position: relative;
    .text {
      max-width: 100%;
      width: fit-content;
      line-height: 40px;

      position: absolute;
      left: 0;
      top: 0;
    }
  }

  &-right {
    width: fit-content;
  }
}
</style>
