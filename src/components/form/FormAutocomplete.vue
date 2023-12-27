<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, useSlots, ref } from 'vue'
import { ElAutocomplete } from 'element-plus'

import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils'

type ModelValue = string | number | null
export type FetchSuggestions = (queryString: string, callback: (data: any) => void) => void

const props = defineProps({
  modelValue: {
    type: [String, Number, null] as PropType<ModelValue>,
    required: true
  },
  errorMessage: {
    type: String as PropType<string>,
    default: ''
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
  valueKey: {
    type: String as PropType<string>,
    default: 'value'
  },
  fitInputWidth: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  fetchSuggestions: {
    type: Function as PropType<FetchSuggestions>
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onSelect: Function as PropType<(item: ModelValue) => void>,
  onChange: Function as PropType<(value: string | number) => void>
})

const bindAttributes = computed(() => {
  return {
    clearable: props.clearable,
    disabled: props.disabled,
    valueKey: props.valueKey,
    fitInputWidth: props.fitInputWidth
  }
})

const emit = defineEmits([
  'update:modelValue',
  'select',
  'change'
])

const onEvent = {
  select: (item: ModelValue): void => emit('select', item),
  change: (value: string | number): void => emit('change', value)
}

const validateRes = computed<string>(() => {
  if (isEmpty(props.errorMessage)) return 'success'
  return 'error'
})

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const elAutocompleteRef = ref()
defineExpose({
  focus: (): void => {
    if (elAutocompleteRef.value) {
      elAutocompleteRef.value.focus()
    }
  },
  blur: (): void => {
    if (elAutocompleteRef.value) {
      elAutocompleteRef.value.blur()
    }
  }
})

const scopedId = getUuid('__i-autocomplete__')

</script>

<template>
  <div class="__i-autocomplete__" :class="scopedId">
    <ElAutocomplete
      ref="elAutocompleteRef"
      v-model="inputValue"
      class="__i-autocomplete__"
      :placeholder="$t('pleaseInput')"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      :fetch-suggestions="fetchSuggestions"
      v-bind="bindAttributes"
      v-on="onEvent"
      @click.stop
    >
      <template v-if="hasSlot('default')" #default="scope">
        <slot name="default" v-bind="scope"></slot>
      </template>
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
    </ElAutocomplete>
  </div>
</template>

<style lang="scss" scoped>
:deep(.__i-autocomplete__) {
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

  &.el-autocomplete {
    width: 100%;
  }
}

.__i-autocomplete__ {
  width: 100%;
  height: 100%;
}
</style>
