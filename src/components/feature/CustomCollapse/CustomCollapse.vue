<script setup lang="ts">
import { useSlots, computed, inject } from 'vue'
import { ElCollapse, ElCollapseItem } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { CustomEmpty } from '@/components' // 系統組件
import { getUuid } from '@/lib/lib_utils' // 工具

import type { Props, Emits } from './CustomCollapseInfo'
import { version, props as collapseProps } from './CustomCollapseInfo'

const scopedId = getUuid(version)

const props = defineProps(collapseProps)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: props.i18nModule
})

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
    :class="scopedId"
    @change="onChange"
  >
    <template v-if="props.options.length > 0">
      <ElCollapseItem
        v-for="item in props.options"
        :key="`${item.value}-${scopedId}`"
        :title="i18nTranslate(item?.i18nLabel ?? item.label)"
        :name="item.value"
        :disabled="item.disabled ?? false"
      >
        <template v-if="hasSlot(`${item.value}-title`)" #title>
          <slot :name="`${item.value}-title`" v-bind="item">
            <label class="collapse-title">{{ i18nTranslate(item?.i18nLabel ?? item.label) }}</label>
          </slot>
        </template>
        <template v-else #title>
          <slot name="title" v-bind="item">
            <label class="collapse-title">{{ i18nTranslate(item?.i18nLabel ?? item.label) }}</label>
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
    <ElCollapseItem v-else title="none" name="empty">
      <CustomEmpty />
    </ElCollapseItem>
  </ElCollapse>
</template>

<style lang="scss" scoped>
div[class*="__CustomCollapse"].collapse {
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
