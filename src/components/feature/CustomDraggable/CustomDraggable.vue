<script setup lang="ts">
import Draggable from 'vuedraggable'
import { computed, useSlots } from 'vue'
import type { PropType } from 'vue'

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<any[]>,
    required: true
  },
  itemKey: {
    type: String as PropType<string>,
    required: false,
    default: 'id'
  },
  handle: {
    type: String as PropType<string>,
    required: false,
    default: '.__draggable'
  },
  tag: {
    type: String as PropType<string>,
    required: false,
    default: 'div'
  },
  clone: {
    type: Function as PropType<Function>,
    required: false,
    default: (original: any) => {
      return original
    }
  },
  move: {
    type: [Function, undefined] as PropType<Function | undefined>,
    required: false,
    default: undefined
  },
  componentData: {
    type: [Object, null] as PropType<Record<any, any> | null>,
    required: false,
    default: null
  },
  group: {
    type: [String, Object] as PropType<any>,
    required: false,
    default: 'name'
  },
  ghostClass: {
    type: String as PropType<string>,
    required: false,
    default: ''
  }
})

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

const onStart = ($event: any) => emit('start', $event)
const onAdd = ($event: any) => emit('add', $event)
const onRemove = ($event: any) => emit('remove', $event)
const onUpdate = ($event: any) => emit('update', $event)
const onEnd = ($event: any) => emit('end', $event)
const onChoose = ($event: any) => emit('choose', $event)
const onUnchoose = ($event: any) => emit('unchoose', $event)
const onSort = ($event: any) => emit('sort', $event)
const onFilter = ($event: any) => emit('filter', $event)
const onClone = ($event: any) => emit('clone', $event)

export type Change = {
  added: {
    newIndex: number
    element: Record<string, any>
  }
  removed: {
    oldIndex: number
    element: Record<string, any>
  }
  moved: {
    newIndex: number
    oldIndex: number
    element: Record<string, any>
  }
}
const onChange = ($event: Change) => emit('change', $event)

const listValue = computed({
  get () {
    return props.modelValue
  },
  set (value: any[]) {
    emit('update:modelValue', value)
  }
})

</script>

<template>
  <div class="draggable-wrapper">
    <Draggable
        v-model="listValue"
        :handle="props.handle"
        :group="props.group"
        :item-key="props.itemKey"
        :tag="props.tag"
        :ghost-class="props.ghostClass"
        :move="props.move"
        :clone="props.clone"
        @start="onStart"
        @add="onAdd"
        @remove="onRemove"
        @update="onUpdate"
        @end="onEnd"
        @choose="onChoose"
        @unchoose="onUnchoose"
        @sort="onSort"
        @filter="onFilter"
        @clone="onClone"
        @change="onChange"
      >
        <template v-if="hasSlot('header')" #header>
          <slot name="header"></slot>
        </template>

        <template v-if="hasSlot('item')" #item="scoped">
          <div class="__draggable">
            <slot
              name="item"
              v-bind="scoped"
              :element="scoped.element"
              :index="scoped.index"
            ></slot>
          </div>
        </template>

        <template v-if="hasSlot('footer')" #footer>
          <slot name="footer"></slot>
        </template>
      </Draggable>
  </div>
</template>

<style lang="scss" scoped>
.draggable {
  &-wrapper {
    display: contents;

    .__draggable {
      width: 100%;
      height: 100%;
    }
  }
}
</style>