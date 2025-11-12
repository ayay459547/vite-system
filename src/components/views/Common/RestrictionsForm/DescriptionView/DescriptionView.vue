<script setup lang="ts">
import { inject } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import type { PascalCaseMatchingType, MatchingTypeValue } from '@/types/types_logicRestriction/restrictionsMatchingType'

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: 'fund_common'
})

const MaintainMatchingType: Record<PascalCaseMatchingType, {
  title: string
  description: Record<MatchingTypeValue, string>
}> = {
  StrMatchingType: {
    title: 'StrMatchingType-title',
    description: {
      FULL: 'StrMatchingType-FULL',
      FROM_HEAD: 'StrMatchingType-FROM_HEAD',
      FROM_TAIL: 'StrMatchingType-FROM_TAIL',
      INCLUDE: 'StrMatchingType-INCLUDE',
      INCLUDE_CHARACTER_ORDER_ONLY: 'StrMatchingType-INCLUDE_CHARACTER_ORDER_ONLY',
      REGEX: 'StrMatchingType-REGEX'
    }
  },
  NumMatchingType: {
    title: 'NumMatchingType-title',
    description: {
      LARGE_THAN: 'NumMatchingType-LARGE_THAN',
      LARGE_EQUAL_THAN: 'NumMatchingType-LARGE_EQUAL_THAN',
      LESS_THAN: 'NumMatchingType-LESS_THAN',
      LESS_EQUAL_THAN: 'NumMatchingType-LESS_EQUAL_THAN',
      EQUAL: 'NumMatchingType-EQUAL',
      BETWEEN: 'NumMatchingType-BETWEEN',
      CONTAIN: 'NumMatchingType-CONTAIN',
      PRODUCT_LARGE_THAN: 'NumMatchingType-PRODUCT_LARGE_THAN',
      PRODUCT_LARGE_EQUAL_THAN: 'NumMatchingType-PRODUCT_LARGE_EQUAL_THAN',
      PRODUCT_LESS_THAN: 'NumMatchingType-PRODUCT_LESS_THAN',
      PRODUCT_LESS_EQUAL_THAN: 'NumMatchingType-PRODUCT_LESS_EQUAL_THAN',
      PRODUCT_EQUAL: 'NumMatchingType-PRODUCT_EQUAL'
    }
  },
  DateMatchingType: {
    title: 'DateMatchingType-title',
    description: {
      BETWEEN: 'DateMatchingType-BETWEEN'
    }
  }
}
</script>

<template>
  <div class="flex-column i-ga-md">
    <div
      v-for="({title, description}, PascalCaseMatchingType) of MaintainMatchingType"
      :key="PascalCaseMatchingType"
      class="flex-column i-ga-xs"
    >
      <label>{{ i18nTranslate(title) }}</label>
      <div>
        <div v-for="(value, key) of description" :key="`${PascalCaseMatchingType}-${key}`">
          {{ `${key} ： ${i18nTranslate(value)}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
