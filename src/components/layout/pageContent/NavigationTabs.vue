<script setup lang="ts">
import type { ComputedRef, PropType } from 'vue'
import { computed, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import type { Navigation } from '@/declare/routes'
import { useRoutesStore } from '@/stores/stores_routes'
import type { TabsOptions, TabsOption } from '@/components'
import { CustomButton, CustomTabs } from '@/components'
import { defaultModuleType } from '@/i18n/i18n_setting'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const { removeHistoryNavigation, clearHistoryNavigation, addHistoryNavigation } = useRoutesStore()

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

const emit = defineEmits(['RouterChange'])

const currentTab = computed(() => {
  return props.currentNavigation?.name ?? ''
})

const tabs: ComputedRef<TabsOptions> = computed(() => {
  const res = []
  if (props.historyNavigation !== null) {
    props.historyNavigation.forEach((value, key) => {
      res.push({
        label: value.title,
        i18nLabel: key,
        value: key,
        data: value
      })
    })
  }

  return res
})

const removeHistory = (option: TabsOption) => {
  removeHistoryNavigation(`${option.value}`)
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

const RouterChange = (navigate: () => void) => {
  emit('RouterChange')
  navigate()
}
</script>

<template>
  <div class="history-wrapper">
    <CustomTabs
      :model-value="currentTab"
      :options="tabs"
      class="history-tabs"
      closable
      @remove="removeHistory"
    >
      <template #default="slotProps">
        <RouterLink
          :to="slotProps.data.path"
          class="history-tab"
          :class="{ 'is-active': currentTab === slotProps.value }"
          v-slot="{ navigate }"
        >
          <span @click="RouterChange(navigate)">{{ slotProps.label }}</span>
        </RouterLink>
      </template>
    </CustomTabs>

    <div class="history-clear">
      <CustomButton
        :label="i18nTranslate('clear')"
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
      color: #409eff;
    }
  }
  &-clear {
    width: fit-content;
    height: 100%;
    @extend %flex-center;
  }
}
</style>
