<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, useSlots, ref, nextTick } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { useField } from 'vee-validate'
import { isEmpty } from '@/lib/lib_utils'

export type Options = Array<{
  label: string
  value: string | number | boolean | null
  disabled?: boolean
}>

export type ModelValue = string | number | boolean | null | Record<string, any> | Array<any>

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object, null] as PropType<ModelValue>,
    required: true
  },
  errorMessage: {
    type: String as PropType<string>,
    default: ''
  },
  options: {
    type: Array as PropType<Options>,
    default () {
      return []
    }
  },
  // 區別一般 select 與 group select 尚未製作
  type: {
    type: String as PropType<string>,
    default: 'text'
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
    loading: props.loading,
    remote: props.remote,
    remoteMethod: props.remoteMethod,
    multiple: props.multiple,
    multipleLimit: props.multipleLimit,
    maxCollapseTags: props.maxCollapseTags,
    collapseTags: props.multiple,
    collapseTagsTooltip: props.multiple,
    filterable: props.filterable,
    allowCreate: props.allowCreate
  }
})

const emit = defineEmits([
  'update:modelValue',
  'focus',
  'blur',
  'clear',
  'change',
  'remove-tag',
  'visible-change'
])

const validateRes = computed<string>(() => {
  if (isEmpty(props.errorMessage)) return 'success'
  return 'error'
})

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => {
    emit('update:modelValue', value)
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return Object.prototype.hasOwnProperty.call(slots, prop)
}

const onEvent = {
  focus: (e: FocusEvent): void => {
    emit('focus', e)
  },
  clear: (): void => {
    emit('clear')
  },
  blur: async (e: FocusEvent): Promise<void> => {
    emit('blur', e)
  },
  change: (value: string | number): void => {
    emit('change', value)
  },
  removeTag: (tagValue: any): void => {
    emit('remove-tag', tagValue)
  },
  visibleChange: (visible: boolean): void => {
    emit('visible-change', visible)
  }
}

</script>

<template>
  <div class="el-select">
    <ElSelect
      v-model="inputValue"
      :placeholder="$t('pleaseSelect')"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
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
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-select) {
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
.el-select {
  width: 100%;
  height: 100%;
}
</style>