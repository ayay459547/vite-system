<script setup lang="ts">
import { ref } from 'vue'
import { ElPopover } from 'element-plus'
import type { EventItem } from '@/declare/hook'
import { HookList } from '@/declare/hook'
import debounce from '@/lib/debounce'

type Placemetn = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'

const visible = ref<boolean>(false)
const placement = ref<Placemetn>('bottom')
const left = ref<number>(0)
const top = ref<number>(0)

const callbackList = ref<EventItem[]>([])
const popoverWidth = ref(150)

const calcPlacement = () => {
  console.log('calcPlacement')
}
const resetPlacement = () => {
  console.log('resetPlacement')
  placement.value = 'bottom'
  callbackList.value = []
  popoverWidth.value = 150
}

const callEvent = (callback: Function) => {
  callback()
}
const debounceCallEvent = debounce(callEvent, 200)

const openPopover: HookList.eventList = (click, eventList, options) => {
  if (visible.value) return

  const { clientX, clientY } = click
  left.value = clientX
  top.value = clientY

  if (eventList) {
    callbackList.value = eventList
  }

  if (options?.width > 0) {
    popoverWidth.value = options.width
  }

  setTimeout(() => {
    visible.value = true
  }, 100)
}

const closePopover = () => {
  if (visible.value) {
    visible.value = false
  }
}

interface Expose {
  openPopover:  HookList.eventList
  closePopover: () => void
}

defineExpose<Expose>({
  openPopover,
  closePopover
})

</script>

<template>
  <div
    class="popover-container"
    :style="{
      left: left + 'px',
      top: top + 'px'
    }"
  >
    <ElPopover
      :visible="visible"
      :placement="placement"
      :before-enter="calcPlacement"
      :after-leave="resetPlacement"
      :width="popoverWidth"
    >
      <ul v-if="callbackList.length > 0" class="popover-list">
        <li
          v-for="(callbackItem, callbackIndex) in callbackList"
          class="popover-item"
          :key="callbackIndex"
          @click="debounceCallEvent(callbackItem.event)"
        >
          <font-awesome-icon v-if="callbackItem.icon.length > 0" :icon="callbackItem.icon" />
          <span>{{ callbackItem.label }}</span>
        </li>
      </ul>
      <div v-else>empty</div>

      <template #reference>
        <div
          v-click-outside="closePopover"
          class="popover-test"
          @click="visible = !visible"
        ></div>
      </template>
    </ElPopover>
  </div>
</template>

<style lang="scss" scoped>
:deep(.popover-container) {
  .el-popover {
    padding: 0;
  }
}
.popover {
  &-container {
    width: fit-content;
    height: fit-content;
    position: fixed;
    z-index: $popover-index;
  }
  &-list {
    height: fit-content;
  }
  &-item {
    padding: 4px 16px;
    height: 24px;
    line-height: 24px;
    display: flex;
    gap: 16px;
    font-size: 1em;
    align-items: center;
    cursor: pointer;

    color: inherit;
    background-color: inherit;
    transition-duration: 0.3s;

    &:hover {
      color: #409EFF;
      background-color: #f5f7fa;
    }
  }
}
</style>