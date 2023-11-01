<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PropType } from 'vue'
import type { Sorting, Order } from '../CustomTable.vue'

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
  },
  settingHeight: {
    type: String as PropType<string>,
    required: false,
    default: '100%',
    description: '列表高度'
  }
})

const emit = defineEmits(['update:modelValue', 'reset-sorting', 'submit'])

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
  <div class="group-wrapper">
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
          :label="$t('sorting')"
        />
      </template>

      <CustomDraggable
        v-model="tempValue"
        item-key="key"
        class="group-container column-list"
        :handle="`.sorting-move`"
        :style="{
          maxHeight: props.settingHeight,
          overflow: 'auto'
        }"
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
