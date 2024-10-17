<script setup lang="ts">
import { computed } from 'vue'
import { ElRadioGroup, ElRadio } from 'element-plus'

import { isEmpty, getUuid } from '@/lib/lib_utils'

import type { Props, Emits } from './FormRadioInfo'
import { version, props as formRadioProps } from './FormRadioInfo'

const scopedId = getUuid(version)

const props = defineProps(formRadioProps)

const bindAttributes = computed(() => {
  return {
    disabled: props.disabled
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const onEvent: {
  change: Emits.Change
} = {
  change: (value: Props.ModelValue): void => emit('change', value)
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

const getStyle = (isSelected: boolean, color?: string) => {
  if (!isSelected) return {}

  if (isEmpty(color)) return { color: '#409EFF' }

  return { color }
}

</script>

<template>
  <div class="__i-radio__" :class="scopedId">
    <ElRadioGroup
      v-model="inputValue"
      size="large"
      class="__i-radio__"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
    >
      <ElRadio
        v-for="item in props.options"
        :key="`radio-${item.value}-${scopedId}`"
        :label="item.value"
        :value="item.value"
        :disabled="item.disabled ?? false"
      >
        <div class="__i-radio__" :style="getStyle(inputValue === item.value, item?.color)">
          <slot
            name="options"
            :is-selected="inputValue === item.value"
            :label="item.label"
            :value="item.value"
            :data="item.data"
            :color="item?.color ?? '#ffffff'"
          >
            {{ item.label }}
          </slot>
        </div>
      </ElRadio>
    </ElRadioGroup>
  </div>
</template>

<style lang="scss" scoped>
@use '../Form.scss' as *;

:deep(.__i-radio__) {
  &.validate-error .el-radio__inner {
    @include validate-error(radio);
  }

  .el-radio {
    margin-right: 24px;
  }

  input[type="radio" i] {
    margin: 3px 3px 0px 5px;
  }
}
.__i-radio__ {
  width: 100%;
  height: fit-content;
}
</style>
