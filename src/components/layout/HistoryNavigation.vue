<script setup lang="ts">
import type { WritableComputedRef } from 'vue'
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesStore } from '@/stores/routes'
import type { Navigation } from '@/declare/routes'

const currentTab = ref('')
const routesStore = useRoutesStore()
const { historyNavigation } = storeToRefs(routesStore)

const { currentNavigation } = storeToRefs(routesStore)
watch(currentNavigation, (newValue) => {
  currentTab.value = newValue.name
})

type ListType = Array<{
  key: string
  value: any
}>

const sortTabs = ref<ListType>([])

const tabs: WritableComputedRef<ListType> = computed({
  get: () => {
    const res = new Array(sortTabs.value.length)

    historyNavigation.value.forEach((value, key) => {
      const insertIndex = sortTabs.value.findIndex(tab => {
        return tab.key === key
      })

      if (insertIndex >= 0) {
        res[insertIndex] = { key, value }
      } else {
        res.push({ key, value })
      }
    })

    return res
  },
  set: (value: ListType) => { sortTabs.value = value}
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
    <AdvantTabs
      v-model="currentTab"
      v-model:list="tabs"
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
    </AdvantTabs>
    <div class="history-clear">
      <AdvantButton icon-name="trash-can" @click="clearHistory">
        清除
      </AdvantButton>
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