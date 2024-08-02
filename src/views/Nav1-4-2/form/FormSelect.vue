<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, useSlots, ref, nextTick } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { useField } from 'vee-validate'

import { isEmpty, hasOwnProperty } from '@/lib/lib_utils.ts'

export type Options = Array<{
  label: string
  value: string | number | boolean | null
}>

export type ModelValue = string | number | boolean | null | Record<string, any> | Array<any>

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object, null] as PropType<ModelValue>,
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
    default() {
      return []
    }
  },
  text: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  // element ui plus
  loading: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  remote: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  remoteMethod: {
    type: Function as PropType<Function>,
    required: false
  },
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
  multipleLimit: {
    type: Number as PropType<number>,
    default: 0
  },
  maxCollapseTags: {
    type: Number as PropType<number>,
    default: 3
  },
  filterable: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  allowCreate: {
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
    collapseTagsTooltip: props.multiple,
    multipleLimit: props.multipleLimit,
    maxCollapseTags: props.maxCollapseTags,
    allowCreate: props.allowCreate
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
  if (isEmpty(errorMessage.value)) return 'success'
  return 'error'
})

// 驗證
const validateField = (veeValue: ModelValue) => {
  // 非必填
  if (!props.required) return true

  // 必填
  if (props.required && isEmpty(veeValue as any)) {
    return '此輸入框為必填'
  }

  return true
}

/**
 * 複選 格式是 array
 * vee 驗證 modelValue 轉字串
 */
const inputValue = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => {
    emit('update:modelValue', value)
  }
})

const {
  errorMessage, // 錯誤訊息
  value: tempValue, // 值
  handleChange, // 換值
  handleReset, // 重置
  validate // 驗證
} = useField('field', validateField, {
  validateOnValueUpdate: false,
  initialValue: inputValue.value,
  valueProp: inputValue.value
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
    blur: async (e: FocusEvent): Promise<void> => {
      emit('blur', e)

      // 確保畫面更新完才做驗證
      // 太快做驗證會一瞬間 出現紅色
      await nextTick()
      setTimeout(() => {
        handleChange(tempValue.value, true)
      }, 300)
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
  setvalidateKey(validateKey: string) {
    _domValidateKey.value = validateKey
  },
  getDom() {
    return document.querySelector(`[class*="input-${domValidateKey.value}"]`)
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const getTextValue = (tempValue: ModelValue) => {
  if (isEmpty(tempValue)) return ''

  const _option = props.options.find(option => option.value === tempValue)
  return _option?.label ?? ''
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
      <span>{{ props.label }}</span>
    </label>

    <div v-if="props.text" class="i-pt-sm">
      {{ getTextValue(tempValue) }}
    </div>

    <ElSelect
      v-else
      v-model="inputValue"
      :placeholder="$t('pleaseSelect')"
      class="input-main"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      :loading="props.loading"
      :remote="props.remote"
      :remote-method="props.remoteMethod"
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
$test-danger: #f56c6c;

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
    box-shadow: 0 0 0 1px $test-danger inset;
    background-color: lighten($test-danger, 20%);
  }
}
.input {
  &-container {
    width: 100%;
    height: 88px;
    display: flex;
    gap: 4px;
    position: relative;
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
    position: absolute;
    left: -10px;
    top: 0;
  }
  &-required {
    color: $test-danger;
  }

  &-label {
    width: fit-content;
    white-space: nowrap;
    height: 21px;
  }

  &-main {
    width: 100%;
    height: fit-content;
  }

  &-error {
    color: $test-danger;
  }
}
</style>
