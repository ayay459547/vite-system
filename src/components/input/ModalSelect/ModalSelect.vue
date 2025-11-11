<script setup lang="ts">
import type { WatchHandle } from 'vue'
import { watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useModalSelectStore } from '@/stores/stores_components/useModalSelectStore'
import { CustomIcon } from '@/components/feature' // 系統組件
import { getUuid } from '@/lib/lib_utils'

import { version, props as modalSelectProps } from './ModalSelectInfo'

const searchId = getUuid(version)

const props = defineProps(modalSelectProps)

const emit = defineEmits([
  'update:model-value',
  'open',
  'submit'
])

const modalSelectStore = useModalSelectStore()
const {
  activeType, activeId, lastActiveId, activeValue, isModalOpen,
  multiple: modal_multiple, multipleLimit: modal_multipleLimit
} = storeToRefs(modalSelectStore)


// 監聽
let unwatch: WatchHandle | null = null

const openWatch = () => {
  unwatch = watch(isModalOpen, (newValue: boolean, oldValue: boolean) => {
    // 只有最後一個開啟的 會被更新
    if (oldValue && !newValue && lastActiveId.value === searchId) {
      emit('update:model-value', activeValue.value)
      emit('submit', activeValue.value)
      stopWatch()
    }
  }, { deep: false, immediate: false })
}

const stopWatch = () => {
  if (unwatch && typeof unwatch === 'function') {
    unwatch() // 取消監聽
    unwatch = null
  }
}

onUnmounted(() => {
  stopWatch()
})


/**
 * 開啟選擇資料個表格
 * 1. 設定 類型
 * 2. 設定 activeId
 * 3. 重置 activeValue
 */
const onSearchClick = () => {
  openWatch()
  emit('open')
  activeType.value = props.searchType
  activeId.value = searchId
  lastActiveId.value = searchId
  activeValue.value = props.modelValue

  modal_multiple.value = props.multiple
  modal_multipleLimit.value = props.multipleLimit
}

defineExpose({
  openModal: onSearchClick
})


</script>

<template>
  <div
    class="modal-select"
    :class="[
      searchId,
      searchId === activeId ? 'is-active': ''
    ]"
     @click.stop="onSearchClick"
    >
    <slot>
      <!-- 預設放大鏡樣式 -->
      <CustomIcon name="magnifying-glass" />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.modal-select {
  width: fit-content;
  height: fit-content;
  cursor: pointer;
  padding: 0 2px;
  border-radius: 50%;
  color: var(--el-color-primary);

  transition-duration: 0.3s;
  border: 1px solid #00000000;
  &.is-active {
    border: 1px solid var(--el-color-primary);
  }
}
</style>
