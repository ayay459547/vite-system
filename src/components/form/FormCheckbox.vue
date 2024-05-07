<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { CheckboxValueType, CheckboxGroupValueType } from 'element-plus'
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'

import { isEmpty, getUuid } from '@/lib/lib_utils'

export type ModelValue = CheckboxValueType | CheckboxGroupValueType | any

export type Option = {
  label: string
  value: string | number | boolean | null
  disabled?: boolean
  color?: string
}
export type Options = Array<Option>

const props = defineProps({
  modelValue: {
    type: [Array, String, Number, Boolean] as PropType<ModelValue>,
    required: true
  },
  errorMessage: {
    type: String as PropType<string>,
    default: ''
  },
  options: {
    type: Array as PropType<Options>,
    default() {
      return []
    }
  },
  label: {
    type: String as PropType<string>,
    default: ''
  },
  // element ui plus
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  indeterminate: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onChange: Function as PropType<(e: CheckboxGroupValueType | CheckboxValueType) => void>
})

const bindAttributes = computed(() => {
  return {
    disabled: props.disabled,
    indeterminate: props.indeterminate
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const onEvent = {
  groupChange: (value: CheckboxGroupValueType): void => emit('change', value),
  change: (value: CheckboxValueType): void => emit('change', value)
}

const validateRes = computed<string>(() => {
  if (isEmpty(props.errorMessage)) return 'success'
  return 'error'
})

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => {
    emit('update:modelValue', value)
  }
})

const getStyle = (isChecked: boolean, color?: string) => {
  if (!isChecked) return {}

  if (isEmpty(color)) return { color: '#409EFF' }

  return { color }
}

const scopedId = getUuid('__i-checkbox__')
</script>

<template>
  <div class="__i-checkbox__" :class="scopedId">
    <template v-if="Array.isArray(inputValue)">
      <ElCheckboxGroup
        v-model="inputValue"
        class="__i-checkbox__"
        :class="[`validate-${validateRes}`]"
        :validate-event="false"
        v-bind="bindAttributes"
        @change="onEvent.groupChange"
      >
        <ElCheckbox
          v-for="item in options"
          :key="`${item.value}`"
          :label="item.value"
          :value="item.value"
          :validate-event="false"
          :disabled="item.disabled ?? false"
        >
          <span :style="getStyle(inputValue.includes(item.value), item?.color)">
            <slot
              name="option"
              :is-checked="inputValue.includes(item.value)"
              :label="item.label"
              :value="item.value"
              :color="item?.color ?? '#ffffff'"
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
        class="__i-checkbox__"
        :class="[`validate-${validateRes}`]"
        size="large"
        :validate-event="false"
        v-bind="bindAttributes"
        @change="onEvent.change"
      >
        <slot name="default">
          {{ props.label }}
        </slot>
      </ElCheckbox>
    </template>
  </div>
</template>

<style lang="scss" scoped>
:deep(.__i-checkbox__) {
  &.validate-error .el-checkbox__inner {
    border: 1px solid $danger;
    background-color: lighten($danger, 20%);
  }
}
.__i-checkbox__ {
  width: 100%;
  height: fit-content;
}
</style>
