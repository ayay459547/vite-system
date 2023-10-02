<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, shallowRef, onMounted } from 'vue'

import type { EventOptions, EventItem } from '@/declare/hook'
import { CustomPopover } from '@/components'

import throttle from '@/lib/lib_throttle'

type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'

const visible = ref<boolean>(false)
const placement = ref<Placement>('bottom')
const left = ref<number>(0)
const top = ref<number>(0)

const callbackList = shallowRef<EventItem[]>([])
const popoverWidth = ref(150)

const props = defineProps({
  clientX: {
    type: Number as PropType<number>,
    default: 0
  },
  clientY: {
    type: Number as PropType<number>,
    default: 0
  },
  eventList: {
    type: Array as PropType<EventItem[]>,
    default: () => []
  },
  options: {
    type: Object as PropType<Record<string, any>>,
    default: () => {
      return { width: 150 }
    }
  }
})

const emit = defineEmits(['close'])

const callEvent = (callback: Function, disabled: boolean) => {
  if (typeof disabled === 'boolean' && disabled) return

  callback()
}

type OpenPopover = (
  clientX: number,
  clientY: number,
  eventList: EventItem[],
  options?: EventOptions
) => void

const openPopover: OpenPopover = (clientX, clientY, eventList, options) => {
  if (visible.value) return
  left.value = clientX
  top.value = clientY + 10

  if (eventList) {
    callbackList.value = eventList
  }

  if (options?.width > 0) {
    popoverWidth.value = options.width
  } else {
    popoverWidth.value = 150
  }

  window.addEventListener('wheel', throttleOnWheelChange)

  setTimeout(() => {
    visible.value = true
  }, 100)
}

const closePopover = () => {
  window.removeEventListener('wheel', throttleOnWheelChange)

  if (visible.value) {
    visible.value = false
  }
}

const throttleOnWheelChange = throttle(closePopover, 0) as (payload: WheelEvent) => void

onMounted(() => {
  openPopover(
    props.clientX,
    props.clientY,
    props.eventList,
    props.options
  )
})

interface Expose {
  openPopover: OpenPopover
  closePopover: () => void
}

const deletePopover = () => {
  emit('close')
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
    <CustomPopover
      :visible="visible"
      :placement="placement"
      :width="popoverWidth"
      popper-style="padding: 0;"
    >
      <ul v-if="callbackList.length > 0" class="popover-list">
        <li
          v-for="(callbackItem, callbackIndex) in callbackList"
          class="popover-item"
          :key="callbackIndex"
          :class="callbackItem.disabled ? 'disabled' : ''"
          @click="callEvent(callbackItem.event, callbackItem.disabled)"
        >
          <div style="width: fit-content">
            <font-awesome-icon
              v-if="callbackItem.icon.length > 0"
              :icon="callbackItem.icon"
              style="width: 24px;"
            />
          </div>
          <span>{{ callbackItem.label }}</span>
        </li>
      </ul>
      <div v-else>empty</div>

      <template #reference>
        <div
          v-click-outside="deletePopover"
          class="popover-test"
          @click="visible = !visible"
        ></div>
      </template>
    </CustomPopover>
  </div>
</template>

<style lang="scss" scoped>
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
    padding: 12px 8px;
    // height: 24px;
    // line-height: 24px;
    display: flex;
    gap: 12px;
    font-size: 1.1em;
    align-items: center;
    cursor: pointer;

    color: inherit;
    background-color: inherit;
    transition-duration: 0.3s;

    &:hover {
      color: #409EFF;
      background-color: #f5f7fa;
    }

    &.disabled {
      cursor: not-allowed;
      color: #999999;
      background-color: #eeeeee;
    }
  }
}
</style>