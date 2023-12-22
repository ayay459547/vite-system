<script setup lang="ts">
import { type PropType, computed, useSlots } from 'vue'
import { ElDrawer } from 'element-plus'
import { getUuid } from '@/lib/lib_utils'

export type DrawerDirection = 'rtl' | 'ltr' | 'ttb' | 'btt'

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否顯示'
  },
  direction: {
    type: String as PropType<DrawerDirection>,
    default: 'rtl',
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
  },
  size: {
    type: [Number, String] as PropType<number | string>,
    default: '',
    description: '視窗大小'
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

const scopedId = getUuid('__i-drawer__')

</script>

<template>
  <div class="__drawer-wrapper" :class="scopedId">
    <ElDrawer
      v-model="tempValue"
      class="__drawer-container card-info"
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
  </div>
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
