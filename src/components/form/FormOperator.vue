<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, customRef, useSlots } from 'vue'
import { ElInput, ElSelect, ElOption } from 'element-plus'
import { isEmpty, hasOwnProperty } from '@/lib/lib_utils'
import type { Options } from '@/components'

export type OperatorOptions = 'equal' | 'greatthan' | 'lessthan' | '' | string | null
export type OperatorValue = string | number | null
export type ModelValue = [OperatorOptions, OperatorValue]

const props = defineProps({
  modelValue: {
    type: Array as unknown as PropType<ModelValue>,
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
        // { label: '>=', value: 'greatthan' },
        // { label: '<=', value: 'lessthan' }
      ]
    }
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
  return {
    clearable: props.clearable,
    disabled: props.disabled
  }
})

const emit = defineEmits([
  'update:modelValue',
  'clear',
  'change'
])

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
    let _value = value
    // 去前後空白
    if (typeof _value === 'string') {
      _value = _value.replace(/^(\s+)|(\s+)$/g, '')
    }
    // 轉數字
    if (props.onlyNumber && typeof _value === 'string') {
      const regexp = /[\D]/g
      _value = _value.replace(regexp, '')
    }

    tempValue.value = [
      props.modelValue[0],
      _value
    ]
  }
})

const onChange = async (value: any, type: string) => {
  const emitValue = [...props.modelValue]
  switch (type) {
    case 'select':
      emitValue[0] = value
      break
    case 'input':
      emitValue[1] = value
      break
  }
  emit('change', emitValue)
}

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty.call(slots, prop)
}

</script>

<template>
  <div class="i-input" @click.stop>
    <ElInput
      v-model="inputValue"
      class="i-input"
      :placeholder="$t('pleaseInput')"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      @clear="emit('clear')"
      @change="onChange($event, 'input')"
    >
      <!-- 輸入框用 -->
      <template #prepend>
        <div class="i-select">
          <ElSelect
            v-model="selectValue"
            :placeholder="$t('pleaseSelect')"
            :validate-event="false"
            :options="props.options"
            v-bind="bindAttributes"
            @clear="emit('clear')"
            @change="onChange($event, 'select')"
          >
            <ElOption
              v-for="item in props.options"
              :key="`${item.value}`"
              :label="item.label"
              :value="item.value"
            >
              <template v-if="hasSlot('defalut')" #defalut>
                <slot
                  name="defalut"
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
:deep(.i-input) {
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

.i {
  &-input {
    width: 100%;
    height: 100%;
  }

  &-select {
    width: 100%;
    max-width: 100px;
  }
}
</style>
