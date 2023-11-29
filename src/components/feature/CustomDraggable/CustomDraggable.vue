<script setup lang="ts">
import Draggable from 'vuedraggable'
import { computed, useSlots } from 'vue'
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
    required: true,
    description: '綁定資料列表'
  },
  itemKey: {
    type: String as PropType<string>,
    required: false,
    default: 'id',
    description: '每筆資料的key'
  },
  handle: {
    type: String as PropType<string>,
    required: false,
    default: '.__draggable',
    description: '指定可拖拉的元素(css選擇器)'
  },
  width: {
    type: String as PropType<string>,
    required: false,
    default: '100%',
    description: '列表寬度'
  },
  height: {
    type: String as PropType<string>,
    required: false,
    default: '100%',
    description: '列表高度'
  },
  stripe: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '列表高度'
  },
  class: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '外層class'
  },
  style: {
    type: Object as PropType<Record<string, string>>,
    required: false,
    default () {
      return {}
    },
    description: '外層style 類型為object 不能使用string'
  },
  rowClass: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '資料列class'
  },
  rowStyle: {
    type: Object as PropType<Record<string, string>>,
    required: false,
    default () {
      return {}
    },
    description: '資料列style 類型為object 不能使用string'
  },
  tag: {
    type: String as PropType<string>,
    required: false,
    // default: 'TransitionGroup'
    default: 'ul',
    description: '外層html標籤'
  },
  clone: {
    type: Function as PropType<Function>,
    required: false,
    default: (original: any) => {
      return original
    },
    description: '自訂拷貝方式'
  },
  move: {
    type: [Function, undefined] as PropType<Function | undefined>,
    required: false,
    default: undefined,
    description: '移動後的回調函數'
  },
  // componentData: {
  //   type: [Object, null] as PropType<Record<any, any> | null>,
  //   required: false,
  //   default: null
  // },
  ghostClass: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '移動中的class'
  },
  direction: {
    type: String as PropType<'column' | 'row'>,
    default: 'column',
    description: '方向'
  },
  group: {
    type: [String, Object] as PropType<any>,
    required: false,
    default: 'name',
    description: '資料列class'
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

export type DraggableChange = {
  added?: {
    newIndex: number
    element: Record<string, any>
  }
  removed?: {
    oldIndex: number
    element: Record<string, any>
  }
  moved?: {
    newIndex: number
    oldIndex: number
    element: Record<string, any>
  }
}
const onChange = ($event: DraggableChange) => emit('change', $event)

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
          :class="[
            `__draggable list-group-item ${props.rowClass}`,
            props.stripe ? 'stripe' : ''
          ]"
          :style="props.rowStyle"
        >
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
  // width: 100%;
  // height: 100%;

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
