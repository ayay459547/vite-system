<script setup lang="ts">
import type { PropType, WritableComputedRef } from 'vue'
import { computed } from 'vue'
import { ElInput, ElSelect, ElOption } from 'element-plus'

export type OperatorOptions = 'equal' | 'greatthan' | 'lessthan' | '' | null
export type OperatorValue = string | number | null
export type ModelValue = [OperatorOptions, OperatorValue]

const props = defineProps({
  modelValue: {
    type: Array as unknown as PropType<ModelValue>,
    required: true,
    default () {
      return ['equal', null]
    }
  },
  direction: {
    type: String as PropType<'column' | 'row'>,
    default: 'column'
  },
  label: {
    type: String as PropType<string>,
    default: ''
  },
  hiddenLabel: {
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
  }
})

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'change',
  'input',
  'clear'
])

const tempValue: WritableComputedRef<ModelValue> = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => emit('update:modelValue', value)
})

const operatorType = computed<OperatorOptions>({
  get: () => props.modelValue[0],
  set: (value: OperatorOptions) => {
    tempValue.value = [
      value,
      props.modelValue[1]
    ]
  }
})
// 只接受數字
const operatorNumber = computed<OperatorValue>({
  get: () => props.modelValue[1],
  set: (value: OperatorValue) => {
    let newValue = value
    if (typeof value === 'string') {
      const regexp = /[\D]/g
      newValue = value.replace(regexp, '')
    }

    tempValue.value = [
      props.modelValue[0],
      newValue
    ]
  }
})

// event
const validationListeners = computed(() => {
  const event = {
    focus: (e: FocusEvent): void => {
      emit('focus', e)
    },
    clear: (): void => {
      emit('clear')
    },
    blur: (e: FocusEvent): void => {
      emit('blur', e)
    },
    change: (): void => {
      onChange()
    },
    input: (value: string | number): void => {
      emit('input', value)
    }
  }

  return event
})

const onChange = () => {
  const [operatorType, operatorNumber] = props.modelValue
  emit('change', [operatorType, operatorNumber])
}


</script>

<template>
  <div
    class="input-container"
    :class="[
      `${props.direction}`,
      props.hiddenLabel ? 'hidden-label' : ''
    ]"
  >
    <label v-if="!props.hiddenLabel && props.label.length > 0" class="input-label">
      <span>{{ props.label }}</span>
    </label>

    <div class="input-group" @click.stop>
      <ElSelect
        v-model="operatorType"
        :placeholder="$t('pleaseSelect')"
        :validate-event="false"
        :disabled="props.disabled"
        v-on="validationListeners"
      >
        <ElOption label="=" value="equal"/>
        <ElOption label=">=" value="greatthan"/>
        <ElOption label="<=" value="lessthan"/>
      </ElSelect>

      <ElInput
        v-model="operatorNumber"
        :placeholder="$t('pleaseInput')"
        class="input-main"
        :clearable="props.clearable"
        :disabled="props.disabled"
        :validate-event="false"
        v-on="validationListeners"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.input-main) {
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
  // .el-input__inner {
  //   text-align: right;
  // }
}
.input {
  &-container {
    width: 100%;
    height: 100%;
    display: flex;
    gap: 4px;
    &.hidden-label {
      height: fit-content;
    }
    &.row {
      flex-direction: row;
      align-items: center;
      height: fit-content;
    }
    &.column {
      flex-direction: column;
    }
  }

  &-label {
    width: fit-content;
    white-space: nowrap;
  }

  &-group {
    display: flex;
    gap: 16px;
  }

  &-main {
    width: 100%;
    height: fit-content;
  }
}
</style>