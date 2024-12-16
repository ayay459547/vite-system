<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, inject } from 'vue'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { CustomTableTypes } from '@/components' // 系統組件
import {
  CustomPopover,
  CustomButton,
  CustomDraggable,
  CustomInput,
  CustomBadge,
  CustomIcon,
  CustomTooltip
} from '@/components' // 系統組件

const props = defineProps({
  i18nModule: {
    type: String as PropType<ScopeKey>,
    required: false,
    default: defaultModuleType,
    description: 'i18nModule'
  },
  modelValue: {
    type: Array as PropType<CustomTableTypes.Sorting[]>,
    required: true
  },
  settingWidth: {
    type: Number as PropType<number>,
    default: 150,
    description: '寬度'
  },
  settingHeight: {
    type: String as PropType<string>,
    required: false,
    default: '100%',
    description: '列表高度'
  }
})

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: props.i18nModule
})

const emit = defineEmits(['update:model-value', 'reset-sorting', 'submit'])

const tempValue = computed({
  get: () => props.modelValue,
  set: (value: CustomTableTypes.Sorting[]) => {
    emit('update:model-value', value)
  }
})

const activeIndexMap = computed(() => {
  let index = 1
  return props.modelValue.reduce((res, curr) => {
    if (curr.order !== 'none') {
      res[curr.key] = index
      index++
    } else {
      res[curr.key] = -1
    }
    return res
  }, {})
})

const setSortingValue = (order: CustomTableTypes.Order, key: string) => {
  const columnIndex = props.modelValue.findIndex(item => item.key === key)
  const _temp = props.modelValue[columnIndex]

  const newValue = [...props.modelValue]
  newValue[columnIndex] = {..._temp, key, order}
  tempValue.value = newValue
}
const options = [
  { label: i18nTranslate('order-ascending', defaultModuleType), value: 'ascending' },
  { label: i18nTranslate('none-var', defaultModuleType), value: 'none' },
  { label: i18nTranslate('order-descending', defaultModuleType), value: 'descending' }
]

const resetSorting = () => {
  emit('reset-sorting')
}

const visible = ref(false)

const submit = () => {
  emit('submit')
  visible.value = false
}
</script>

<template>
  <div class="__group-wrapper">
    <CustomPopover
      v-model:visible="visible"
      :width="props.settingWidth"
      trigger="click"
      placement="bottom-end"
      popper-style="padding: 4px;"
    >
      <template #reference>
        <CustomButton
          icon-name="arrow-down-short-wide"
          :label="i18nTranslate('sorting', defaultModuleType)"
        />
      </template>

      <div>
        <div
          :style="{
            maxHeight: props.settingHeight,
            overflow: 'auto'
          }"
        >
          <CustomDraggable
            v-model="tempValue"
            item-key="key"
            class="__group-container __column-list"
            :handle="`.sorting-move`"
            :style="{ maxHeight: props.settingHeight, overflow: 'auto' }"
          >
            <template #item="{ element }">
              <div class="__column-item sorting-move" :class="element.order !== 'none' ? 'is-active' : ''">
                <div class="__column-item-left">
                  <CustomInput
                    :model-value="element.order"
                    @update:model-value="setSortingValue($event, element.key)"
                    :validate-key="`GroupSorting:${element.key}`"
                    :label="i18nTranslate(element?.i18nLabel ?? element.label)"
                    type="radio"
                    :options="options"
                  >
                    <template #options="{ value, label }">
                      <CustomTooltip placement="bottom" :show-after="200">
                        <template #content>
                          <span class="__column-item-text">{{ label }}</span>
                        </template>
                        <!-- 遞增 -->
                        <CustomIcon v-if="value === 'ascending'" name="arrow-down-short-wide"/>
                        <!-- 不排序 -->
                        <CustomIcon v-else-if="value === 'none'" name="ban"/>
                        <!-- 遞減 -->
                        <CustomIcon v-else-if="value === 'descending'" name="arrow-down-wide-short"/>
                      </CustomTooltip>
                    </template>
                  </CustomInput>
                </div>

                <div class="__column-item-right">
                  <CustomBadge
                    :value="activeIndexMap[element.key]"
                    :hidden="activeIndexMap[element.key] <= 0"
                  >
                    <CustomIcon x-type="tabler" name="ArrowsUpDown" />
                  </CustomBadge>
                </div>
              </div>
            </template>
          </CustomDraggable>
        </div>

        <div class="__column-reset">
          <CustomButton
            :label="i18nTranslate('reset', defaultModuleType)"
            type="info"
            plain
            icon-name="repeat"
            @click="resetSorting"
          />

          <CustomButton
            :label="i18nTranslate('submit', defaultModuleType)"
            type="primary"
            plain
            icon-name="check"
            icon-move="scale"
            @click="submit"
          />
        </div>
      </div>
    </CustomPopover>
  </div>
</template>

<style lang="scss" scoped>
.__group {
  &-wrapper {
    width: fit-content;
    height: fit-content;
  }
  &-container {
    width: 100%;
    height: 100%;
    padding-top: 4px;
  }
}

.__column {
  &-list {
    display: flex;
    flex-direction: column;
    max-height: 60vh;
    height: fit-content;
    overflow: auto;
  }
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0 0 16px;
    width: 100%;
    cursor: move;
    border-bottom: 1px solid var(--el-border-color);

    background-color: inherit;
    transition-duration: 0.3s;
    &:hover {
      background-color: var(--el-color-primary-light-9);
    }

    & {
      opacity: 0.7;
      font-weight: 600 !important;
    }

    &-left {
      width: 100%;
      overflow: hidden;
    }
    &-right {
      width: 40px;
    }
    &.is-active {
      opacity: 1;
    }

    &-text {
      font-size: 1.2em;
      font-weight: 400;
      color: var(--el-text-color-primary);
    }
  }

  &-reset {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 6px;
    padding: 4px;
  }
}
</style>
