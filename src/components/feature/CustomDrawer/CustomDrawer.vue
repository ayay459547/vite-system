<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { PropType } from 'vue'
import { ElDrawer } from 'element-plus'

export type Direction = 'rtl' | 'ltr' | 'ttb' | 'btt' | 'rtl'

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否顯示'
  },
  direction: {
    type: String as PropType<Direction>,
    default: 'ttb',
    description: '打開方向'
  },
  title: {
    type: String as PropType<string>,
    default: '',
    description: '標題'
  },
  destroyOnClose: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否在關閉抽屜之後將子元素全部銷毀'
  },
  customClass: {
    type: String as PropType<string>,
    default: '',
    description: 'Drawer自訂class'
  },
  modal: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: '是否需要遮罩'
  },
  modalClass: {
    type: String as PropType<string>,
    default: '',
    description: '遮罩自訂class'
  }
})

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

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

</script>

<template>
  <div class="drawer-wrapper">
    <ElDrawer
      v-model="tempValue"
      class="drawer-container card-info"
      :direction="props.direction"
      :title="props.title"
      :destroy-on-close="destroyOnClose"
      :custom-class="customClass"
      :modal="modal"
      :modal-class="modalClass"
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
$padding: 24px;

:deep(.drawer-container) {
  &.el-drawer {
    inset: $padding $padding;
    width: calc(100% - $padding * 2);
  }
}

.drawer {
  &-wrapper {
    width: fit-content;
    height: fit-content;
  }
  &-container {
    width: 100%;
    min-height: 300px;
  }
}
</style>
