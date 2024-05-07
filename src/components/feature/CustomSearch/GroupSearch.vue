<script setup lang="ts">
import { ref, useSlots, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import { CustomDrawer, CustomButton } from '@/components'
import { getUuid } from '@/lib/lib_utils'

import { version, props as groupSearchProps } from './GroupSearchInfo'

const scopedId = getUuid('__i-group-search__')

const props = defineProps(groupSearchProps)

const isShow = ref(false)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'system'
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
  return !!slots[prop]
}

defineExpose({
  setIsVisible: (value: boolean) => {
    isShow.value = value
  }
})
</script>

<template>
  <div :class="`GroupSearch_${version} ${scopedId}`" class="__group-search">
    <CustomButton
      :label="i18nTranslate('filter')"
      icon-name="filter"
      type="primary"
      @click="isShow = true"
    />

    <CustomDrawer v-model="isShow" :size="props.size" direction="ttb">
      <template #header>
        <div class="__group-header">
          <label>{{ i18nTranslate('search') }}</label>
        </div>
      </template>

      <template #default>
        <div :class="props.class">
          <template v-for="(column, key) in props.columns" :key="key">
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
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>
