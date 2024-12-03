<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { ElDrawer } from 'element-plus'

import { getUuid } from '@/lib/lib_utils' // 工具

import type { Emits } from './CustomDrawerInfo'
import { version, props as drawerProps } from './CustomDrawerInfo'

const scopedId = getUuid(version)

const props = defineProps(drawerProps)

const emit = defineEmits([
  'update:model-value',
  'open',
  'opened',
  'close',
  'closed'
])

const onOpen: Emits.Open = () => emit('open')
const onOpened: Emits.Opened = () => emit('opened')
const onClose: Emits.Close = () => emit('close')
const onClosed: Emits.Closed = () => emit('closed')

const tempValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:model-value', value)
  }
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <div class="drawer-container" :class="scopedId">
    <ElDrawer
      v-model="tempValue"
      :direction="props.direction"
      :title="props.title"
      :destroy-on-close="props.destroyOnClose"
      :custom-class="props.customClass"
      :modal="props.modal"
      :modal-class="props.modalClass"
      :size="props.size"
      class="drawer-main"
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
