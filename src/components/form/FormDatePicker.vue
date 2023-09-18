<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, useSlots, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElDatePicker } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { isEmpty, hasOwnProperty } from '@/lib/lib_utils'
const { t } = useI18n()

type BaseValue = string | null
type ModelValue = BaseValue | [BaseValue, BaseValue]

export type PickerType = 'year' | 'month' | 'date' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange'

export type Shortcuts = {
  text: string
  value: () => [number, number]
}

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
    type: String as PropType<PickerType>,
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
  }
})

const bindAttributes = computed(() => {
  return {
    type: props.type,
    clearable: props.clearable,
    disabled: props.disabled,
    format: props.format,
    valueFormat: props.valueFormat,
    shortcuts: props.shortcuts
  }
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
  return hasOwnProperty.call(slots, prop)
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


</script>

<template>
  <div class="i-date-picker">
    <ElDatePicker
      v-model="inputValue"
      class="i-date-picker"
      :placeholder="$t('pleaseSelect')"
      :start-placeholder="t('startTime')"
      :end-placeholder="t('endTime')"
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
:deep(.i-date-picker) {
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

.i-date-picker {
  width: 100%;
  height: 100%;
}
</style>
