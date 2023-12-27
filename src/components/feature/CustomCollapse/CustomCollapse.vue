<script setup lang="ts">
import type { PropType, WritableComputedRef } from 'vue'
import { useSlots, computed } from 'vue'
import { ElCollapse, ElCollapseItem } from 'element-plus'

import { CustomEmpty } from '@/components'
import { getUuid } from '@/lib/lib_utils'

export type ModelValue = string | string[]

export type Options = {
  lable: string
  value: string
  disabled?: boolean
} & any

const props = defineProps({
  modelValue: {
    type: [Array, String] as PropType<ModelValue>,
    default: '',
    description: `v-model 綁定是否顯示
      一般模式 值為陣列: 可展開多個
      手風琴模式 值為字串: 只能展開一個
    `
  },
  accordion: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否為手風琴模式'
  },
  options: {
    type: Array as PropType<Options[]>,
    default () {
      return []
    }
  }
})

const emit = defineEmits([
  'update:modelValue',
  'change'
])

const tempValue: WritableComputedRef<ModelValue> = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => emit('update:modelValue', value)
})

const onChange = (active: ModelValue) => {
  emit('change', active)
}

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const scopedId = getUuid('__i-collapse__')

</script>

<template>
  <div class="__collapse" :class="scopedId">
    <ElCollapse
      v-model="tempValue"
      :accordion="props.accordion"
      @change="onChange"
    >
      <template v-if="props.options.length > 0">
        <ElCollapseItem
          v-for="item in props.options"
          :key="item.value"
          :title="item.label"
          :name="item.value"
          :disabled="item.disabled ?? false"
        >
          <template v-if="hasSlot(`${item.value}-title`)" #title>
            <slot :name="`${item.value}-title`" v-bind="item">
              <label class="__collapse-title">{{ item.label }}</label>
            </slot>
          </template>
          <template v-else #title>
            <slot name="title" v-bind="item">
              <label class="__collapse-title">{{ item.label }}</label>
            </slot>
          </template>

          <template v-if="hasSlot(item.value)" #default>
            <slot :name="item.value" v-bind="item">
              <span>{{ item.value }}</span>
            </slot>
          </template>
          <template v-else #default>
            <slot name="default" v-bind="item">
              <span>{{ item.value }}</span>
            </slot>
          </template>
        </ElCollapseItem>
      </template>
      <ElCollapseItem v-else title="無選項" name="empty">
        <CustomEmpty />
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<style lang="scss" scoped>
.__collapse {
  width: 100%;
  height: fit-content;

  &-title {
    font-size: 1.2em;
    font-weight: 600;
    padding: 0 8px;
  }
}
</style>
