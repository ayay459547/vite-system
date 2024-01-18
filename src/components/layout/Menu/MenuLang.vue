<script setup lang="ts">
import { computed, inject } from 'vue'

import type { UseHook, EventItem } from '@/declare/hook'
import { options as langOptions } from '@/i18n'
import { CustomIcon, CustomTooltip } from '@/components'
import { useLocaleStore } from '@/stores/stores_locale'

const useHook: UseHook = inject('useHook')
const { eventList, i18nTranslate } = useHook()

const localeStore = useLocaleStore()

const langCallbackList = computed<EventItem[]>(() => {
  return langOptions.map(option => {
    return {
      icon: [],
      label: option.label,
      event: () => {
        localeStore.currentLang = option.value
      }
    }
  })
})

const openLangType = (e: MouseEvent) => {
  eventList(e, langCallbackList.value, { width: 150 })
}

</script>

<template>
  <div class="lang-container" @click="openLangType">
    <div class="lang-md">
      <CustomIcon name="earth-americas" />
      <span>{{ i18nTranslate('langType') }}</span>
    </div>

    <div class="lang-xs">
      <CustomTooltip>
        <CustomIcon name="earth-americas" />

        <template #content>
          <span>{{ i18nTranslate('langType') }}</span>
        </template>
      </CustomTooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lang {
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
