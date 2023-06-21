<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import { storeToRefs } from 'pinia'
import { useRoutesStore } from '@/stores/routes'

import type { ListType, ListItem } from '@/components'
import { CustomButton, CustomTabs } from '@/components'

const routesStore = useRoutesStore()
const { historyNavigation, currentNavigation } = storeToRefs(routesStore)

const currentTab = computed(() => {
  return currentNavigation.value?.name ?? ''
})

const tabs: ComputedRef<ListType> = computed(() => {
  const res = []
  // historyNavigation is Map
  historyNavigation.value.forEach((value, key) => {
    res.push({
      key,
      label: value.title,
      value
    })
  })

  return res
})

const removeHistory = (value: ListItem) => {
  routesStore.removeHistoryNavigation(value.key)
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
      remove
      @remove="removeHistory"
    >
      <template #default="slotProps">
        <RouterLink
          :to="slotProps.value.path"
          class="history-tab"
          :class="{ 'is-active': currentTab === slotProps.key }"
          v-slot="{ navigate }"
        >
          <span @click="navigate">{{ slotProps.label }}</span>
        </RouterLink>
      </template>
    </CustomTabs>

    <div class="history-clear">
      <CustomButton
        label="清除路由選項"
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