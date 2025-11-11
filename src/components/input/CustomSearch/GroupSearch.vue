<script setup lang="ts">
import { ref, useSlots, inject } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { CustomDrawer, CustomButton } from '@/components/feature' // 系統組件
import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/declare/declare_i18n'

import { version, props as groupSearchProps } from './GroupSearchInfo'

const scopedId = getUuid(version)

const props = defineProps(groupSearchProps)

const isShow = ref(false)

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const emit = defineEmits(['reset', 'submit'])

const onResetClick = () => {
  emit('reset')
}

const onSubmitClick = () => {
  emit('submit')
  isShow.value = false
}

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

defineExpose({
  setIsVisible: (value: boolean) => {
    isShow.value = value
  }
})
</script>

<template>
  <div :class="scopedId" class="__group-search">
    <CustomButton
      :label="i18nTranslate('filter')"
      icon-name="filter"
      type="primary"
      @click="isShow = true"
      hover-display
    />

    <CustomDrawer v-model="isShow" :size="props.size" direction="ttb">
      <template #header>
        <div class="__group-header">
          <label>{{ i18nTranslate('search') }}</label>
        </div>
      </template>

      <template #default>
        <div :class="props.class">
          <template v-for="(column, key) in props.columns" :key="`group-search-${key}-${scopedId}`">
            <template v-if="hasSlot(`search-${column.slotKey}`)">
              <slot
                :name="`search-${column.slotKey}`"
                :label="column.label"
                :key="key"
                :prop="key"
                :column="column"
              ></slot>
            </template>
            <template v-else-if="hasSlot('search-all')">
              <slot
                name="search-all"
                :label="column.label"
                :key="key"
                :prop="key"
                :column="column"
              ></slot>
            </template>
          </template>
        </div>
      </template>

      <template #footer>
        <div class="__group-footer">
          <div class="__group-footer-left">
            <slot name="footer"></slot>
          </div>
          <div class="__group-footer-right">
            <CustomButton
              icon-name="chevron-left"
              icon-move="translate"
              :label="i18nTranslate('return')"
              @click="isShow = false"
            />
            <CustomButton
              icon-name="arrow-rotate-left"
              icon-move="rotate"
              type="warning"
              :label="i18nTranslate('reset')"
              @click="onResetClick"
            />
            <CustomButton
              icon-name="search"
              icon-move="scale"
              type="success"
              :label="i18nTranslate('search')"
              @click="onSubmitClick"
            />
          </div>
        </div>
      </template>
    </CustomDrawer>
  </div>
</template>

<style lang="scss" scoped>
.__group {
  &-search {
    width: fit-content;
    height: fit-content;
  }
  &-header {
    width: 100%;
  }
  &-footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 8px;

    &-left, &-right {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      width: fit-content;
      gap: 8px;
    }
  }
}
</style>
