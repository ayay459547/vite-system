<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElColorPicker } from 'element-plus'

import { getUuid } from '@/lib/lib_utils' // 工具

import type { Props, Emits, Expose } from './CustomColorInfo'
import { version, props as CustomColorInfo } from './CustomColorInfo'

const scopedId = getUuid(version)

const props = defineProps(CustomColorInfo)

const tempValue = computed<Props['modelValue']>({
  get: () => (props?.modelValue ?? ''),
  set: (value: Props['modelValue']) => emit('update:model-value', value)
})

const emit = defineEmits([
  'update:model-value',
  'change',
  'active-change',
  'focus',
  'blur'
])

const onChange: Emits['change'] = (value: string) => emit('change', value)
const onActiveChange: Emits['activeChange'] = (value: string) => emit('active-change', value)
const onFocus: Emits['focus'] = (event: FocusEvent) => emit('focus', event)
const onBlur: Emits['blur'] = (event: FocusEvent) => emit('blur', event)

const ElColorPickerRef = ref<InstanceType<typeof ElColorPicker>>()

// const color: Expose['color'] = ElColorPickerRef.value.color
const show: Expose['show'] = () => { ElColorPickerRef.value?.show() }
const hide: Expose['hide'] = () => { ElColorPickerRef.value?.hide() }
const focus: Expose['focus'] = () => { ElColorPickerRef.value?.focus() }
const blur: Expose['blur'] = () => { ElColorPickerRef.value?.blur() }

defineExpose({ show, hide, focus, blur })

</script>

<template>
  <div class="color-wrapper" :class="scopedId">
    <ElColorPicker
      ref="ElColorPickerRef"
      v-model="tempValue"
      :disabled="props.disabled"
      :size="props.size"
      :show-alpha="props.showAlpha"
      :color-format="props.colorFormat"
      :popper-class="props.popperClass"
      :predefine="props.predefine"
      :validate-event="props.validateEvent"
      :tabindex="props.tabIndex"
      :aria-label="props.ariaLabel"
      :id="props.id"
      :teleported="props.teleported"
      @change="onChange"
      @active-change="onActiveChange"
      @focus="onFocus"
      @blur="onBlur"
    />
  </div>
</template>

<style lang="scss" scoped>
div[class*="__CustomColor"].color {
  &-wrapper {
    display: block;
  }
}
</style>
