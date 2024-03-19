<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { ElDrawer } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import {
  version,
  props as drawerProps
} from './CustomDrawerInfo'

const scopedId = getUuid('__i-drawer__')

const props = defineProps(drawerProps)

const emit = defineEmits([
  'update:modelValue',
  'open',
  'opened',
  'close',
  'closed'
])
const onOpen = () => emit('open')
const onOpened = () => emit('opened')
const onClose = () => emit('close')
const onClosed = () => emit('closed')

const tempValue = computed({
  get () {
    return props.modelValue
  },
  set (value: boolean) {
    emit('update:modelValue', value)
  }
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

</script>

<template>
  <ElDrawer
    v-model="tempValue"
    class="__drawer-container"
    :class="`CustomDrawer_${version} ${scopedId}`"
    :direction="props.direction"
    :title="props.title"
    :destroy-on-close="props.destroyOnClose"
    :custom-class="props.customClass"
    :modal="props.modal"
    :modal-class="props.modalClass"
    :size="props.size"
    @open="onOpen"
    @opened="onOpened"
    @close="onClose"
    @closed="onClosed"
  >
    <template v-if="hasSlot('default')" #default>
      <slot name="default"></slot>
    </template>
    <!-- header title 擇一使用 -->
    <template v-if="hasSlot('header')" #header>
      <slot name="header"></slot>
    </template>
    <!-- <template v-if="hasSlot('title')" #title>
      <slot name="title"></slot>
    </template> -->
    <template v-if="hasSlot('footer')" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDrawer>
</template>

<style lang="scss" scoped>
:deep(.__drawer-container) {
  &.el-drawer {
    .el-drawer__header {
      margin-bottom: 0;
    }
  }
}

.__drawer {
  &-container {
    width: 100%;
    min-height: 300px;
  }
}
</style>
