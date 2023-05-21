<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesStore } from '@/stores/routes'
import type { Navigation } from '@/declare/routes'
import { CustomButton, CustomTabs } from '@/components'

const currentTab = ref('')
const routesStore = useRoutesStore()
const { historyNavigation } = storeToRefs(routesStore)

const { currentNavigation } = storeToRefs(routesStore)
watch(currentNavigation, (newValue) => {
  if (newValue) {
    currentTab.value = newValue.name
  } else {
    currentTab.value = null
  }
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
    routesStore.addHistoryNavigation(temp.name, temp)
  }
}

const setRoutesConfig = (route: Navigation) => {
  routesStore.setBreadcrumb(route.breadcrumb)
  routesStore.setCurrentNavigation(route)
  routesStore.addHistoryNavigation(route.name, route)
}

</script>

<template>
  <div class="history-wrapper">
    <CustomTabs
      v-model="currentTab"
      :list="tabs"
      class="history-tabs"
      @remove="removeHistory"
    >
      <template #default="slotProps">
        <RouterLink
          :to="slotProps.data.path"
          class="history-tab"
          :class="{ 'is-active': currentTab === slotProps.data.name }"
          @click="setRoutesConfig(slotProps.data)"
        >
          {{ slotProps.data.title }}
        </RouterLink>
      </template>
    </CustomTabs>
    <div class="history-clear">
      <CustomButton
        label="清除歷史資訊"
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