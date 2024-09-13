<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch, effectScope, inject } from 'vue'
import { ElTimePicker } from 'element-plus'

import type { UseHook } from '@/declare/hook'
import { isEmpty, getUuid } from '@/lib/lib_utils'
import { formatDatetime } from '@/lib/lib_format'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits, Expose } from './FormTimePickerInfo'
import { version, props as formTimePickerProps } from './FormTimePickerInfo'

const scopedId = getUuid(version)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formTimePickerProps)

const bindAttributes = computed(() => {
  const attributes: any = {
    isRange: props.isRange || props.type === 'timerange',
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

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change'])

const validateRes = computed<string>(() => {
  if (isEmpty(props.errorMessage)) return 'success'
  return 'error'
})

const inputValue = computed({
  get: () => {
    return props.modelValue
  },
  set: (value: Props.ModelValue) => {
    emit('update:modelValue', value)
  }
})

// 由於格式問題及效能問題 另外拉一個
// 等到 change 時在更新資料
const _inputValue = ref()

// event
const onEvent: {
  focus: Emits.Focus
  blur: Emits.Blur
  change: Emits.Change
} = {
  focus: $event => emit('focus', $event),
  blur: $event => emit('blur', $event),
  change: value => {
    let _value = value
    if (Array.isArray(value)) {
      _value = [
        formatDatetime(`${value[0]}`, props.format),
        formatDatetime(`${value[1]}`, props.format)
      ]
    } else if (!isEmpty(value)) {
      _value = formatDatetime(`${value}`, props.format)
    }

    inputValue.value = _value
    emit('change', _value)
  }
}

const scope = effectScope()

// 當值發生改變時 更新資料
// HH:mm:ss => Day Month Date Year HH:mm:ss GMT+0800 (台北標準時間)
const updateValue = (value: Props.ModelValue) => {
  if (props.isRange || props.type === 'timerange') {
    const today = new Date()
    let _start = formatDatetime(today, 'YYYY-MM-DD 00:00:00')
    let _end = formatDatetime(today, 'YYYY-MM-DD 23:59:59')

    if (Array.isArray(value)) {
      const [value1 = '00:00:00', value2 = '23:59:59'] = value

      if (!isEmpty(value1) && !isEmpty(value2)) {
        _start = formatDatetime(today, `YYYY-MM-DD ${value1}`)
        _end = formatDatetime(today, `YYYY-MM-DD ${value2}`)
      }
      const defaultRange = [_start, _end]
      _inputValue.value = defaultRange
    } else if (!isEmpty(value)) {
      _inputValue.value = formatDatetime(today, `${value}`)
    }
  }
}

onMounted(() => {
  updateValue(inputValue.value)

  // 有掛載才開啟監聽
  scope.run(() => {
    watch(inputValue, (newValue: Props.ModelValue) => {
      updateValue(newValue)
    })
  })
})

onBeforeUnmount(() => {
  scope.stop()
})

const elTimePickerRef = ref()

const focus: Expose.Focus = () => {
  if (elTimePickerRef.value) {
    elTimePickerRef.value.focus()
    elTimePickerRef.value.handleOpen()
  }
}
const blur: Expose.Blur = () => {
  if (elTimePickerRef.value) {
    elTimePickerRef.value.blur()
    elTimePickerRef.value.handleClose()
  }
}
defineExpose({ focus, blur })

</script>

<template>
  <div class="__i-time-picker__" :class="scopedId">
    <ElTimePicker
      ref="elTimePickerRef"
      v-model="_inputValue"
      class="__i-time-picker__"
      :placeholder="i18nTranslate('pleaseSelect', defaultModuleType)"
      :start-placeholder="i18nTranslate('startTime-time')"
      :end-placeholder="i18nTranslate('endTime-time')"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
    ></ElTimePicker>
  </div>
</template>

<style lang="scss" scoped>
@use '../Form.scss' as *;

:deep(.__i-time-picker__) {
  &.el-date-editor {
    width: 100% !important;
    max-height: 32px !important;
    border-radius: 4px;
  }
  &.validate-error.el-date-editor {
    @include validate-error(time-picker);
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
    @include validate-error(time-picker);
  }
}

.__i-time-picker__ {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
.el-picker__popper {
  z-index: var(--i-z-index-select-option) !important;
}
</style>
