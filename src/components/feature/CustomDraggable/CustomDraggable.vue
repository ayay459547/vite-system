<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Draggable from 'vuedraggable'

import { getUuid, hasOwnProperty, tipLog, isEmpty } from '@/lib/lib_utils' // 工具

import type { Types, Emits } from './CustomDraggableInfo'
import { version, props as draggableProps } from './CustomDraggableInfo'

const scopedId = getUuid(version)

const props = defineProps(draggableProps)

const emit = defineEmits([
  'start', 'add', 'remove', 'update', 'end',
  'choose', 'unchoose',
  'sort', 'filter',
  'clone', 'change', 'update:model-value'
])

// const onFilter: Emits['filter'] = ($event: any) => emit('filter', $event)
const onStart: Emits['start'] = ($event: any) => emit('start', $event)
const onEnd: Emits['end'] = ($event: any) => emit('end', $event)
const onAdd: Emits['add'] = ($event: any) => emit('add', $event)
const onRemove: Emits['remove'] = ($event: any) => emit('remove', $event)
const onChoose: Emits['choose'] = ($event: any) => emit('choose', $event)
const onUnchoose: Emits['unchoose'] = ($event: any) => emit('unchoose', $event)
const onClone: Emits['clone'] = ($event: any) => emit('clone', $event)
const onChange: Emits['change'] = ($event: Types['draggableChange']) => emit('change', $event)
// const onUpdate: Emits['update'] = ($event: any[]) => emit('update', $event)
const onSort: Emits['sort'] = ($event: any) => emit('sort', $event)

// v-model :list 只能擇一綁定
const isUseModelValue = computed(() => {
  return ![undefined, null].includes(props.modelValue)
})
// 警告同時使用 modelValue 和 list
if (isUseModelValue.value && !isEmpty(props.list)) {
  tipLog('CustomDraggable: modelValue 與 list 不能同時使用', [
    `modelValue: ${JSON.stringify(props.modelValue)}`,
    `list: ${JSON.stringify(props.list)}`
  ])
}

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <Draggable
    v-bind="(
      isUseModelValue ?
      { modelValue: props.modelValue } :
      { list: props.list }
    )"
    @update:model-value="(value: any[]) => {
      if (isUseModelValue) {
        emit('update:model-value', value)
      }
    }"
    :handle="props.handle"
    :group="props.group"
    :move="props.move"
    :disabled="props.disabled"
    :clone="props.clone"
    :item-key="props.itemKey"
    :tag="props.tag"
    :sort="props.sort"
    :animation="200"
    class="custom-draggable"
    :class="[
      `flex-${props.direction}`,
      props.class,
      scopedId
    ]"
    :ghost-class="ghostClass"
    :style="{
      width: props.width,
      height: props.height,
      ...props.style
    }"
    @start="onStart"
    @end="onEnd"
    @add="onAdd"
    @remove="onRemove"
    @choose="onChoose"
    @unchoose="onUnchoose"
    @clone="onClone"
    @change="onChange"
    @sort="onSort"
  >
    <template v-if="hasSlot('header')" #header>
      <slot name="header"></slot>
    </template>

    <template #item="{ element, index }">
      <li
        class="custom-draggable-item __draggable-move__"
        :class="[`${props.rowClass}`, props.stripe ? 'stripe' : '']"
        :style="props.rowStyle"
      >
        <slot name="item" :element="element" :index="index"></slot>
      </li>
    </template>

    <template v-if="hasSlot('footer')" #footer>
      <slot name="footer"></slot>
    </template>
  </Draggable>
</template>

<style lang="scss" scoped>
:global(.ghost) {
  opacity: 0.5 !important;
  border-radius: 6px;
  background: var(--el-color-primary-light-8) !important;
}

[class*="__CustomDraggable"] {
  &.custom-draggable {
    width: 100%;
    // height: 100%;
    display: flex;
  }

  .custom-draggable-item {
    width: 100%;
    display: flex;
    background-color: inherit;

    &.stripe {
      &:nth-child(even) {
        background-color: var(--el-color-info-light-9);
        transition-duration: 0.3s;
      }

      &:hover,
      &:nth-child(even):hover {
        background-color: var(--el-color-info-light-8);
        transition-duration: 0.3s;
      }
    }
  }
}
</style>
