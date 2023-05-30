<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesStore } from '@/stores/routes'
import type { Navigation } from '@/declare/routes'
import { CustomButton, CustomTabs } from '@/components'

const routesStore = useRoutesStore()
const { historyNavigation, currentNavigation } = storeToRefs(routesStore)

const currentTab = computed(() => {
  return currentNavigation.value?.name ?? ''
})

type ListType = Array<{
  key: string
  value: any
}>

const tabs: ComputedRef<ListType> = computed(() => {
  const res = []
  // historyNavigation: Map
  historyNavigation.value.forEach((value, key) => {
    res.push({ key, value })
  })

  return res
})

const removeHistory = (value: Navigation) => {
  routesStore.removeHistoryNavigation(value.name)
}

const clearHistory = () => {
  const temp = currentNavigation.value
  if (historyNavigation.value.size > 0) {
    routesStore.clearHistoryNavigation()

    if (temp) {
      routesStore.addHistoryNavigation(temp.name, temp)
    }
  }
}

</script>

<template>
  <div class="history-wrapper">
    <CustomTabs
      :model-value="currentTab"
      :list="tabs"
      class="history-tabs"
      @remove="removeHistory"
    >
      <template #default="slotProps">
        <RouterLink
          :to="slotProps.data.path"
          class="history-tab"
          :class="{ 'is-active': currentTab === slotProps.data.name }"
        >
          {{ slotProps.data.title }}
        </RouterLink>
      </template>
    </CustomTabs>

    <div class="history-clear">
      <CustomButton
        label="清除路由資訊"
        icon-name="broom"
        icon-move="rotate"
        @click="clearHistory"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.history {
  &-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
  }
  &-tabs {
    width: inherit;
    flex: 1;
  }
  &-tab {
    color: #303133;

    &.is-active {
      color: #409EFF;
    }
  }
  &-clear {
    width: fit-content;
    height: 100%;
    @extend %flex-center;
  }
}
</style>