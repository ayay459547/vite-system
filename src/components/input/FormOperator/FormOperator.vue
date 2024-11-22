<script setup lang="ts">
import { computed, customRef, useSlots, ref, onMounted, inject, nextTick } from 'vue'
import { ElInput, ElSelect, ElOption } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { numberFormat } from '@/lib/lib_format' // 格式化
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Types, Props, Emits, Expose } from './FormOperatorInfo'
import { version, props as formOperatorProps } from './FormOperatorInfo'

const scopedId = getUuid(version)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formOperatorProps)

const bindAttributes = computed(() => {
  const attributes: any = {
    // clearable: props.clearable,
    clearable: false,
    disabled: props.disabled
  }
  if (!isEmpty(props.placeholder)) {
    attributes.placeholder = props.placeholder
  }

  return attributes
})

const emit = defineEmits([
  'update:model-value',
  'clear',
  'focus',
  'blur',
  'input',
  'change'
])

const isFocus = ref(false)

let lastValue: any = ''

onMounted(() => {
  lastValue = tempValue.value[1]
})
// 共用事件
const onEvent: {
  focus: Emits.Focus
  clear: Emits.Clear
  blur: Emits.Blur
} = {
  focus: $event => {
    isFocus.value = true
    emit('focus', $event)
  },
  clear: () => emit('clear'),
  blur: async $event => {
    isFocus.value = false
    await nextTick()
    // 300豪秒內沒有點在輸入框做事 就取消聚焦
    setTimeout(() => {
      if (!isFocus.value) {
        emit('blur', $event)
      }
    }, 300)
  }
}

// [select, input]
const tempValue = customRef<Props.ModelValue>((track, trigger) => {
  return {
    get: () => {
      track()
      if (isEmpty(props.modelValue)) return ['', ''] as Props.ModelValue
      return props.modelValue
    },
    set: (value: Props.ModelValue) => {
      emit('update:model-value', value)
      trigger()
    }
  }
})

// 選擇框事件
const onInputEvent = {
  input: (value: Types.OperatorValue) => {
    isFocus.value = true
    const [_selectValue] = [...tempValue.value]
    emit('input', [_selectValue, value])
  },
  change: (value: Types.OperatorValue) => {
    isFocus.value = false
    const [_selectValue, _inputValue] = [...tempValue.value]

    let _value = value
    // 數字
    if (props.type === 'number') {
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
          _value = numberFormat<number>(_value, {
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

    const emitValue: Props.ModelValue = [_selectValue, _value]
    tempValue.value = emitValue

    /**
     * select 必需有值
     * input 有值 || 原本有值
     */
    if (
      !isEmpty(_selectValue) &&
      (!isEmpty(_value) || !isEmpty(_inputValue))
    ) {
      prevChangeInput.value = _value
      emit('change', emitValue)
      emit('blur')
    }
  }
}
// 輸入框事件
const onSelectEvent = {
  input: (value: string | number): void => {
    isFocus.value = true
    const [_selectValue] = [...tempValue.value]
    emit('input', [_selectValue, value])
  },
  change: (value: string) => {
    isFocus.value = false
    const [_selectValue, _inputValue] = [...tempValue.value]

    /**
     * select 有值 || 原本有值
     * input 必需有值
     */
    if (
      (!isEmpty(value) || !isEmpty(_selectValue)) &&
      !isEmpty(_inputValue)
    ) {
      prevChangeInput.value = _inputValue
      emit('change', [value, _inputValue])
    }
  }
}

const selectValue = computed({
  get: () => tempValue.value[0],
  set: (value: Types.OperatorOptions) => {
    tempValue.value = [value, tempValue.value[1]]
  }
})

const inputValue = computed({
  get: () => tempValue.value[1],
  set: (value: Types.OperatorValue) => {
    tempValue.value = [tempValue.value[0], value]
  }
})

// 紀錄上一次的 change input 值
const prevChangeInput = ref<any>('')
const onEnter = async () => {
  await nextTick()
  // 與上一次不同時 emit change
  if (prevChangeInput.value !== inputValue.value) {
    prevChangeInput.value = inputValue.value
    emit('change', tempValue.value)
  }
}

// expose
const elInputRef = ref()
const focus: Expose.Blur = () => {
  elInputRef.value?.focus()
}
const blur: Expose.Blur = () => {
  elInputRef.value?.blur()
}
defineExpose({ focus, blur })

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

</script>

<template>
  <ElInput
    ref="elInputRef"
    v-model="inputValue"
    :class="scopedId"
    :placeholder="i18nTranslate('pleaseInput', defaultModuleType)"
    :validate-event="false"
    v-bind="bindAttributes"
    v-on="{...onEvent, ...onInputEvent}"
    clearable
    @keyup.enter="onEnter"
    @click.stop
  >
    <!-- 輸入框用 -->
    <template #prepend>
      <ElSelect
        v-model="selectValue"
        :placeholder="i18nTranslate('pleaseSelect', defaultModuleType)"
        :validate-event="false"
        :options="props.options"
        v-bind="bindAttributes"
        v-on="{
          ...onEvent,
          ...onSelectEvent
        }"
      >
        <ElOption
          v-for="item in props.options"
          :key="`operator-${item.value}-${scopedId}`"
          :label="item.label"
          :value="item.value"
        >
          <template v-if="hasSlot('option')" #options>
            <slot name="option" :label="item.label" :value="item.value">
              {{ item.label }}
            </slot>
          </template>
        </ElOption>
      </ElSelect>
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
</template>

<style lang="scss">
div[class*="FormOperator"] {
  width: 100%;
  height: fit-content;

  .el-input--suffix .el-input__wrapper {
    padding: 2px 12px;
  }
  .el-input-group__prepend {
    padding: 0;
    max-width: 100px;
    width: 100%;

    .el-select__wrapper {
      box-shadow: none !important;
    }
  }
}
</style>
