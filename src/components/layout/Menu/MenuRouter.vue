<script setup lang="ts">
import { inject } from 'vue'
import { useRouter } from 'vue-router'

import type { UseHook } from '@/declare/hook'
import type { Navigation } from '@/declare/routes'
import type { CurrentRouteName } from '@/components/layout/SystemLayout.vue'
import { CustomIcon, CustomTooltip } from '@/components'
import { hasOwnProperty } from '@/lib/lib_utils'
import { useRoutesHook } from '@/lib/lib_routes'
import { defaultModuleType } from '@/i18n/i18n_setting'

const useHook: UseHook = inject('useHook')
const { i18nTranslate, eventList } = useHook({
  i18nModule: defaultModuleType
})
const { getRouteIcon, getRouteTitle } = useRoutesHook()

const props = defineProps<{
  showRoutes: Navigation[]
  currentNavigation: Navigation
  currentRouteName: CurrentRouteName
}>()

const emit = defineEmits<{
  (e: 'setLevel2Router', level2List: Navigation): void
}>()

const router = useRouter()

const openRouterList = (e: MouseEvent) => {
  const level1List = props.showRoutes
  eventList(
    e,
    level1List.map(level1Item => {
      const { name } = level1Item

      return {
        icon: getRouteIcon(level1Item),
        label: getRouteTitle(level1Item),
        active: level1Item.name === props.currentRouteName.level1,
        event: () => {
          if (hasOwnProperty(level1Item, 'leaves')) {
            emit('setLevel2Router', level1Item)
          } else {
            emit('setLevel2Router', level1Item)
            router.push({ name })
          }
        }
      }
    }),
    {
      width: 180
    }
  )
}
</script>

<template>
  <div class="router-container" @click="openRouterList">
    <div class="router-md">
      <CustomIcon :icon="['fas', 'list']" />
      <span>{{ i18nTranslate('system-module') }}</span>
    </div>

    <div class="router-xs">
      <CustomTooltip>
        <CustomIcon :icon="['fas', 'list']" />

        <template #content>
          <span>{{ i18nTranslate('system-module') }}</span>
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
