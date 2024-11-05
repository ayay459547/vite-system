<script setup lang="ts">
import { computed } from 'vue'
import type { CheckboxValueType, CheckboxGroupValueType } from 'element-plus'
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'

import { isEmpty, getUuid } from '@/lib/lib_utils' // 工具

import type { Props, Emits } from './FormCheckboxInfo'
import { version, props as formCheckboxProps } from './FormCheckboxInfo'

const scopedId = getUuid(version)

const props = defineProps(formCheckboxProps)

const bindAttributes = computed(() => {
  return {
    disabled: props.disabled,
    indeterminate: props.indeterminate
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const onEvent: {
  groupChange: Emits.Change<CheckboxGroupValueType>
  change: Emits.Change<CheckboxValueType>
} = {
  groupChange: value => emit('change', value),
  change: value => emit('change', value)
}

const validateRes = computed<string>(() => {
  if (isEmpty(props.errorMessage)) return 'success'
  return 'error'
})

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => {
    emit('update:modelValue', value)
  }
})

const getStyle = (isChecked: boolean, color?: string) => {
  if (!isChecked) return {}

  if (isEmpty(color)) return { color: '#409EFF' }

  return { color }
}

</script>

<template>
  <div class="__i-checkbox__" :class="scopedId">
    <template v-if="Array.isArray(inputValue)">
      <ElCheckboxGroup
        v-model="inputValue"
        class="__i-checkbox__"
        :class="[`validate-${validateRes}`]"
        :validate-event="false"
        v-bind="bindAttributes"
        @change="onEvent.groupChange"
      >
        <ElCheckbox
          v-for="item in options"
          :key="`${item.value}-${scopedId}`"
          :label="item.value"
          :value="item.value"
          :validate-event="false"
          :disabled="item.disabled ?? false"
        >
          <span :style="getStyle(inputValue.includes(item.value), item?.color)">
            <slot
              name="options"
              :is-checked="inputValue.includes(item.value)"
              :label="item.label"
              :value="item.value"
              :data="item.data"
              :color="item?.color ?? '#ffffff'"
            >
              {{ item.label }}
            </slot>
          </span>
        </ElCheckbox>
      </ElCheckboxGroup>
    </template>
    <template v-else>
      <ElCheckbox
        v-model="inputValue"
        class="__i-checkbox__"
        :class="[`validate-${validateRes}`]"
        :validate-event="false"
        v-bind="bindAttributes"
        @change="onEvent.change"
      >
        <slot name="default">
          {{ props.label }}
        </slot>
      </ElCheckbox>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '../Form.scss' as *;

:deep(.__i-checkbox__) {
  .el-checkbox {
    margin-right: 24px;

    .el-checkbox__label {
      padding-left: 8px;
    }
  }
  &.validate-error .el-checkbox__inner {
    @include validate-error(checkbox);
  }
}

:where(.__i-checkbox__) {
  width: 100%;
  height: fit-content;
}
</style>
