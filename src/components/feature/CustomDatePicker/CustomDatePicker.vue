<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, useSlots, onMounted, onBeforeUnmount } from 'vue'
import { ElDatePicker } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

type BaseValue = string | null
export type ModelValue = BaseValue | [BaseValue, BaseValue]

type PickerType = 'year' | 'month' | 'date' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange'

const props = defineProps({
  modelValue: {
    type: [Array, String, null] as PropType<ModelValue>,
    required: true
  },
  direction: {
    type: String as PropType<'column' | 'row'>,
    required: false,
    default: 'column'
  },
  label: {
    type: String as PropType<string>,
    required: false,
    default: ''
  },
  hiddenLabel: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  // element ui plus
  clearable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  type: {
    type: String as PropType<PickerType>,
    default: 'date'
  }
})

const bindAttributes = computed(() => {
  return {
    type: props.type,
    clearable: props.clearable,
    disabled: props.disabled
  }
})

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'change'
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
    blur: (e: FocusEvent): void => {
      emit('blur', e)
    },
    change: (value: ModelValue): void => {
      emit('change', value)
    }
  }

  return event
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return Object.prototype.hasOwnProperty.call(slots, prop)
}

onMounted(() => {
  window.addEventListener('touchstart', e => e.preventDefault())
})

onBeforeUnmount(() => {
  window.removeEventListener('touchstart', e => e.preventDefault())
})

</script>

<template>
  <div
    class="input-container"
    :class="[`${props.direction}`]"
  >
    <label v-if="!props.hiddenLabel && props.label.length > 0" class="input-label">
      <span>{{ props.label }}</span>
    </label>

    <ElDatePicker
      v-model="tempValue"
      placeholder="Please input"
      class="input-main"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      :start-placeholder="t('startTime')"
      :end-placeholder="t('endTime')"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="validationListeners"
      @click.stop
    >
      <template
        v-if="hasSlot('default')"
        #default="{
          row, column,
          date, dayjs,
          end, start, inRange,
          disabled, text, timestamp, type,
          isSelected, selected, isCurrent,
          customClass
        }"
      >
        <slot
          name="default"
          :row="row"
          :column="column"
          :date="date"
          :dayjs="dayjs"
          :disabled="disabled"
          :text="text"
          :timestamp="timestamp"
          :type="type"
          :start="start"
          :end="end"
          :in-range="inRange"
          :is-selected="isSelected"
          :selected="selected"
          :is-current="isCurrent"
          :custom-class="customClass"
        ></slot>
      </template>
      <template v-if="hasSlot('range-separator')" #range-separator>
        <slot name="range-separator"></slot>
      </template>
    </ElDatePicker>
  </div>
</template>

<style lang="scss" scoped>
:deep(.input-main) {
  &.el-date-editor {
    width: 100% !important;
    max-height: 32px !important;
    border-radius: 4px;
  }

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
  }

  &-main {
    height: fit-content;
  }
}
</style>