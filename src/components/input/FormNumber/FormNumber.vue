<script setup lang="ts">
import { useSlots, ref, computed, inject } from 'vue'
import { ElInputNumber } from 'element-plus'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/declare/declare_i18n'

import type { Props, Emits, Expose } from './FormNumberInfo'
import { version, props as formInputProps } from './FormNumberInfo'

const scopedId = getUuid(version)

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formInputProps)

const emit = defineEmits([
  'update:model-value',
  'focus',
  'blur',
  'clear',
  'change',
  'input'
])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props['modelValue']) => emit('update:model-value', value)
})

// event
const onBlur: Emits['blur'] = event => emit('focus', event)
const onFocus: Emits['focus'] = event => emit('focus', event)
const onChange: Emits['change'] = value => emit('change', value)

// expose
const ElNumberRef = ref<InstanceType<typeof ElInputNumber>>()
const blur: Expose['blur'] = () => ElNumberRef.value?.blur()
const focus: Expose['focus'] = () => ElNumberRef.value?.focus()
defineExpose({ blur, focus })

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElInputNumber
    ref="ElNumberRef"
    :class="scopedId"
    v-model="inputValue"
    :min="props.min"
    :max="props.max"
    :step="props.step"
    :step-strictly="props.stepStrictly"
    :precision="props.precision"
    :size="props.size"
    :readonly="props.readonly"
    :disabled="props.disabled"
    :controls="props.controls"
    :controls-position="props.controlsPosition"
    :name="props.name"
    :aria-label="props.ariaLabel"
    :placeholder="props?.placeholder ?? i18nTranslate('pleaseInput')"
    :id="props.id"
    :validate-event="props.validateEvent"
    @blur="onBlur"
    @focus="onFocus"
    @change="onChange"
  >
    <template v-if="hasSlot('decrease-icon')" #decrease-icon>
      <slot name="decrease-icon"></slot>
    </template>
    <template v-if="hasSlot('increase-icon')" #increase-icon>
      <slot name="increase-icon"></slot>
    </template>
    <template v-if="hasSlot('prefix')" #prefix>
      <slot name="prefix"></slot>
    </template>
    <template v-if="hasSlot('suffix')" #suffix>
      <slot name="suffix"></slot>
    </template>
  </ElInputNumber>
</template>

<style lang="scss" scoped>
div[class*="FormNumber"] {
  width: 100%;
  height: fit-content;
}
</style>
