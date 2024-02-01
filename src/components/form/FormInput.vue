<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, useSlots, ref, onMounted } from 'vue'
import { ElInput } from 'element-plus'

import { isEmpty, round, floor, ceil, hasOwnProperty, getUuid } from '@/lib/lib_utils'

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
  // 數字
  onlyNumber: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  round: {
    type: [Number, null] as PropType<number | null>,
    default: null
  },
  floor: {
    type: [Number, null] as PropType<number | null>,
    default: null
  },
  ceil: {
    type: [Number, null] as PropType<number | null>,
    default: null
  },
  max: {
    type: [Number, null] as PropType<number | null>,
    default: null
  },
  min: {
    type: [Number, null] as PropType<number | null>,
    default: null
  },
  // element ui plus
  clearable: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  type: {
    type: String as PropType<string>,
    default: 'text'
  },
  rows: {
    type: Number as PropType<number>,
    default: 2
  },
  showPassword: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  placeholder: {
    type: String as PropType<string>,
    required: false
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onFocus: Function as PropType<(e: FocusEvent) => void>,
  onClear: Function as PropType<() => void>,
  onBlur: Function as PropType<(e: FocusEvent) => void>,
  onChange: Function as PropType<(value: string | number) => void>,
  onInput: Function as PropType<(value: string | number) => void>
})

const bindAttributes = computed(() => {
  const attributes: any = {
    type: props.type,
    clearable: props.clearable,
    disabled: props.disabled,
    rows: props.rows,
    showPassword: props.showPassword
  }
  if (props.placeholder) {
    attributes.placeholder = props.placeholder
  }

  return attributes
})

const emit = defineEmits([
  'update:modelValue',
  'focus',
  'blur',
  'clear',
  'change',
  'input',
  'click'
])

let lastValue: any = ''
const onEvent = {
  focus: (e: FocusEvent): void => emit('focus', e),
  clear: (): void => emit('clear'),
  blur: (e: FocusEvent): void => emit('blur', e),
  change: (value: string | number): void => {
    let _value = value

    // 數字
    if (props.onlyNumber) {
      // 轉化數字
      if (typeof _value === 'string') {
        _value = Number.parseFloat(_value)

        // 不是數字 給最後一次的值
        if (Number.isNaN(_value)) {
          _value = lastValue
        }
      }

      if (typeof _value === 'number') {
        // 四捨五入
        if (!isEmpty(props.round)) {
          _value = round(_value, props.round)
        }
        // 無條件捨去
        if (!isEmpty(props.floor)) {
          _value = floor(_value, props.floor)
        }
        // 無條件進位
        if (!isEmpty(props.ceil)) {
          _value = ceil(_value, props.ceil)
        }

        // 最大值
        if (!isEmpty(props.max) && _value > props.max) {
          _value = props.max
        }
        // 最小值
        if (!isEmpty(props.min) && _value < props.min) {
          _value = props.min
        }
      }
    }

    // 去前後空白
    if (typeof _value === 'string') {
      _value = _value.replace(/^(\s+)|(\s+)$/g, '')
    }

    emit('change', _value)
    if (lastValue !== _value) {
      lastValue = _value
    }
  },
  input: (value: string | number): void => {
    emit('input', value)
  },
  click: (e: MouseEvent): void => {
    emit('click', e)
    e.stopPropagation()
  }
}

onMounted(() => {
  lastValue = props.modelValue
})

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

const scopedId = getUuid('__i-input__')

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const elInputRef = ref()
defineExpose({
  focus: (): void => {
    if (elInputRef.value) {
      elInputRef.value.focus()
    }
  },
  blur: (): void => {
    if (elInputRef.value) {
      elInputRef.value.blur()
    }
  }
})

</script>

<template>
  <div class="__i-input__" :class="scopedId">
    <ElInput
      ref="elInputRef"
      v-model="inputValue"
      class="__i-input__"
      :placeholder="$t('pleaseInput')"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
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
:deep(.__i-input__) {
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

.__i-input__ {
  width: 100%;
  height: 100%;
}
</style>
