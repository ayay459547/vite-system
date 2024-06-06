<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Draggable from 'vuedraggable'

import { isEmpty, getUuid } from '@/lib/lib_utils'

import type { Custom, Emits } from './CustomDraggableInfo'
import { version, props as draggableProps } from './CustomDraggableInfo'

const scopedName = '__i-draggable__'
const scopedId = getUuid(scopedName)

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
const onChange: Emits.Change = ($event: Custom.DraggableChange) => emit('change', $event)

const listValue = computed({
  get() {
    if (isEmpty(props.modelValue)) return []

    return props.modelValue
  },
  set(value: any[]) {
    emit('update:modelValue', value)
  }
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <div :class="[`CustomDraggable_${version}`, scopedId, scopedName]" class="draggable-container">
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
.__i-draggable__.draggable {
  &-container {
    display: contents;

    .draggable {
      width: 100%;
      display: flex;
      // height: 100%;
    }
  }
}
.__i-draggable__ .ghost {
  opacity: 0.7;
  background: #c8ebfb;
}

.__i-draggable__ .list-group {
  // width: 100%;
  // height: 100%;
  border-bottom: 1px solid #ffffff00;

  &-item {
    background-color: var(--el-bg-color);
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
