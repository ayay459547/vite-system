<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch, effectScope, inject, useSlots } from 'vue'
import { ElTimePicker } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { formatDatetime } from '@/lib/lib_format' // 格式化
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits, Expose } from './FormTimePickerInfo'
import { version, props as formTimePickerProps } from './FormTimePickerInfo'

const scopedId = getUuid(version)

const useHook: UseHook = inject('useHook')
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formTimePickerProps)

const emit = defineEmits([
  'update:modelValue',
  'change',
  'blur',
  'focus',
  'clear',
  'calendar-change',
  'visible-change'
])

const validateRes = computed<string>(() => {
  if (isEmpty(props.errorMessage)) return 'success'
  return 'error'
})

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => {
    emit('update:modelValue', value)
  }
})

const getTranslateShortcuts = (shortcuts: Props.Shortcuts) => {
  if (!Array.isArray(shortcuts)) return []
  return shortcuts.map(shortcut => {
    const { i18nLabel, label, text, value } = shortcut

    return {
      text: i18nTest(i18nLabel) ? i18nTranslate(i18nLabel) : (label ?? text),
      value
    }
  })
}

// 由於格式問題及效能問題 另外拉一個
// 等到 change 時在更新資料
const _inputValue = ref()

const scope = effectScope()

// 當值發生改變時 更新資料
// HH:mm:ss => Day Month Date Year HH:mm:ss GMT+0800 (台北標準時間)
const updateValue = (value: Props.ModelValue) => {
  if (props.type === 'timerange') {
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

// event
const onChange: Emits.Change = value => {
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
const onBlur: Emits.Blur = e => emit('blur', e)
const onFocus: Emits.Focus = e => emit('focus', e)
const onClear: Emits.Clear = () => emit('clear')
const onCalendarChange: Emits.CalendarChange = val => emit('calendar-change', val)
const onVisibleChange: Emits.VisibleChange = visibility => emit('visible-change', visibility)

// expose
const elTimePickerRef = ref()
const focus: Expose.Focus = () => {
  elTimePickerRef.value?.focus()
}
const blur: Expose.Blur = () => {
  elTimePickerRef.value?.blur()
}
defineExpose({ focus, blur })

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <div :class="[scopedId, `validate-${validateRes}`]">
    <ElTimePicker
      ref="elTimePickerRef"
      v-model="_inputValue"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :editable="props.editable"
      :clearable="props.clearable"
      :size="props.size"
      :placeholder="props.placeholder ?? i18nTranslate('pleaseSelect', defaultModuleType)"
      :start-placeholder="props.startPlaceholder ?? i18nTranslate('datetime-startTime', defaultModuleType)"
      :end-placeholder="props.endPlaceholder ?? i18nTranslate('datetime-endTime', defaultModuleType)"
      :arrow-control="props.arrowControl"
      :type="props.type"
      :format="props.format"
      :popper-class="props.popperClass"
      :range-separator="props.rangeSeparator"
      :default-value="props.defaultValue"
      :default-time="props.defaultTime"
      :value-format="props.valueFormat"
      :date-format="props.dateFormat"
      :time-format="props.timeFormat"
      :id="props.id"
      :name="props.name"
      :unlink-panels="props.unlinkPanels"
      :prefix-icon="props.prefixIcon"
      :clear-icon="props.clearIcon"
      :shortcuts="getTranslateShortcuts(props.shortcuts)"
      :disabled-date="props.disabledDate"
      :cell-class-name="props.cellClassName"
      :teleported="props.teleported"
      :empty-values="props.emptyValues"
      :value-on-clear="props.valueOnClear"
      :show-now="props.showNow"
      @change="onChange"
      @blur="onBlur"
      @focus="onFocus"
      @clear="onClear"
      @calendar-change="onCalendarChange"
      @visible-change="onVisibleChange"
    >
      <template v-if="hasSlot('default')" #default>
        <slot name="default"></slot>
      </template>
      <template v-if="hasSlot('range-separator')" #range-separator>
        <slot name="range-separator"></slot>
      </template>
      <template v-if="hasSlot('prev-month')" #prev-month>
        <slot name="prev-month"></slot>
      </template>
      <template v-if="hasSlot('next-month')" #next-month>
        <slot name="next-month"></slot>
      </template>
      <template v-if="hasSlot('prev-year')" #prev-year>
        <slot name="prev-year"></slot>
      </template>
      <template v-if="hasSlot('next-year')" #next-year>
        <slot name="next-year"></slot>
      </template>
    </ElTimePicker>
  </div>
</template>

<style lang="scss" scoped>
@use '../Form.scss' as *;

div[class*="__FormTimePicker"] {
  :deep(.el-date-editor) {
    width: 100% !important;
    max-height: 32px !important;
    border-radius: 4px;
  }
  &.validate-error :deep(.el-date-editor) {
    @include validate-error(time-picker);
  }

  :deep(.el-input__wrapper) {
    @include validate-success(time-picker);
  }
  &.validate-error :deep(.el-input__wrapper) {
    @include validate-error(time-picker);
  }
}

:global(.el-picker__popper) {
  z-index: var(--i-z-index-select-option) !important;
}
</style>
