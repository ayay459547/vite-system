<script setup lang="ts">
import Draggable from 'vuedraggable'
import { computed, useSlots, ref } from 'vue'
import type { PropType } from 'vue'
import { isEmpty } from '@/lib/lib_utils'

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
  rowClass: {
    type: String as PropType<string>,
    required: false,
    default: ''
  },
  tag: {
    type: String as PropType<string>,
    required: false,
    // default: 'TransitionGroup'
    default: 'ul'
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

const drag = ref(false)

const onStart = ($event: any) => {
  drag.value = true
  emit('start', $event)
}
const onAdd = ($event: any) => emit('add', $event)
const onRemove = ($event: any) => emit('remove', $event)
const onUpdate = ($event: any) => emit('update', $event)
const onEnd = ($event: any) => {
  drag.value = false
  emit('end', $event)
}
const onChoose = ($event: any) => emit('choose', $event)
const onUnchoose = ($event: any) => emit('unchoose', $event)
const onSort = ($event: any) => {
  console.log('sort')
  emit('sort', $event)
}
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
const onChange = ($event: Change) => {
  drag.value = false
  emit('change', $event)
}

const listValue = computed({
  get () {
    if (isEmpty(props.modelValue)) return []

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
      :move="props.move"
      :clone="props.clone"
      :item-key="props.itemKey"
      :tag="props.tag"
      :disabled="false"
      :animation="200"
      class="list-group"
      ghost-class="ghost"
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

      <template #item="{ element, index }">
        <li :class="`__draggable list-group-item ${props.rowClass}`">
          <slot
            name="item"
            :element="element"
            :index="index"
          ></slot>
        </li>
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
      display: flex;
      // height: 100%;
    }
  }
}
.ghost {
  opacity: 0.7;
  background: #c8ebfb;
}

.list-group {
  &-item {
    background-color: #fff;
    border-bottom: 1px solid #ebeef5;

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

</style>