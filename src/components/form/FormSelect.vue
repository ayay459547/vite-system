<script setup lang="ts">
import { ElSelect, ElOption } from 'element-plus'
import type { PropType } from 'vue'
import { computed, useSlots } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    required: true
  },
  label: {
    type: String as PropType<string>,
    required: false,
    default: ''
  },
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  options: {
    type: Array as PropType<{ label: string, value: string }[]>,
    required: false,
    default () {
      return []
    }
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
const validateField = (veeValue: string) => {
  console.log(veeValue)
  // 必填
  if (props.required && [null, undefined, ''].includes(veeValue)) {
    return '此輸入框為必填'
  }
  // 非必填
  if ([null, undefined, ''].includes(veeValue)) return true

  return true
}

/**
 * https://vee-validate.logaretm.com/v4/guide/composition-api/validation/
 * 如果您useField在輸入組件中使用，您不必自己管理它，它會自動為您完成。
 * 每當useField值發生變化時，它都會發出update:modelValue事件，
 * 並且每當modelValueprop 發生變化時useField，值都會自動同步和驗證。
 */
// const tempValue: WritableComputedRef<string> = computed({
//   get: () => props.modelValue,
//   set: (value: string) => emit('update:modelValue', value)
// })
const { errorMessage, value: tempValue, handleChange } = useField('field', validateField, { validateOnValueUpdate: false })

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
      handleChange(e, true)
    },
    change: (value: string): void => {
      emit('change', value)
      handleChange(value, true)
    },
    'remove-tag': (value: string): void => {
      emit('remove-tag', value)
      handleChange(value, true)
    },
    'visible-change': (value: boolean): void => {
      emit('visible-change', value)
    }
  }
  if ([null, undefined, ''].includes(errorMessage.value)) {
    return {
      ...event
    }
  } else {
    return event
  }

})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return Object.prototype.hasOwnProperty.call(slots, prop)
}

</script>

<template>
  <div class="input-container">
    <label v-if="props.label.length > 0" class="input-label">
      <span v-if="props.required" class="input-required">*</span>
      <span>{{ props.label }}</span>
    </label>

    <ElSelect
      v-model="tempValue"
      placeholder="Please input"
      class="input-main"
      :class="[`validate-${validateRes}`]"
      v-on="validationListeners"
    >
      <slot>
        <ElOption
          v-for="item in props.options"
          :key="item.value"
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
    flex-direction: column;
    gap: 4px;
  }

  &-required {
    color: $danger;
    display: inline-block;
    padding-right: 2px;
  }

  &-main {
    height: fit-content;
  }

  &-error {
    color: $danger;
  }
}
</style>