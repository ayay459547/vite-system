<script setup lang="ts">
import { computed, useSlots, ref } from 'vue'
import { ElDrawer } from 'element-plus'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具

import type { Emits, Expose } from './CustomDrawerInfo'
import { version, props as drawerProps } from './CustomDrawerInfo'

const scopedId = getUuid(version)

const props = defineProps(drawerProps)

const emit = defineEmits([
  'update:model-value',
  'open',
  'opened',
  'close',
  'closed',
  'open-auto-focus',
  'close-auto-focus'
])

const onOpen: Emits.Open = () => emit('open')
const onOpened: Emits.Opened = () => emit('opened')
const onClose: Emits.Close = () => emit('close')
const onClosed: Emits.Closed = () => emit('closed')
const onOpenAutoFocus: Emits.OpenAutoFocus = () => emit('open-auto-focus')
const onCloseAutoFocus: Emits.CloseAutoFocus = () => emit('close-auto-focus')

const ElDrawerRef = ref()
const handleClose: Expose.HandleClose = () => {
  if (ElDrawerRef.value) {
    ElDrawerRef.value.handleClose()
  }
}
defineExpose({ handleClose })

const tempValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:model-value', value)
  }
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <div class="drawer-container" :class="scopedId">
    <ElDrawer
      ref="ElDrawerRef"
      v-model="tempValue"
      :append-to-body="props.appendToBody"
      :append-to="props.appendTo"
      :lock-scroll="props.lockScroll"
      :before-close="props.beforeClose"
      :close-on-click-modal="props.closeOnClickModal"
      :close-on-press-escape="props.closeOnPressEscape"
      :open-delay="props.openDelay"
      :close-delay="props.closeDelay"
      :destroy-on-close="props.destroyOnClose"
      :modal="props.modal"
      :direction="props.direction"
      :show-close="props.showClose"
      :size="props.size"
      :title="props.title"
      :with-header="props.withHeader"
      :modal-class="props.modalClass"
      :z-index="props.zIndex"
      :header-aria-level="props.headerAriaLevel"
      class="drawer-main"
      @open="onOpen"
      @opened="onOpened"
      @close="onClose"
      @closed="onClosed"
      @open-auto-focus="onOpenAutoFocus"
      @close-auto-focus="onCloseAutoFocus"
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
    </ElDrawer>
  </div>
</template>

<style lang="scss" scoped>
:global(.el-overlay) {
  z-index: var(--i-z-index-drawer);
}

// :deep() 需要一個根節點
div[class*="__CustomDrawer"] :deep(.el-drawer) {
  &.drawer-main {
    width: 100%;
    min-height: 300px;
  }

  .el-drawer__header {
    margin-bottom: 0 !important;
  }
}
</style>
