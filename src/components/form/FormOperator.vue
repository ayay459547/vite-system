<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, customRef, useSlots, ref, onMounted, nextTick, inject } from 'vue'
import { ElInput, ElSelect, ElOption } from 'element-plus'

import type { UseHook } from '@/declare/hook'
import type { Options } from '@/components'
import { isEmpty, numberFormat, hasOwnProperty, getUuid } from '@/lib/lib_utils'

export type OperatorOptions = 'equal' | 'greatthan' | 'lessthan' | '' | string | null
export type OperatorValue = string | number | null
export type ModelValue = [OperatorOptions, OperatorValue]

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})

const scopedId = getUuid('__i-operator__')

const props = defineProps({
  modelValue: {
    type: Array as unknown as PropType<ModelValue>,
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
  options: {
    type: Array as PropType<Options>,
    default () {
      return [
        // { label: '=', value: 'equal' },
        // { label: '>', value: 'greatterThan' },
        // { label: '>=', value: 'greaterThanOrEqualTo' },
        // { label: '<', value: 'lessThan' },
        // { label: '<=', value: 'lessThanOrEqualTo' },
        // { label: '<>', value: 'notEqual' }
      ]
    }
  },
  placeholder: {
    type: String as PropType<string>,
    required: false
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onFocus: Function as PropType<(e: any) => void>,
  onClear: Function as PropType<() => void>,
  onBlur: Function as PropType<(e: any) => void>,
  onChange: Function as PropType<(value: any) => void>,
  onInput: Function as PropType<(value: any) => void>
})

const bindAttributes = computed(() => {
  const attributes: any = {
    clearable: props.clearable,
    disabled: props.disabled
  }
  if (!isEmpty(props.placeholder)) {
    attributes.placeholder = props.placeholder
  }

  return attributes
})

const emit = defineEmits([
  'update:modelValue',
  'clear',
  'focus',
  'blur',
  'input',
  'change'
])

const isFocus = ref(false)


let lastValue: any = ''

onMounted(() => {
  lastValue = props.modelValue[1]
})

const onEvent = {
  focus: (e: FocusEvent): void => {
    isFocus.value = true
    emit('focus', e)
  },
  clear: (): void => emit('clear'),
  blur: (e: FocusEvent): void => {
    isFocus.value = false

    setTimeout(async () => {
      await nextTick()
      if (!isFocus.value) {
        emit('blur', e)
      }
    }, 0)
  },
  input: (value: string | number, type: string): void => {
    const [ _selectValue, _inputValue ] = [...props.modelValue] as  ModelValue

    let emitValue = null
    switch (type) {
      case 'select':
        emitValue = [value, _inputValue]
      break
      case 'input':
        emitValue = [_selectValue, value]
      break
    }
    emit('input', emitValue)
  },
  change: (value: any, type: string) => {
    const [ _selectValue, _inputValue ] = [...props.modelValue] as  ModelValue

    let emitValue = null
    switch (type) {
      case 'select':
        emitValue = [value, _inputValue]
      break
      case 'input': {
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
            // 取小數點到第幾位
            if (!isEmpty(props.round)) {
              _value = numberFormat(_value, {
                type: 'round',
                toFixed: props.round
              })
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

        emitValue = [_selectValue, _value]
      }
      break
    }

    tempValue.value = emitValue
    emit('change', emitValue)
  }
}

const validateRes = computed<string>(() => {
  if (isEmpty(props.errorMessage)) return 'success'
  return 'error'
})

const tempValue = customRef<ModelValue>((track, trigger) => {
  return {
    get: () => {
      track()
      return props.modelValue
    },
    set: (value: ModelValue) => {
      emit('update:modelValue', value)
      trigger()
    }
  }
})

const selectValue = computed({
  get: () => props.modelValue[0],
  set: (value: OperatorOptions) => {
    tempValue.value = [
      value,
      props.modelValue[1]
    ]
  }
})

const inputValue = computed({
  get: () => props.modelValue[1],
  set: (value: OperatorValue) => {
    tempValue.value = [
      props.modelValue[0],
      value
    ]
  }
})

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
  <div
    class="__i-operator__"
    :class="scopedId"
    @click.stop
  >
    <ElInput
      ref="elInputRef"
      v-model="inputValue"
      class="__i-operator__"
      :placeholder="i18nTranslate('pleaseInput')"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
      @input="onEvent.input($event, 'input')"
      @change="onEvent.change($event, 'input')"
    >
      <!-- 輸入框用 -->
      <template #prepend>
        <div class="__i-select__">
          <ElSelect
            v-model="selectValue"
            :placeholder="i18nTranslate('pleaseSelect')"
            :validate-event="false"
            :options="props.options"
            v-bind="bindAttributes"
            v-on="onEvent"
            @input="onEvent.input($event, 'select')"
            @change="onEvent.change($event, 'select')"
          >
            <ElOption
              v-for="item in props.options"
              :key="`${item.value}`"
              :label="item.label"
              :value="item.value"
            >
              <template v-if="hasSlot('option')" #option>
                <slot
                  name="option"
                  :label="item.label"
                  :value="item.value"
                >
                  {{ item.label }}
                </slot>
              </template>
            </ElOption>
          </ElSelect>
        </div>
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
:deep(.i-operator) {
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
  &.validate-error .el-input__wrapper,
  &.validate-error .el-input--suffix .el-input__wrapper {
    box-shadow: 0 0 0 1px $danger inset !important;
    background-color: lighten($danger, 20%);
  }
  .el-input--suffix .el-input__wrapper {
    padding: 2px 11px;
  }
  .el-input-group__prepend {
    padding: 0;
  }
  .el-input-group__prepend .el-select {
    margin: 0;
  }
}

.__i {
  &-operator__ {
    width: 100%;
    height: 100%;
  }

  &-select__ {
    width: 100%;
    max-width: 100px;
  }
}
</style>
