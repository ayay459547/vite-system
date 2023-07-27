<script setup lang="ts">
import type { PropType, WritableComputedRef } from 'vue'
import { computed, useSlots } from 'vue'
import { ElInput } from 'element-plus'

export type ModelValue = string | null

const props = defineProps({
  modelValue: {
    type: [String, null] as PropType<ModelValue>,
    required: true
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
  'clear'
])

const tempValue: WritableComputedRef<ModelValue> = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => emit('update:modelValue', value)
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
    change: (value: string | number): void => {
      emit('change', value)
    },
    input: (value: string | number): void => {
      emit('input', value)
    }
  }

  return event
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
      `${props.direction}`,
      props.hiddenLabel ? 'hidden-label' : ''
    ]"
  >
    <label v-if="!props.hiddenLabel" class="input-label">
      <span>{{ props.label }}</span>
    </label>

    <ElInput
      v-model="tempValue"
      :placeholder="$t('pleaseInput')"
      class="input-main"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="validationListeners"
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
    height: 21px;
  }

  &-main {
    height: fit-content;
  }
}
</style>