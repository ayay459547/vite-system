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
// 選擇框事件
const onInputEvent = {
  input: (value: Types.OperatorValue) => {
    isFocus.value = true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_selectValue, _inputValue] = [...props.modelValue] as Props.ModelValue
    emit('input', [_selectValue, value])
  },
  change: (value: Types.OperatorValue) => {
    isFocus.value = false
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_selectValue, _inputValue] = [...props.modelValue] as Props.ModelValue

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_selectValue, _inputValue] = [...props.modelValue] as Props.ModelValue
    emit('input', [_selectValue, value])
  },
  change: (value: string) => {
    isFocus.value = false
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_selectValue, _inputValue] = [...props.modelValue] as Props.ModelValue

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

// [select, input]
const tempValue = customRef<Props.ModelValue>((track, trigger) => {
  return {
    get: () => {
      track()
      return props.modelValue
    },
    set: (value: Props.ModelValue) => {
      emit('update:modelValue', value)
      trigger()
    }
  }
})

const selectValue = computed({
  get: () => props.modelValue[0],
  set: (value: Types.OperatorOptions) => {
    tempValue.value = [value, props.modelValue[1]]
  }
})

const inputValue = computed({
  get: () => props.modelValue[1],
  set: (value: Types.OperatorValue) => {
    tempValue.value = [props.modelValue[0], value]
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const elInputRef = ref()

const focus: Expose.Blur = () => {
  elInputRef.value?.focus()
}
const blur: Expose.Blur = () => {
  elInputRef.value?.blur()
}
defineExpose({ focus, blur })

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
</script>

<template>
  <ElInput
    ref="elInputRef"
    v-model="inputValue"
    :class="scopedId"
    :placeholder="i18nTranslate('pleaseInput')"
    :validate-event="false"
    v-bind="bindAttributes"
    v-on="{...onEvent, ...onInputEvent}"
    clearable
    @keyup.enter="onEnter"
    @click.stop
  >
    <!-- 輸入框用 -->
    <template #prepend>
      <div class="i-prepend">
        <div class="i-select">
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
        </div>
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
</template>

<style lang="scss" scoped>
div[class*="FormOperator"] {
  :deep(.el-input--suffix .el-input__wrapper) {
    padding: 2px 12px;
  }
  :deep(.el-input-group__prepend) {
    padding: 0;
  }
  :deep(.el-input-group__prepend .el-select) {
    margin: 0;
  }

  .i {
    &-prepend {
      width: 100%;
      height: 100%;
    }
    &-select {
      width: 100%;
      max-width: 120px;
      min-width: 90px !important;
    }
  }
}
</style>
