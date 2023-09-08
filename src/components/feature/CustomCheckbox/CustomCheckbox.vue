<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

import type { CheckboxValueType, CheckboxGroupValueType } from 'element-plus'
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { isEmpty } from '@/lib/lib_utils'

export type ModelValue = CheckboxValueType | CheckboxGroupValueType

export type CheckBoxOption = {
  label: string
  value: string | number
  color?: string
}
export type CheckBoxOptions = CheckBoxOption[]

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array] as PropType<ModelValue>,
    required: true
  },
  label: {
    type: String as PropType<string>,
    default: ''
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  options: {
    type: Array as PropType<CheckBoxOptions>,
    default () {
      return []
    }
  }
})

const tempValue = computed<ModelValue>({
  get: () => props.modelValue,
  set: (value: ModelValue) => emit('update:modelValue', value)
})

const emit = defineEmits([
  'update:modelValue',
  'change'
])

const onGroupCheckboxChange = (val: CheckboxGroupValueType) => {
  emit('change', val)
}

const onCheckboxChange = (val: CheckboxValueType) => {
  emit('change', val)
}

const getStyle = (isChecked: boolean, color?: string) => {
  if (!isChecked) return {}

  if (isEmpty(color)) return { color: '#409EFF' }

  return { color }
}

</script>

<template>
  <div class="checkbox-container">
    <template v-if="options.length > 0 && Array.isArray(tempValue)">
      <ElCheckboxGroup
        v-model="tempValue"
        :validate-event="false"
        :disabled="props.disabled"
        @change="onGroupCheckboxChange"
      >
      <!--  -->
        <ElCheckbox
          v-for="item in options"
          :key="item.value"
          :label="item.value"
        >
          <slot
            name="options"
            :value="item.value"
            :label="item.label"
            :color="item?.color ?? '#ffffff'"
            :is-checked="tempValue.includes(item.value)"
          >
            <span
              :style="getStyle(tempValue.includes(item.value), item?.color)"
            >{{ item.label }}</span>
          </slot>
        </ElCheckbox>
      </ElCheckboxGroup>
    </template>
    <template v-else-if="!Array.isArray(tempValue)">
      <ElCheckbox
        v-model="tempValue"
        size="large"
        :disabled="props.disabled"
        :validate-event="false"
        @change="onCheckboxChange"
      >
        <slot name="default">
          {{ props.label }}
        </slot>
      </ElCheckbox>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.checkbox {
  &-container {
    width: fit-content;
    height: fit-content;
  }
}
</style>