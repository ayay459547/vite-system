<script setup lang="ts">
import type { PropType, WritableComputedRef } from 'vue'
import { computed, useSlots } from 'vue'
import { ElSelect, ElOption } from 'element-plus'

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
  options: {
    type: Array as PropType<Options>,
    default () {
      return []
    }
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
    change: (value: ModelValue): void => {
      emit('change', value)
    },
    'remove-tag': (value: ModelValue): void => {
      emit('remove-tag', value)
    },
    'visible-change': (value: boolean): void => {
      emit('visible-change', value)
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
      <span class="input-prefix"></span>
      <span>{{ props.label }}</span>
    </label>

    <ElSelect
      v-model="tempValue"
      :placeholder="$t('pleaseSelect')"
      class="input-main"
      :validate-event="false"
      :loading="props.loading"
      :remote="props.remote"
      :remote-method="props.remoteMethod"
      v-bind="bindAttributes"
      v-on="validationListeners"
      @click.stop
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
          ></slot>
        </template>
      </ElOption>
      <template v-if="hasSlot('prefix')" #prefix>
        <slot name="prefix"></slot>
      </template>
      <template v-if="hasSlot('empty')" #empty>
        <slot name="empty"></slot>
      </template>
    </ElSelect>
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
}
</style>