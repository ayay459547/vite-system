<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { ElDialog } from 'element-plus'

import { hasOwnProperty, getUuid } from '@/lib/lib_utils'

import { type ModelValue, version, props as dialogProps } from './CustomDialogInfo'

const scopedId = getUuid('__i-dialog__')

const props = defineProps(dialogProps)

const emit = defineEmits(['update:modelValue'])

const tempValue = computed<ModelValue>({
  get: () => props.modelValue,
  set: (value: ModelValue) => emit('update:modelValue', value)
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
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
    :class="`CustomDialog_${version} ${scopedId}`"
    class="__dialog-wrapper"
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
</template>

<style lang="scss" scoped>
.__dialog {
  &-wrapper {
    width: fit-content;
    height: fit-content;
  }
}
</style>
