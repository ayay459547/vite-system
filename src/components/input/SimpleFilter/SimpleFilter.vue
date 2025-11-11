<script setup lang="ts">
import { inject, computed, ref, useSlots } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import CustomPopover from '@/components/feature/CustomPopover/CustomPopover.vue'
import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具
import { object_reduce } from '@/lib/lib_object'

import { version, props as simpleFilterProps } from './SimpleFilterInfo'

const props = defineProps(simpleFilterProps)
const emit = defineEmits(['reset', 'submit'])

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook()

const scopedId = getUuid('__i-simple-filter__')

const columnList = computed(() => {
  return object_reduce<any[]>(props.columns, (res: any[], curr: any) => {
    res.push(curr)
    return res
  }, [])
})

const isVisible = ref(false)

defineExpose({
  setIsVisible(visible: boolean) {
    isVisible.value = visible
  }
})

const slots: Record<string, any> = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

</script>

<template>
  <div class="__i-simple-filter__" :class="[`SimpleFilter_${version}`, `${scopedId}`]">
    <CustomPopover
      :visible="isVisible"
      :placement="props.placement"
      :width="props.width"
      popper-style="padding: 0px;"
    >
      <template #default>
        <div class="filter-container">
          <div class="filter-header">
            <CustomButton
              icon-name="close"
              text
              @click="isVisible = false"
            ></CustomButton>
          </div>

          <div class="filter-body" :class="props.class">
            <template v-for="column in columnList" :key="`filter-${column.key}-${scopedId}`">
              <template v-if="hasSlot(`filter-${column.key}`)">
                <slot
                  :name="`filter-${column.key}`"
                  :key="column.key"
                  :prop="column.key"
                  :label="column.label"
                  :column="column"
                ></slot>
              </template>
              <template v-else-if="hasSlot('filter-all')">
                <slot
                  name="filter-all"
                  :key="column.key"
                  :prop="column.key"
                  :label="column.label"
                  :column="column"
                ></slot>
              </template>
              <div v-else>empty</div>
            </template>
          </div>

          <div class="filter-footer">
            <CustomButton
              icon-name='chevron-left'
              icon-move='translate'
              :label="i18nTranslate('return')"
              @click="isVisible = false"
            ></CustomButton>
            <CustomButton
              icon-name='arrow-rotate-left'
              icon-move='rotate'
              type='warning'
              :label="i18nTranslate('reset')"
              @click="emit('reset')"
            ></CustomButton>
            <CustomButton
              icon-name='search'
              icon-move='scale'
              type='success'
              :label="i18nTranslate('search')"
              @click="emit('submit')"
            ></CustomButton>
          </div>
        </div>
      </template>
      <template #reference>
        <CustomButton
          icon-name='filter'
          type='primary'
          :label="i18nTranslate('filter')"
          @click="isVisible = !isVisible"
        ></CustomButton>
      </template>
    </CustomPopover>
  </div>
</template>

<style lang="scss" scoped>
.__i-simple-filter__ {
  width: fit-content;
  height: fit-content;
}

.filter {
  &-container {
    width: 100%;
    padding: 8px 24px;
  }

  &-header,
  &-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  &-footer {
    gap: 8px;
    padding: 8px;
  }

  &-body {
    width: 100%;
  }
}
</style>
