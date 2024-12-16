<script setup lang="ts">
import { computed } from 'vue'
import type { CheckboxValueType, CheckboxGroupValueType } from 'element-plus'
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'

import { isEmpty, getUuid } from '@/lib/lib_utils' // 工具

import type { Props, Emits } from './FormCheckboxInfo'
import { version, props as formCheckboxProps } from './FormCheckboxInfo'

const scopedId = getUuid(version)

const props = defineProps(formCheckboxProps)

const emit = defineEmits([
  'update:model-value',
  'input',
  'change'
])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => emit('update:model-value', value)
})

// event
const onGroupChange: Emits.Change<CheckboxGroupValueType> = value => emit('change', value)
const onChange: Emits.Change<CheckboxValueType> = value => emit('change', value)

const getStyle = (isChecked: boolean, color?: string) => {
  if (!isChecked || isEmpty(color)) return {}
  return { color }
}
</script>

<template>
  <div :class="scopedId">
    <template v-if="Array.isArray(inputValue)">
      <ElCheckboxGroup
        v-model="inputValue"
        :validate-event="false"
        :disabled="props.disabled"
        :indeterminate="props.indeterminate"
        @change="onGroupChange"
      >
        <ElCheckbox
          v-for="item in options"
          :key="`${item.value}-${scopedId}`"
          :label="item.label"
          :value="item.value"
          :validate-event="false"
          :disabled="item.disabled ?? false"
        >
          <span :style="getStyle(inputValue.includes(item.value), item?.color)">
            <slot
              name="options"
              v-bind="item"
              :is-checked="inputValue.includes(item.value)"
              :label="item.label"
              :value="item.value"
              :data="item.data"
            >
              {{ item.label }}
            </slot>
          </span>
        </ElCheckbox>
      </ElCheckboxGroup>
    </template>
    <template v-else>
      <ElCheckbox
        v-model="inputValue"
        :validate-event="false"
        :disabled="props.disabled"
        :indeterminate="props.indeterminate"
        @change="onChange"
      >
        <slot name="default">
          {{ props.label }}
        </slot>
      </ElCheckbox>
    </template>
  </div>
</template>

<style lang="scss" scoped>
div[class*="FormCheckbox"] {
  width: 100%;
  height: fit-content;

  :deep(.el-checkbox) {
    margin-right: 16px;

    &:last-of-type {
      margin-right: 0px;
    }

    .el-checkbox__label {
      padding-left: 8px;
    }
  }
}
</style>
