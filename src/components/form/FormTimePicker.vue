<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, onMounted, onBeforeUnmount, ref, watch, effectScope, inject } from 'vue'
import { ElTimePicker } from 'element-plus'
import type { Dayjs } from 'dayjs'

import type { UseHook } from '@/declare/hook'
import { isEmpty, getUuid } from '@/lib/lib_utils'
import { datetimeFormat } from '@/lib/lib_day'

export type TimePickerType = 'time' | 'timerange'
export declare type GetDisabledHours = (role: string, comparingDate?: Dayjs) => number[]
export declare type GetDisabledMinutes = (hour: number, role: string, comparingDate?: Dayjs) => number[]
export declare type GetDisabledSeconds = (hour: number, minute: number, role: string, comparingDate?: Dayjs) => number[]

type BaseValue = string | Date | null
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
  type: {
    type: String as PropType<TimePickerType>,
    default: 'time'
  },
  // element ui plus
  isRange: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
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
    default: 'HH:mm:ss'
  },
  rangeSeparator: {
    type: String as PropType<string>,
    default: '-'
  },
  disabledHours: {
    type: Function as PropType<GetDisabledHours>,
    default: () => []
  },
  disabledMinutes: {
    type: Function as PropType<GetDisabledMinutes>,
    default: () => []
  },
  disabledSeconds: {
    type: Function as PropType<GetDisabledSeconds>,
    default: () => []
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
    isRange: props.isRange || (props.type === 'timerange'),
    clearable: props.clearable,
    disabled: props.disabled,
    format: props.format,
    rangeSeparator: props.rangeSeparator,
    disabledHours: props.disabledHours,
    disabledMinutes: props.disabledMinutes,
    disabledSeconds: props.disabledSeconds
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
  get: () => {
    return props.modelValue
  },
  set: (value: ModelValue) => {
    emit('update:modelValue', value)
  }
})

// 由於格式問題及效能問題 另外拉一個
// 等到 change 時在更新資料
const _inputValue = ref()

// event
const onEvent = {
  focus: (e: FocusEvent): void => emit('focus', e),
  blur: (e: FocusEvent): void => emit('blur', e),
  change: (value: ModelValue): void => {
    let _value = value
    if (Array.isArray(value)) {
      _value = [
        datetimeFormat(`${value[0]}`, props.format),
        datetimeFormat(`${value[1]}`, props.format)
      ]
    } else if (!isEmpty(value)) {
      _value = datetimeFormat(`${value}`, props.format)
    }

    inputValue.value = _value
    emit('change', _value)
  }
}

const scope = effectScope()

// 當值發生改變時 更新資料
// HH:mm:ss => Day Month Date Year HH:mm:ss GMT+0800 (台北標準時間)
const updateValue = (value: ModelValue) => {
  if (props.isRange || (props.type === 'timerange')) {
    const today = new Date()
    let _start = datetimeFormat(today, 'YYYY-MM-DD 00:00:00')
    let _end = datetimeFormat(today, 'YYYY-MM-DD 23:59:59')

    if (Array.isArray(value)) {
      const [
        value1 = '00:00:00',
        value2 = '23:59:59'
      ] = value

      if (!isEmpty(value1) && !isEmpty(value2)) {
        _start = datetimeFormat(today, `YYYY-MM-DD ${value1}`)
        _end = datetimeFormat(today, `YYYY-MM-DD ${value2}`)
      }
      const defaultRange = [ _start, _end ]
      _inputValue.value = defaultRange

    } else if (!isEmpty(value)) {
      _inputValue.value = datetimeFormat(today, `${value}`)
    }
  }
}

onMounted(() => {
  updateValue(inputValue.value)

  // 有掛載才開啟監聽
  scope.run(() => {
    watch(inputValue, (newValue) => {
      updateValue(newValue)
    })
  })
})

onBeforeUnmount(() => {
  scope.stop()
})

const scopedId = getUuid('__i-time-picker__')

const elTimePickerRef = ref()

defineExpose({
  focus: (): void => {
    if (elTimePickerRef.value) {
      elTimePickerRef.value.focus()
      elTimePickerRef.value.handleOpen()
    }
  },
  blur: (): void => {
    if (elTimePickerRef.value) {
      elTimePickerRef.value.blur()
      elTimePickerRef.value.handleClose()
    }
  }
})
</script>

<template>
  <div class="__i-time-picker__" :class="scopedId">
    <ElTimePicker
      ref="elTimePickerRef"
      v-model="_inputValue"
      class="__i-time-picker__"
      :placeholder="i18nTranslate('pleaseSelect')"
      :start-placeholder="i18nTranslate('startTime')"
      :end-placeholder="i18nTranslate('endTime')"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
    ></ElTimePicker>
  </div>
</template>

<style lang="scss" scoped>
:deep(.__i-time-picker__) {
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

.__i-time-picker__ {
  width: 100%;
  height: 100%;
}
</style>
