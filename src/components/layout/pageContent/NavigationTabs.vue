<script setup lang="ts">
import type { ComputedRef, PropType } from 'vue'
import { computed } from 'vue'

import type { Navigation } from '@/declare/routes'
import { useRoutesStore } from '@/stores/stores_routes'

import type { ListType, ListItem } from '@/components'
import { CustomButton, CustomTabs } from '@/components'

const {
  removeHistoryNavigation,
  clearHistoryNavigation,
  addHistoryNavigation
} = useRoutesStore()

const props = defineProps({
  historyNavigation: {
    type: Object as PropType<Map<string, Navigation>>,
    required: true
  },
  currentNavigation: {
    type: [Object, null] as PropType<Navigation | null>,
    required: true
  }
})

const currentTab = computed(() => {
  return props.currentNavigation?.name ?? ''
})

const tabs: ComputedRef<ListType> = computed(() => {
  const res = []
  if (props.historyNavigation !== null) {
    props.historyNavigation.forEach((value, key) => {
      res.push({
        key,
        label: value.title,
        value
      })
    })
  }

  return res
})

const removeHistory = (value: ListItem) => {
  removeHistoryNavigation(value.key)
}

const clearHistory = () => {
  const temp = props.currentNavigation
  if (props.historyNavigation.size > 0) {
    clearHistoryNavigation()

    if (temp) {
      addHistoryNavigation(temp.name, temp)
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
        label="清除分頁"
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