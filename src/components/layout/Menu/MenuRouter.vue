<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import type { Navigation } from '@/declare/routes'
import { CustomIcon, CustomTooltip } from '@/components'
import { computed, inject } from 'vue'

import { hasOwnProperty } from '@/lib/lib_utils'
import { useRouter } from 'vue-router'
import { routesHook } from '@/lib/lib_routes'

const hook: Hook = inject('hook')
const { i18nTranslate, eventList } = hook()
const { getRouteIcon, getRouteTitle } = routesHook()

const props = defineProps<{
  showRoutes: Navigation[]
  currentNavigation: Navigation
  breadcrumbName: string[]
}>()

const emit = defineEmits<{
  (e: 'setLevel2Router', level2List: Navigation): void
}>()

const router = useRouter()

const currentRouteName = computed(() => {
  const [
    level1Active = '',
    level2Active = '',
    level3Active = ''
  ] = props.breadcrumbName

  return {
    level1: level1Active,
    level2: level2Active,
    level3: level3Active
  }
})

const openRouterList = (e: MouseEvent) => {
  const level1List = props.showRoutes
  eventList(e, level1List.map(level1Item => {
    const { name } = level1Item

    return {
      icon: getRouteIcon(level1Item),
      label: getRouteTitle(level1Item),
      active: level1Item.name === currentRouteName.value.level1,
      event: () => {
        if (hasOwnProperty.call(level1Item, 'leaves')) {
          emit('setLevel2Router', level1Item)
        } else {
          emit('setLevel2Router', level1Item)
          router.push({ name })
        }
      }
    }
  }), {
    width: 180
  })
}

</script>

<template>
  <div class="router-container" @click="openRouterList">
    <div class="router-md">
      <CustomIcon :icon="['fas', 'list']"/>
      <span>{{ i18nTranslate('systemModule') }}</span>
    </div>

    <div class="router-xs">
      <CustomTooltip>
        <CustomIcon :icon="['fas', 'list']"/>

        <template #content>
          <span>{{ i18nTranslate('systemModule') }}</span>
        </template>
      </CustomTooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.router {
  &-container {
    width: fit-content;
    height: fit-content;
    cursor: pointer;
  }

  &-md {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  &-xs {
    display: none;
  }

  @media (max-width: 768px) {
    &-md {
      display: none;
    }
    &-xs {
      display: block;
    }
  }
}
</style>
