<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { Sorting, Order } from '../CustomTable.vue'
import type { Sort } from '@/components'

import {
  CustomPopover,
  CustomButton,
  CustomDraggable,
  CustomInput
} from '@/components'

const props = defineProps({
  modelValue: {
    type: Array as PropType<Sorting[]>,
    required: true
  },
  settingWidth: {
    type: Number as PropType<number>,
    default: 150,
    description: '寬度'
  }
})

const emit = defineEmits(['update:modelValue'])

const tempValue = computed({
  get: () => props.modelValue,
  set: (value: Sorting[]) => {
    emit('update:modelValue', value)
  }
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

const onRadioChange = () => {
  console.log('onRadioChange')
}

const resetSorting = () => {
  console.log('resetSorting')
}

const submit = () => {
  console.log('submit')
}

</script>

<template>
  <div class="group-wrapper">
    <CustomPopover
      :width="props.settingWidth + 120"
      trigger="click"
      placement="bottom-end"
      popper-style="padding: 4px;"
    >
      <template #reference>
        <CustomButton
          icon-name="arrow-down-short-wide"
          :label="$t('sorting')"
        />
      </template>

      <CustomDraggable
        v-model="tempValue"
        item-key="key"
        class="group-container column-list"
        :handle="`.sorting-move`"
      >
        <template #item="{ element }">
          <div class="column-item">
            <CustomInput
              :model-value="element.order"
              @update:model-value="setSortingValue($event, element.key)"
              :label="element.label"
              type="radio"
              :options="[
                { label: $t('ascending'), value: 'ascending' },
                { label: $t('none'), value: 'none' },
                { label: $t('descending'), value: 'descending' }
              ]"
              @change="onRadioChange"
            />

            <CustomButton
              type="info"
              icon-name="bars"
              text
              class="sorting-move"
            />
          </div>
        </template>

        <template #footer>
          <div class="column-reset">
            <CustomButton
              :label="$t('returnDefault')"
              type="info"
              plain
              icon-name="repeat"
              @click="resetSorting"
            />

            <CustomButton
              :label="$t('confirm')"
              type="success"
              plain
              icon-name="check"
              icon-move="scale"
              @click="submit"
            />
          </div>
        </template>
      </CustomDraggable>
    </CustomPopover>
  </div>
</template>

<style lang="scss" scoped>
.group {
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

.column {
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
  }

  &-reset {
    display: flex;
    justify-content: space-between;
    padding: 8px 8px 4px;
  }
}
</style>
