<script setup lang="ts">
import { useSlots, computed } from 'vue'
import { ElCollapse, ElCollapseItem } from 'element-plus'

import { CustomEmpty } from '@/components'
import { getUuid } from '@/lib/lib_utils.ts'

import type { Props, Emits } from './CustomCollapseInfo.ts'
import { version, props as collapseProps } from './CustomCollapseInfo.ts'

const scopedName = '__i-collapse__'
const scopedId = getUuid(scopedName)

const props = defineProps(collapseProps)

const emit = defineEmits(['update:modelValue', 'change'])
const onChange: Emits.Change = (active: Props.ModelValue) => {
  emit('change', active)
}

const tempValue = computed<Props.ModelValue>({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => emit('update:modelValue', value)
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <ElCollapse
    v-model="tempValue"
    :accordion="props.accordion"
    class="collapse-container"
    :class="[`CustomCollapse_${version}`, scopedId, scopedName]"
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
            <label class="collapse-title">{{ item.label }}</label>
          </slot>
        </template>
        <template v-else #title>
          <slot name="title" v-bind="item">
            <label class="collapse-title">{{ item.label }}</label>
          </slot>
        </template>

        <template v-if="hasSlot(`${item.value}`)" #default>
          <slot :name="`${item.value}`" v-bind="item">
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
</template>

<style lang="scss" scoped>
.__i-collapse__.collapse {
  &-container {
    width: 100%;
    height: fit-content;
  }

  &-title {
    font: {
      size: 1.2em;
      weight: 600;
    }
    padding: 0 8px;
  }
}
</style>
