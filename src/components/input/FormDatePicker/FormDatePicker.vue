<script setup lang="ts">
import { computed, useSlots, ref, inject } from 'vue'
import { ElDatePicker } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits, Expose } from './FormDatePickerInfo'
import { version, props as formDatePickerProps } from './FormDatePickerInfo'

const scopedId = getUuid(version)

const useHook: UseHook = inject('useHook')
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formDatePickerProps)

const emit = defineEmits([
  'update:model-value',
  'input',
  'change',
  'blur',
  'focus',
  'clear',
  'calendar-change',
  'panel-change',
  'visible-change'
])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => emit('update:model-value', value)
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

// event
const onChange: Emits.Change = val => emit('change', val)
const onBlur: Emits.Blur = e => emit('blur', e)
const onFocus: Emits.Focus = e => emit('focus', e)
const onClear: Emits.Clear = () => emit('clear')
const onCalendarChange: Emits.CalendarChange = val => emit('calendar-change', val)
const onPanelChange: Emits.PanelChange = date => emit('panel-change', date)
const onVisibleChange: Emits.VisibleChange = visibility => emit('visible-change', visibility)

// expose
const elDatePickerRef = ref()
const focus: Expose.Focus = () => {
  elDatePickerRef.value?.focus()
  elDatePickerRef.value?.handleOpen()
}
const blur: Expose.Blur = () => {
  elDatePickerRef.value?.blur()
  elDatePickerRef.value?.handleClose()
}
const handleOpen: Expose.HandleOpen = () => {
  elDatePickerRef.value?.handleOpen()
}
const handleClose: Expose.HandleClose = () => {
  elDatePickerRef.value?.handleClose()
}
defineExpose({ focus, blur, handleOpen, handleClose })

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElDatePicker
    ref="elDatePickerRef"
    :class="scopedId"
    v-model="inputValue"
    :readonly="props.readonly"
    :disabled="props.disabled"
    :size="props.size"
    :editable="props.editable"
    :clearable="props.clearable"
    :placeholder="props.placeholder ?? i18nTranslate('pleaseSelect', defaultModuleType)"
    :start-placeholder="props.startPlaceholder ?? i18nTranslate('datetime-startTime', defaultModuleType)"
    :end-placeholder="props.endPlaceholder ?? i18nTranslate('datetime-endTime', defaultModuleType)"
    :type="props.type"
    :format="props.format"
    :popper-class="props.popperClass"
    :popper-options="props.popperOptions"
    :range-separator="props.rangeSeparator"
    :default-value="props.defaultValue"
    :default-time="props.defaultTime"
    :value-format="props.valueFormat"
    :id="props.id"
    :name="props.name"
    :unlink-panels="props.unlinkPanels"
    :prefix-icon="props.prefixIcon"
    :clear-icon="props.clearIcon"
    :validate-event="props.validateEvent"
    :disabled-date="props.disabledDate"
    :shortcuts="getTranslateShortcuts(props.shortcuts)"
    :cell-class-name="props.cellClassName"
    :teleported="props.teleported"
    :empty-values="props.emptyValues"
    :value-on-clear="props.valueOnClear"
    :fallback-placements="props.fallbackPlacements"
    :placement="props.placement"
    @change="onChange"
    @blur="onBlur"
    @focus="onFocus"
    @clear="onClear"
    @calendar-change="onCalendarChange"
    @panel-change="onPanelChange"
    @visible-change="onVisibleChange"
  >
    <template v-if="hasSlot('default')" #default="scope">
      <slot name="default" v-bind="scope"></slot>
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
  </ElDatePicker>
</template>

<style lang="scss">
div[class*="FormDatePicker"] {
  width: 100% !important;
  height: fit-content;
  border-radius: 4px;
}
</style>
