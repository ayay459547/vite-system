<script setup lang="ts">
import { ElInput } from 'element-plus'
import type { PropType, WritableComputedRef } from 'vue'
import { defineProps, defineEmits, computed, useSlots } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    required: true
  },
  label: {
    type: String as PropType<string>,
    required: false,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const tempValue: WritableComputedRef<string> = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

function validateField (value) {
  if (!value) {
    return 'this field is required'
  }

  if (value.length < 8) {
    return 'this field must contain at least 8 characters'
  }

  return true
}

const { errorMessage, value } = useField(() => tempValue.value, validateField)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return Object.prototype.hasOwnProperty.call(slots, prop)
}

</script>

<template>
  <div class="input-container">
    <label v-if="props.label.length > 0" class="input-label">
      {{ props.label }}
    </label>

    <el-input
      v-model="value"
      placeholder="Please input"
      class="input-main"
    >
      <!-- 輸入框用 -->
      <template v-if="hasSlot('prepend')" #prepend>
        <slot name="prepend"></slot>
      </template>
      <template v-if="hasSlot('append')" #append>
        <slot name="append"></slot>
      </template>
      <!-- 圖示用 -->
      <template #prefix>
        <slot name="prefix"></slot>
      </template>
      <template #suffix>
        <slot name="suffix"></slot>
      </template>
    </el-input>

    <span class="input-error">{{ errorMessage }}</span>
  </div>
</template>

<style lang="scss" scoped>
.input {
  &-container {
    width: fit-content;
    height: fit-content;
  }
}
</style>