<script setup lang="ts">
import { computed, useSlots, ref, inject } from 'vue'
import { ElAutocomplete } from 'element-plus'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/declare/declare_i18n'

import type { Props, Emits, Expose } from './FormAutocompleteInfo'
import { version, props as formAutocompleteProps } from './FormAutocompleteInfo'

const scopedId = getUuid(version)

const props = defineProps(formAutocompleteProps)

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const emit = defineEmits([
  'update:model-value',
  'blur',
  'focus',
  'input',
  'clear',
  'select',
  'change'
])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props['modelValue']) => emit('update:model-value', value)
})

// event
const onBlur: Emits['blur'] = event => emit('blur', event)
const onFocus: Emits['focus'] = event => emit('focus', event)
const onInput: Emits['input'] = value => emit('input', value)
const onClear: Emits['clear'] = () => emit('clear')
const onSelect: Emits['select'] = event => emit('select', event)
const onChange: Emits['change'] = value => emit('change', value)

// expose
const ElAutocompleteRef = ref<InstanceType<typeof ElAutocomplete>>()
const blur: Expose['blur'] = () => {
  ElAutocompleteRef.value?.blur()
}
const close: Expose['close'] = () => {
  ElAutocompleteRef.value?.close()
}
const focus: Expose['focus'] = () => {
  ElAutocompleteRef.value?.focus()
}
const handleSelect: Expose['handleSelect'] = (item: any) => {
  return ElAutocompleteRef.value?.handleSelect(item)
}
const handleKeyEnter: Expose['handleKeyEnter'] = () => {
  return ElAutocompleteRef.value?.handleKeyEnter()
}
const highlight: Expose['highlight'] = (itemIndex: number) => {
  return ElAutocompleteRef.value?.highlight(itemIndex)
}
const getData : Expose['getData'] = (queryString: string) => {
  return ElAutocompleteRef.value?.getData(queryString)
}
defineExpose({ blur, close, focus, handleSelect, handleKeyEnter, highlight, getData })

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElAutocomplete
    ref="ElAutocompleteRef"
    :class="scopedId"
    v-model="inputValue"
    :placeholder="props.placeholder ?? i18nTranslate('pleaseInput')"
    :clearable="props.clearable"
    :disabled="props.disabled"
    :value-key="props.valueKey"
    :debounce="props.debounce"
    :fetch-suggestions="props.fetchSuggestions"
    :trigger-on-focus="props.triggerOnFocus"
    :select-when-unmatched="props.selectWhenUnmatched"
    :name="props.name"
    :aria-label="props.ariaLabel"
    :hide-loading="props.hideLoading"
    :popper-class="props.popperClass"
    :teleported="props.teleported"
    :highlight-first-item="props.highlightFirstItem"
    :fit-input-width="props.fitInputWidth"
    @blur="onBlur"
    @focus="onFocus"
    @input="onInput"
    @clear="onClear"
    @select="onSelect"
    @change="onChange"
  >
    <template v-if="hasSlot('default')" #default="scope">
      <slot name="default" v-bind="scope"></slot>
    </template>
    <!-- 圖示用 -->
    <template v-if="hasSlot('prefix')" #prefix>
      <slot name="prefix"></slot>
    </template>
    <template v-if="hasSlot('suffix')" #suffix>
      <slot name="suffix"></slot>
    </template>
    <!-- 輸入框用 -->
    <template v-if="hasSlot('prepend')" #prepend>
      <slot name="prepend"></slot>
    </template>
    <template v-if="hasSlot('append')" #append>
      <slot name="append"></slot>
    </template>
    <template v-if="hasSlot('loading')" #loading>
      <slot name="loading"></slot>
    </template>
  </ElAutocomplete>
</template>

<style lang="scss">
div[class*="FormAutocomplete"] {
  width: 100%;
  height: fit-content;

  .el-input__suffix {
    position: absolute;
    right: 8px;
    top: 0px;
  }
  .el-input-group__prepend,
  .el-input-group__append {
    padding: 0 12px;
  }
}
</style>
