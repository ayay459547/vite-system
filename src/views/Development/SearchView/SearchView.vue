<script setup lang="ts">
import { type ComputedRef, computed, provide, inject } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import type { Navigation } from '@/types/types_routes'
import { useRoutesStore } from '@/stores/useRoutesStore'
import { useFormSetting } from '@/lib/lib_columns'
import { CustomIcon, CustomButton } from '@/components/feature'
import { CustomInput } from '@/components/input'
import { scrollToEl } from '@/lib/lib_utils' // 工具
import { debounce } from '@/lib/lib_lodash'

import FeatureTree from './FeatureTree.vue'

const routesStore = useRoutesStore()

const showRoutes: ComputedRef<Navigation[]> = computed(() => {
  return routesStore.navigationRoutes
})

const columnSetting = {
  text: {
    label: '搜尋',
    search: {
      default: ''
    }
  }
}

interface Form {
  text: string
}

const { columns: formColumn, forms: form } = useFormSetting<Form>(columnSetting, 'search')

provide('search', form)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook()

const scorllFrist = () => {
  const el = document.querySelector('.__match')

  setTimeout(() => {
    scrollToEl(el)
  }, 200)
}
const debounceScorllFrist = debounce(scorllFrist, 200) as () => void
</script>

<template>
  <div class="locatehome">
    <div class="locatehome-search">
      <CustomInput
        v-model="form.text"
        v-bind="formColumn.text"
        hidden-label
        @change="debounceScorllFrist"
        @keyup.enter="debounceScorllFrist"
      >
        <template #prefix>
          <CustomIcon name="search" />
        </template>
      </CustomInput>

      <CustomButton :label="i18nTranslate('search')" type="primary" @click="debounceScorllFrist" />
    </div>

    <div class="locatehome-tree">
      <FeatureTree :tree="showRoutes"></FeatureTree>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.locatehome {
  width: 100%;
  height: calc(100% - 16px);
  padding: 16px;

  &-search {
    width: 100%;
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }

  &-tree {
    height: calc(100% - 52px);
    overflow: auto;
  }
}
</style>
