<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Draggable from 'vuedraggable'

import { getUuid, hasOwnProperty, isEmpty } from '@/lib/lib_utils' // 工具

import type { Types, Emits } from './CustomDraggableInfo'
import { version, props as draggableProps } from './CustomDraggableInfo'

const scopedId = getUuid(version)

const props = defineProps(draggableProps)

const emit = defineEmits([
  'start',
  'add',
  'remove',
  'update',
  'end',
  'choose',
  'unchoose',
  'sort',
  'filter',
  'clone',
  'change',
  'update:model-value'
])

const onUpdate: Emits.Update = ($event: any) => emit('update', $event)
const onSort: Emits.Sort = ($event: any) => emit('sort', $event)
// const onFilter: Emits.Filter = ($event: any) => emit('filter', $event)
const onStart: Emits.Start = ($event: any) => emit('start', $event)
const onEnd: Emits.End = ($event: any) => emit('end', $event)
const onAdd: Emits.Add = ($event: any) => emit('add', $event)
const onRemove: Emits.Remove = ($event: any) => emit('remove', $event)
const onChoose: Emits.Choose = ($event: any) => emit('choose', $event)
const onUnchoose: Emits.Unchoose = ($event: any) => emit('unchoose', $event)
const onClone: Emits.Clone = ($event: any) => emit('clone', $event)
const onChange: Emits.Change = ($event: Types.DraggableChange) => emit('change', $event)

const listValue = computed({
  get() {
    if (isEmpty(props.modelValue)) return []
    return props.modelValue
  },
  set(value: any[]) {
    emit('update:model-value', value)
  }
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <div class="draggable-container" :class="scopedId">
    <Draggable
      v-model="listValue"
      :handle="props.handle"
      :group="props.group"
      :move="props.move"
      :disabled="props.disabled"
      :clone="props.clone"
      :item-key="props.itemKey"
      :tag="props.tag"
      :animation="200"
      class="list-group"
      :class="`flex-${props.direction} ${props.class}`"
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
      @update="onUpdate"
      @sort="onSort"
    >
      <template v-if="hasSlot('header')" #header>
        <slot name="header"></slot>
      </template>

      <template #item="{ element, index }">
        <li
          class="draggable __draggable-move__ list-group-item"
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
  </div>
</template>

<style lang="scss" scoped>
div[class*="__CustomDraggable"] {
  &.draggable {
    &-container {
      display: contents;

      .draggable {
        width: 100%;
        display: flex;
        // height: 100%;
      }
    }
  }

  .ghost {
    opacity: 0.7;
    background: var(--el-color-primary-light-7);
  }

  .list-group {
    // width: 100%;
    // height: 100%;
    // border-bottom: 1px solid #ffffff00;

    &-item {
      background-color: inherit;
      // border-bottom: 1px solid var(--el-border-color);

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

      // &:nth-last-child(1) {
      //   border-bottom: none;
      // }
    }
  }
}
</style>
