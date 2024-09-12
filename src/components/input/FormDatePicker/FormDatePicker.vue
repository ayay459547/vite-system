<script setup lang="ts">
import { computed, useSlots, ref, inject } from 'vue'
import { ElDatePicker } from 'element-plus'

import type { UseHook } from '@/declare/hook'
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits, Expose } from './FormDatePickerInfo'
import { version, props as formDatePickerProps } from './FormDatePickerInfo'

const scopedId = getUuid(version)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formDatePickerProps)

const getTranslateShortcuts = (shortcuts: Props.Shortcuts) => {
  if (!shortcuts) return []
  return shortcuts.map(shortcut => {
    return {
      text: shortcut.text,
      value: shortcut.value
    }
  })
}

const bindAttributes = computed(() => {
  const attributes: any = {
    type: props.type,
    clearable: props.clearable,
    disabled: props.disabled,
    format: props.format,
    valueFormat: props.valueFormat,
    shortcuts: getTranslateShortcuts(props.shortcuts)
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
  set: (value: Props.ModelValue) => {
    emit('update:modelValue', value)
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

// event
const onEvent: {
  focus: Emits.Focus
  blur: Emits.Blur
  change: Emits.Change
} = {
  focus: $event => emit('focus', $event),
  blur: $event => emit('blur', $event),
  change: value => emit('change', value)
}

const elDatePickerRef = ref()

const focus: Expose.Focus = () => {
  if (elDatePickerRef.value) {
    elDatePickerRef.value.focus()
    elDatePickerRef.value.handleOpen()
  }
}
const blur: Expose.Blur = () => {
  if (elDatePickerRef.value) {
    elDatePickerRef.value.handleClose()
  }
}
defineExpose({ focus, blur })

</script>

<template>
  <div class="__i-date-picker__" :class="scopedId">
    <ElDatePicker
      ref="elDatePickerRef"
      v-model="inputValue"
      class="__i-date-picker__"
      :placeholder="i18nTranslate('pleaseSelect', defaultModuleType)"
      :start-placeholder="i18nTranslate('startTime-time')"
      :end-placeholder="i18nTranslate('endTime-time')"
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
@use '../Form.scss' as *;

:deep(.__i-date-picker__) {
  &.el-date-editor {
    width: 100% !important;
    max-height: 32px !important;
    border-radius: 4px;
  }
  &.validate-error.el-date-editor {
    @include validate-error(date-picker);
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
    @include validate-error(date-picker);
  }
}

.__i-date-picker__ {
  width: 100%;
  height: 100%;
}
</style>
