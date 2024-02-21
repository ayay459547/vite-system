<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, useSlots, onMounted, onBeforeUnmount, ref, inject } from 'vue'
import { ElDatePicker } from 'element-plus'

import type { UseHook } from '@/declare/hook'
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils'

export type DatePickerType = 'year' | 'month' | 'date' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange'
export type Shortcuts = {
  text: string
  value: () => [number, number]
}

type BaseValue = string | null
type ModelValue = BaseValue | [BaseValue, BaseValue]

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})

const props = defineProps({
  modelValue: {
    type: [Array, String, null] as PropType<ModelValue>,
    required: true
  },
  errorMessage: {
    type: String as PropType<string>,
    default: ''
  },
  // element ui plus
  type: {
    type: String as PropType<DatePickerType>,
    default: 'date'
  },
  clearable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  format: {
    type: String as PropType<string>,
    default: 'YYYY-MM-DD'
  },
  valueFormat: {
    type: String as PropType<string>,
    default: 'YYYY-MM-DD'
  },
  shortcuts: {
    type: Array as PropType<Shortcuts[]>,
    required: false
  },
  placeholder: {
    type: String as PropType<string>,
    required: false
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onFocus: Function as PropType<(e: FocusEvent) => void>,
  onBlur: Function as PropType<(e: FocusEvent) => void>,
  onChange: Function as PropType<(e: ModelValue) => void>
})

const bindAttributes = computed(() => {
  const attributes: any = {
    type: props.type,
    clearable: props.clearable,
    disabled: props.disabled,
    format: props.format,
    valueFormat: props.valueFormat,
    shortcuts: props.shortcuts
  }
  if (!isEmpty(props.placeholder)) {
    attributes.placeholder = props.placeholder
  }

  return attributes
})

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'change'
])

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

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

// event
const onEvent = {
  focus: (e: FocusEvent): void => emit('focus', e),
  blur: (e: FocusEvent): void => emit('blur', e),
  change: (value: ModelValue): void => emit('change', value)
}

onMounted(() => {
  window.addEventListener('touchstart', e => e.preventDefault())
})

onBeforeUnmount(() => {
  window.removeEventListener('touchstart', e => e.preventDefault())
})

const scopedId = getUuid('__i-date-picker__')

const elDatePickerRef = ref()
defineExpose({
  focus: (): void => {
    if (elDatePickerRef.value) {
      elDatePickerRef.value.focus()
      elDatePickerRef.value.handleOpen()
    }
  },
  blur: (): void => {
    if (elDatePickerRef.value) {
      elDatePickerRef.value.handleClose()
    }
  }
})
</script>

<template>
  <div class="__i-date-picker__" :class="scopedId">
    <ElDatePicker
      ref="elDatePickerRef"
      v-model="inputValue"
      class="__i-date-picker__"
      :placeholder="i18nTranslate('pleaseSelect')"
      :start-placeholder="i18nTranslate('startTime')"
      :end-placeholder="i18nTranslate('endTime')"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
    >
      <template v-if="hasSlot('default')" #default>
        <slot name="default"></slot>
      </template>
      <template v-if="hasSlot('range-separator')" #range-separator>
        <slot name="range-separator"></slot>
      </template>
    </ElDatePicker>
  </div>
</template>

<style lang="scss" scoped>
:deep(.__i-date-picker__) {
  &.el-date-editor {
    width: 100% !important;
    max-height: 32px !important;
    border-radius: 4px;
  }
  &.validate-error.el-date-editor {
    box-shadow: 0 0 0 1px $danger inset;
    background-color: lighten($danger, 20%);
  }

  .el-input__wrapper {
    transition-duration: 0.3s;
    box-shadow: 0 0 0 1px inherit inset;

    position: relative;
  }
  .el-input__suffix {
    position: absolute;
    right: 8px;
    top: 0px;
  }
  &.validate-error .el-input__wrapper {
    box-shadow: 0 0 0 1px $danger inset;
    background-color: lighten($danger, 20%);
  }
}

.__i-date-picker__ {
  width: 100%;
  height: 100%;
}
</style>
