<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import type { ScopeKey } from '@/i18n/i18n_setting'
import {
  CustomPopover,
  CustomButton,
  CustomDraggable,
  CustomInput,
  CustomBadge
} from '@/components'

import type { Sorting, Order } from '../CustomTableInfo'

const props = defineProps({
  i18nModule: {
    type: String as PropType<ScopeKey>,
    required: false,
    default: 'system',
    description: 'i18nModule'
  },
  modelValue: {
    type: Array as PropType<Sorting[]>,
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

const emit = defineEmits(['update:modelValue', 'reset-sorting', 'submit'])

const tempValue = computed({
  get: () => props.modelValue,
  set: (value: Sorting[]) => {
    emit('update:modelValue', value)
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

const setSortingValue = (order: Order, key: string) => {
  const columnIndex = props.modelValue.findIndex(item => item.key === key)
  const _temp = props.modelValue[columnIndex]

  const newValue = [...props.modelValue]
  newValue[columnIndex] = {
    ..._temp,
    key,
    order
  }

  tempValue.value = newValue
}

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
      :width="props.settingWidth + 120"
      trigger="click"
      placement="bottom-end"
      popper-style="padding: 4px;"
    >
      <template #reference>
        <CustomButton
          icon-name="arrow-down-short-wide"
          :label="i18nTranslate('sorting', 'system')"
        />
      </template>

      <div>
        <div :style="{
          maxHeight: props.settingHeight,
          overflow: 'auto'
        }">
          <CustomDraggable
            v-model="tempValue"
            item-key="key"
            class="__group-container __column-list"
            :handle="`.sorting-move`"
            :style="{
              maxHeight: props.settingHeight,
              overflow: 'auto'
            }"
          >
            <template #item="{ element }">
              <div class="__column-item" :class="element.order !== 'none' ? 'is-active' : ''">
                <div class="__column-item-left">
                  <CustomInput
                    :model-value="element.order"
                    :validate-key="`GroupSorting:${element.key}`"
                    @update:model-value="setSortingValue($event, element.key)"
                    :label="i18nTranslate(element?.i18nLabel ?? element.label)"
                    type="radio"
                    :options="[
                      { label: i18nTranslate('ascending'), value: 'ascending' },
                      { label: i18nTranslate('empty'), value: 'none' },
                      { label: i18nTranslate('descending'), value: 'descending' }
                    ]"
                  />
                </div>

                <div class="__column-item-right">
                  <CustomBadge :value="activeIndexMap[element.key]" :hidden="activeIndexMap[element.key] <= 0">
                    <CustomButton
                      type="info"
                      icon-name="right-left"
                      text
                      :class="element.order !== 'none' ? 'sorting-move' : ''"
                      :disabled="element.order === 'none'"
                      style="transform: rotateZ(90deg);"
                    />
                  </CustomBadge>
                </div>
              </div>
            </template>
          </CustomDraggable>
        </div>

        <div class="__column-reset">
          <CustomButton
            :label="i18nTranslate('reset', 'system')"
            type="info"
            plain
            icon-name="repeat"
            @click="resetSorting"
          />

          <CustomButton
            :label="i18nTranslate('confirm', 'system')"
            type="success"
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
    background-color: #fff;
    transition-duration: 0.3s;
    padding: 6px 0 0 16px;
    width: 100%;
    &:hover {
      background-color: #f5f7fa;
    }

    opacity: 0.7;
    transition-duration: 0.3s;
    font-weight: 600 !important;
    &-left {
      width: 100%;
      overflow: hidden;
    }
    &-right {
      width: 80px;
    }
    &.is-active {
      opacity: 1;
    }
  }

  &-reset {
    display: flex;
    justify-content: space-between;
    padding: 8px 8px 4px;
  }
}
</style>
