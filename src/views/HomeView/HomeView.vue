<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { computed, provide, inject } from 'vue'
import type { Hook } from '@/declare/hook'

import type { Navigation } from '@/declare/routes'
import { useRoutesStore } from '@/stores/routes'
import { getFormSetting } from '@/lib/columns'

import { CustomInput, CustomIcon, CustomButton } from '@/components'
import FeatureTree from './FeatureTree.vue'

import { scrollToEl } from '@/lib/utils'
import debounce from '@/lib/debounce'

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

const {
  columns: formColumn,
  forms: form
} = getFormSetting<Form>(columnSetting, 'search')

provide('search', form)

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const scorllFrist = () => {
  const el = document.querySelector('.__match')

  setTimeout(() => {
    scrollToEl(el)
  }, 200)
}
const debounceScorllFrist = debounce(scorllFrist, 200) as () => void

</script>

<template>
  <div class="home">
    <div class="home-search">
      <CustomInput
        v-model="form.text"
        v-bind="formColumn.text"
        hidden-label
        @change="debounceScorllFrist"
        @keyup.enter="debounceScorllFrist"
      >
        <template #prefix>
          <CustomIcon name="search"/>
        </template>
      </CustomInput>

      <CustomButton
        :label="i18nTranslate('search')"
        type="primary"
        @click="debounceScorllFrist"
      />
    </div>

    <div class="home-tree">
      <FeatureTree :tree="showRoutes"></FeatureTree>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
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