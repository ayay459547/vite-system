<script setup lang="ts">
import { computed } from 'vue'
import { ElRadioGroup, ElRadio, ElRadioButton } from 'element-plus'

import { isEmpty, getUuid } from '@/lib/lib_utils' // 工具

import type { Props, Emits } from './FormRadioInfo'
import { version, props as formRadioProps } from './FormRadioInfo'

const scopedId = getUuid(version)

const props = defineProps(formRadioProps)

const emit = defineEmits([
  'update:model-value',
  'input',
  'change'
])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props['modelValue']) => emit('update:model-value', value)
})

// event
const onChange: Emits['change'] = value => emit('change', value)

const getStyle = (isSelected: boolean, color?: string) => {
  if (!isSelected || isEmpty(color)) return {}
  return { color }
}
</script>

<template>
  <ElRadioGroup
    :class="scopedId"
    v-model="inputValue"
    :size="props.size"
    :disabled="props.disabled"
    :text-color="props.textColor"
    :fill="props.fill"
    :validate-event="props.validateEvent"
    :aria-label="props.ariaLabel"
    :id="props.id"
    :name="props.name"
    @change="onChange"
  >
    <component
      v-for="item in props.options"
      :key="`radio-${item.value}-${scopedId}`"
      :is="props.radioType !== 'button' ? ElRadio : ElRadioButton"
      v-bind="item"
    >
      <div :style="getStyle(inputValue === item.value, item?.color)">
        <slot
          name="options"
          v-bind="item"
          :is-selected="inputValue === item.value"
        >
          {{ item.label }}
        </slot>
      </div>
    </component>
  </ElRadioGroup>
</template>

<style lang="scss" scoped>
div[class*="FormRadio"] {
  width: 100%;
  height: fit-content;

  :deep(.el-radio) {
    margin-right: 16px;

    input[type="radio"] i {
      margin: 3px 3px 0px 5px;
    }
  }
}
</style>
<style lang="scss">
html.dark {
  :where(.el-radio__inner) {
    border: var(--el-border-width) var(--el-border-style) var(--el-color-info-dark-2);
  }
}
</style>
