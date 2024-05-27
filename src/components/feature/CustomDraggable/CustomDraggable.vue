<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Draggable from 'vuedraggable'

import { isEmpty, getUuid } from '@/lib/lib_utils'

import type { DraggableChange } from './CustomDraggableInfo'
import { version, props as draggableProps } from './CustomDraggableInfo'

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const scopedId = getUuid('__i-draggable__')

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
  'update:modelValue'
])

const onUpdate = ($event: any) => emit('update', $event)
const onSort = ($event: any) => emit('sort', $event)
// const onFilter = ($event: any) => emit('filter', $event)
const onStart = ($event: any) => emit('start', $event)
const onEnd = ($event: any) => emit('end', $event)
const onAdd = ($event: any) => emit('add', $event)
const onRemove = ($event: any) => emit('remove', $event)
const onChoose = ($event: any) => emit('choose', $event)
const onUnchoose = ($event: any) => emit('unchoose', $event)
const onClone = ($event: any) => emit('clone', $event)
const onChange = ($event: DraggableChange) => emit('change', $event)

const listValue = computed({
  get() {
    if (isEmpty(props.modelValue)) return []

    return props.modelValue
  },
  set(value: any[]) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <div :class="`CustomDraggable_${version} ${scopedId}`" class="__draggable-wrapper">
    <Draggable
      v-model="listValue"
      :handle="props.handle"
      :group="props.group"
      :move="props.move"
      :clone="props.clone"
      :item-key="props.itemKey"
      :tag="props.tag"
      :disabled="false"
      :animation="200"
      class="__list-group"
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
          :class="[`__draggable __list-group-item ${props.rowClass}`, props.stripe ? 'stripe' : '']"
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
.__draggable {
  &-wrapper {
    display: contents;

    .__draggable {
      width: 100%;
      display: flex;
      // height: 100%;
    }
  }
}
.ghost {
  opacity: 0.7;
  background: #c8ebfb;
}

.__list-group {
  // width: 100%;
  // height: 100%;
    border-bottom: 1px solid #ffffff00;

  &-item {
    background-color: #fff;
    border-bottom: 1px solid #ebeef5;

    &.stripe {
      &:nth-child(even) {
        background-color: #fafafa;
        transition-duration: 0.3s;
      }

      &:hover,
      &:nth-child(even):hover {
        background-color: #f5f7fa;
        transition-duration: 0.3s;
      }
    }
  }
}
</style>
