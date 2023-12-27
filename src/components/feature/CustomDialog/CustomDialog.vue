<script setup lang="ts">
import { type PropType, computed, useSlots } from 'vue'
import { ElDialog } from 'element-plus'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils'

export type ModelValue = boolean

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<ModelValue>,
    default: false,
    description: 'v-model 綁定是否顯示'
  },
  title: {
    type: String as PropType<string>,
    default: '',
    description: '標題'
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '',
    description: '寬度'
  },
  fullscreen: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否全屏'
  },
  top: {
    type: String as PropType<string>,
    default: '',
    description: 'dialog CSS 中的 margin-top值'
  },
  modal: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否需要遮罩'
  },
  modalClass: {
    type: String as PropType<string>,
    default: '',
    description: '自訂遮罩class'
  },
  appendToBody: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否插入至body'
  },
  lockScroll: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: '是否再出現時鎖住 bodey 的 scroll'
  },
  draggable: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否可拖拉'
  }
})

const emit = defineEmits([
  'update:modelValue'
])

const tempValue = computed<ModelValue>({
  get: () => props.modelValue,
  set: (value: ModelValue) => emit('update:modelValue', value)
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const scopedId = getUuid('__i-dialog__')

</script>

<template>
  <div class="__dialog-wrapper" :class="scopedId">
    <ElDialog
      v-model="tempValue"
      :title="props.title"
      :width="props.width"
      :fullscreen="props.fullscreen"
      :top="props.top"
      :modal="props.modal"
      :modal-class="props.modalClass"
      :append-to-body="props.appendToBody"
      :lock-scroll="props.lockScroll"
      :draggable="props.draggable"
    >
      <template v-if="hasSlot('default')" #default>
        <slot name="default"></slot>
      </template>
      <template v-if="hasSlot('header')" #header>
        <slot name="header"></slot>
      </template>
      <template v-if="hasSlot('footer')" #footer>
        <slot name="footer"></slot>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
.__dialog {
  &-wrapper {
    width: fit-content;
    height: fit-content;
  }
}
</style>
