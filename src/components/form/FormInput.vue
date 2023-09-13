<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, useSlots } from 'vue'
import { ElInput } from 'element-plus'
import { isEmpty } from '@/lib/lib_utils'

type ModelValue = string | number | null

const props = defineProps({
  modelValue: {
    type: [String, Number, null] as PropType<ModelValue>,
    required: true
  },
  errorMessage: {
    type: String as PropType<string>,
    default: ''
  },
  onlyNumber: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  // element ui plus
  type: {
    type: String as PropType<string>,
    default: 'text'
  },
  rows: {
    type: Number as PropType<number>,
    default: 2
  },
  clearable: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  showPassword: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const bindAttributes = computed(() => {
  return {
    type: props.type,
    rows: props.rows,
    clearable: props.clearable,
    disabled: props.disabled,
    showPassword: props.showPassword
  }
})

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'change',
  'input',
  'clear',
  'click'
])

const validateRes = computed<string>(() => {
  if (isEmpty(props.errorMessage)) return 'success'
  return 'error'
})

// 轉數字
const inputValue = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => {
    let _value = value
    if (typeof _value === 'string' && props.onlyNumber) {
      const regexp = /[\D]/g
      _value = _value.replace(regexp, '')
    }
    emit('update:modelValue', _value)
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return Object.prototype.hasOwnProperty.call(slots, prop)
}

const onEvent = {
  focus: (e: FocusEvent): void => {
    emit('focus', e)
  },
  clear: (): void => {
    emit('clear')
  },
  blur: async (e: FocusEvent): Promise<void> => {
    emit('blur', e)
  },
  change: (value: string | number): void => {
    emit('change', value)
  },
  input: (value: string | number): void => {
    emit('input', value)
  }
}

</script>

<template>
  <div class="el-input">
    <ElInput
      v-model.trim="inputValue"
      :placeholder="$t('pleaseInput')"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
      @click.stop
    >
      <!-- 輸入框用 -->
      <template v-if="hasSlot('prepend')" #prepend>
        <slot name="prepend"></slot>
      </template>
      <template v-if="hasSlot('append')" #append>
        <slot name="append"></slot>
      </template>
      <!-- 圖示用 -->
      <template v-if="hasSlot('prefix')" #prefix>
        <slot name="prefix"></slot>
      </template>
      <template v-if="hasSlot('suffix')" #suffix>
        <slot name="suffix"></slot>
      </template>
    </ElInput>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-input) {
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
    box-shadow: 0 0 0 1px $danger inset;
    background-color: lighten($danger, 20%);
  }
}

.el-input {
  width: 100%;
  height: 100%;
}
</style>
