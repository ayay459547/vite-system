<script setup lang="ts">
import { type PropType, computed } from 'vue'
import { ElRadioGroup, ElRadio } from 'element-plus'

import { isEmpty, getUuid } from '@/lib/lib_utils'

export type Options = Array<{
  label: string
  value: string | number | boolean
  disabled?: boolean
  color?: string
}>

type ModelValue = number | string | boolean | null

const props = defineProps({
  modelValue: {
    type: [Boolean, String, Number, null] as PropType<ModelValue>,
    required: true
  },
  errorMessage: {
    type: String as PropType<string>,
    default: ''
  },
  options: {
    type: Array as PropType<Options>,
    default() {
      return []
    }
  },
  // element ui plus
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onChange: Function as PropType<(e: ModelValue) => void>
})

const bindAttributes = computed(() => {
  return {
    disabled: props.disabled
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const onEvent = {
  change: (value: ModelValue): void => emit('change', value)
}

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

const scopedId = getUuid('__i-radio__')

const getStyle = (isSelected: boolean, color?: string) => {
  if (!isSelected) return {}

  if (isEmpty(color)) return { color: '#409EFF' }

  return { color }
}
</script>

<template>
  <div class="__i-radio__" :class="scopedId">
    <ElRadioGroup
      v-model="inputValue"
      size="large"
      class="__i-radio__"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
    >
      <ElRadio
        v-for="item in props.options"
        :key="`key-${item.value}`"
        :value="item.value"
        :disabled="item.disabled ?? false"
      >
        <div class="__i-radio__" :style="getStyle(inputValue === item.value, item?.color)">
          <slot
            name="option"
            :is-selected="inputValue === item.value"
            :label="item.label"
            :value="item.value"
            :color="item?.color ?? '#ffffff'"
          >
            {{ item.label }}
          </slot>
        </div>
      </ElRadio>
    </ElRadioGroup>
  </div>
</template>

<style lang="scss" scoped>
:deep(.__i-radio__) {
  &.validate-error .el-radio__inner {
    border: 1px solid $danger;
    background-color: lighten($danger, 20%);
  }
}
.__i-radio__ {
  width: 100%;
  height: fit-content;
}
</style>
