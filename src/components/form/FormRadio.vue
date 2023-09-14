<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { ElRadioGroup, ElRadio } from 'element-plus'
import { isEmpty } from '@/lib/lib_utils'

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
    default () {
      return []
    }
  },
  // element ui plus
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const bindAttributes = computed(() => {
  return {
    disabled: props.disabled
  }
})

const emit = defineEmits([
  'update:modelValue',
  'change'
])

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

const getStyle = (isSelected: boolean, color?: string) => {
  if (!isSelected) return {}

  if (isEmpty(color)) return { color: '#409EFF' }

  return { color }
}

</script>

<template>
  <div class="i-radio">
    <ElRadioGroup
      v-model="inputValue"
      size="large"
      class="i-radio"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
    >
      <ElRadio
        v-for="item in props.options"
        :key="`key-${item.value}`"
        :label="item.value"
        :disabled="item.disabled ?? false"
      >
        <span :style="getStyle(inputValue === item.value, item?.color)">
          <slot
            name="option"
            :is-selected="inputValue === item.value"
            :label="item.label"
            :value="item.value"
            :color="item?.color ?? '#ffffff'"
          >
            {{ item.label }}
          </slot>
        </span>
      </ElRadio>
    </ElRadioGroup>
  </div>
</template>

<style lang="scss" scoped>
:deep(.i-radio) {
  &.validate-error .el-radio__inner {
    border: 1px solid $danger;
    background-color: lighten($danger, 20%);
  }
}
.i-radio {
  width: 100%;
  height: fit-content;
}
</style>