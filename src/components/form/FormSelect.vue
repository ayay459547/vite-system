<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, useSlots, ref } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { useField } from 'vee-validate'

export type Options = Array<{
  label: string
  value: string | number | boolean | null
}>

export type ModelValue = string | number | null | Record<string, any> | Array<any>

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object, null] as PropType<ModelValue>,
    required: true
  },
  validateKey: {
    type: String as PropType<string>,
    default: ''
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
  required: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  options: {
    type: Array as PropType<Options>,
    default () {
      return []
    }
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
  multiple: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  filterable: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const bindAttributes = computed(() => {
  return {
    clearable: props.clearable,
    disabled: props.disabled,
    filterable: props.filterable,
    multiple: props.multiple,
    collapseTags: props.multiple,
    collapseTagsTooltip: props.multiple
  }
})

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'change',
  'remove-tag',
  'visible-change',
  'clear'
])

const validateRes = computed<string>(() => {
  if ([null, undefined, ''].includes(errorMessage.value)) return 'success'
  return 'error'
})

// 驗證
const validateField = (veeValue: ModelValue) => {
  // 非必填
  if (!props.required) return true

  // 必填
  if (props.required && [null, undefined, ''].includes(veeValue as any)) {
    return '此輸入框為必填'
  }

  return true
}

const {
  errorMessage,     // 錯誤訊息
  value: tempValue, // 值
  handleChange,     // 換值
  handleReset,      // 重置
  validate          // 驗證
} = useField('field', validateField, { validateOnValueUpdate: false })

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
      handleChange(tempValue.value, true)
    },
    change: (value: ModelValue): void => {
      emit('change', value)
      handleChange(value, true)
    },
    'remove-tag': (value: ModelValue): void => {
      emit('remove-tag', value)
      handleChange(value, true)
    },
    'visible-change': (value: boolean): void => {
      emit('visible-change', value)
    }
  }

  return event
})

const _domValidateKey = ref<string>('')
const domValidateKey = computed(() => {
  return _domValidateKey.value.length > 0 ? _domValidateKey.value : props.validateKey
})

defineExpose({
  key: props.validateKey,
  value: tempValue,
  handleReset,
  validate,
  setvalidateKey (validateKey: string) {
    _domValidateKey.value = validateKey
  },
  getDom () {
    return document.querySelector(`[class*="input-${domValidateKey.value}"]`)
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return Object.prototype.hasOwnProperty.call(slots, prop)
}

</script>

<template>
  <div
    class="input-container"
    :class="[
      `input-${domValidateKey}-${validateRes}`,
      `${props.direction}`,
      props.hiddenLabel ? 'hidden-label' : ''
    ]"
  >
    <label v-if="!props.hiddenLabel" class="input-label">
      <span v-if="props.required" class="input-required input-prefix">*</span>
      <span v-else class="input-prefix"></span>
      <span>{{ props.label }}</span>
    </label>

    <ElSelect
      v-model="tempValue"
      :placeholder="$t('pleaseSelect')"
      class="input-main"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="validationListeners"
    >
      <slot>
        <ElOption
          v-for="item in props.options"
          :key="`${item.value}`"
          :label="item.label"
          :value="item.value"
        />
      </slot>
      <template v-if="hasSlot('prefix')" #prefix>
        <slot name="prefix"></slot>
      </template>
      <template v-if="hasSlot('empty')" #empty>
        <slot name="empty"></slot>
      </template>
    </ElSelect>

    <span class="input-error">{{ errorMessage }}</span>
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
  &.validate-error .el-input__wrapper {
    box-shadow: 0 0 0 1px $danger inset;
    background-color: lighten($danger, 20%);
  }
}
.input {
  &-container {
    width: 100%;
    height: 88px;
    display: flex;
    gap: 4px;
    &.hidden-label {
      height: 48px;
    }
    &.row {
      flex-direction: row;
      align-items: center;
      height: 48px;
    }
    &.column {
      flex-direction: column;
    }
  }

  &-prefix {
    display: inline-block;
    width: 10px;
  }
  &-required {
    color: $danger;
    display: inline-block;
    padding-right: 2px;
  }

  &-label {
    width: fit-content;
    white-space: nowrap;
    height: 21px;
  }

  &-main {
    height: fit-content;
  }

  &-error {
    color: $danger;
  }
}
</style>