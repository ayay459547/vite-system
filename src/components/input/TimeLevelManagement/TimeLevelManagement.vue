<script setup lang="ts">
import { computed, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import {
  CustomPopover,
  CustomIcon,
  CustomInput,
  CustomButton
} from '@/components' // 系統組件

import type { Types } from './TimeLevelManagementInfo'
import { props as managementProps } from './TimeLevelManagementInfo'

const props = defineProps(managementProps)

const useHook: UseHook = inject('useHook')
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: props.i18nModule
})

const emit = defineEmits([
  'activeChange',
  'baseChange',
  'update:baseLevelIndex'
])

const baseLevelIndex = computed(() => props.baseLevelIndex)
const timeLevelActive = computed(() => {
  if(props.activeLevelIndexs) {
    // 由 activeLevelIndex 判斷 options 是否為 active
    return props.options.map(option =>
      props.activeLevelIndexs.includes(option.index)
    )
  } else {
    // 把 active 綁訂在 options 上
    return props.options.map(option => option.active)
  }
})

const setTimeLevelActive = (timeLevel: Types.TimeLevelOption) => {
  // 切換 checkBox
  timeLevel.active =  !timeLevel.active
  emit('activeChange')
}
const setBaseLevel = (timeLevel: Types.TimeLevelOption) => {
  emit('update:baseLevelIndex', timeLevel.index)
  emit('baseChange', timeLevel.index)
}

const isBaseLevel = (timeLevel: Types.TimeLevelOption) => {
  return timeLevel.index === baseLevelIndex.value
}
const isUpperLevel = (timeLevel: Types.TimeLevelOption) => {
  return timeLevel.index >= baseLevelIndex.value
}
const getOptionClass = (timeLevel: Types.TimeLevelOption) => {
  if(isBaseLevel(timeLevel)) return 'base-level' // 基準時間維度
  if(isUpperLevel(timeLevel)) return 'upper-level' // 大於基準維度的時間維度
  return 'lower-level' // 小於基準維度的時間維度
}

// i18nTranslate
const getTranslateLabel = (timeLevel: Types.TimeLevelOption) => {
  const label = i18nTest(timeLevel?.i18nLabel ?? '')
    ? i18nTranslate(timeLevel.i18nLabel)
    : (timeLevel?.label ?? timeLevel?.name)
  return label
}

</script>

<template>
  <CustomPopover
    :offset="5"
    :placement="props.placement"
    popperStyle="padding: 2px"
  >
    <template #default>
      <div class="option-container">
        <template v-for="(timeLevel, index) in props.options" :key="index">
          <div class="option-item" :class="getOptionClass(timeLevel)">
            <CustomInput
              :model-value="timeLevelActive[index]"
              :label="getTranslateLabel(timeLevel)"
              hidden-label
              type="checkbox"
              @change="setTimeLevelActive(timeLevel)"
            />
            <CustomButton
              :icon-type="isBaseLevel(timeLevel) ? 'fas' : 'far'"
              class="star-btn"
              icon-name="star"
              icon-size="small"
              text
              size="small"
              @click="setBaseLevel(timeLevel)"
            />
          </div>
        </template>
      </div>
    </template>

    <template #reference>
      <CustomIcon
        class="cursor-pointer"
        :size="props.iconSize"
        :icon="['far', 'clock']"
      />
    </template>
  </CustomPopover>
</template>

<style lang="scss" scoped>
.option {
  &-container {
    display: flex;
    flex-direction: column;
  }
  &-item {
    display: flex;
    padding: 0 4px 0 8px;
    align-items: center;
    border-bottom: 3px solid #00000000;

    transition-duration: 0.2s;
    &:hover {
      background-color: var(--el-color-primary-light-9);
    }

    &.lower-level {
      background-color: var(--el-text-color-disabled);
      opacity: 0.8;
    }
    &.base-level {
      // background-color: rgb(255, 231, 186);
      // border-bottom: 3px solid orange;
      background-color: var(--el-color-warning-light-7);
      border-bottom: 3px solid var(--el-color-warning-light-5);

      .star-btn {
        color: var(--i-color-orange);
      }
      &:hover {
        background-color: var(--el-color-warning-light-8);
      }
    }
  }
}
</style>
