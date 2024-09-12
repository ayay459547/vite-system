<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, shallowRef, onMounted } from 'vue'

import type { EventOptions, EventItem } from '@/declare/hook'
import { CustomPopover } from '@/components'
import throttle from '@/lib/lib_throttle'

export declare namespace Types {
  type Placement =
    | 'top' | 'top-start' | 'top-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
    | 'right' | 'right-start' | 'right-end'
}

export declare namespace Props {
  type ClientX = number
  type ClientY = number
  type EventList = EventItem[]
  type Options = Record<string, any>
}

export declare namespace Emits {
  type Close = () => void
}

export declare namespace Expose {
  type OpenPopover = (
    clientX: number,
    clientY: number,
    eventList: EventItem[],
    options?: EventOptions
  ) => void
  type ClosePopover = () => void
}

const visible = ref<boolean>(false)
const placement = ref<Types.Placement>('bottom')
const left = ref<number>(0)
const top = ref<number>(0)

const callbackList = shallowRef<EventItem[]>([])
const popoverWidth = ref(150)

const props = defineProps({
  clientX: {
    type: Number as PropType<Props.ClientX>,
    default: 0
  },
  clientY: {
    type: Number as PropType<Props.ClientY>,
    default: 0
  },
  eventList: {
    type: Array as PropType<Props.EventList>,
    default: () => []
  },
  options: {
    type: Object as PropType<Props.Options>,
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

const openPopover: Expose.OpenPopover = (clientX, clientY, eventList, options) => {
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

  window.addEventListener('wheel', throttleClosePopover)
  window.addEventListener('resize', throttleClosePopover)

  setTimeout(() => {
    visible.value = true
  }, 100)
}

const closePopover: Expose.ClosePopover = () => {
  window.removeEventListener('wheel', throttleClosePopover)
  window.removeEventListener('resize', throttleClosePopover)

  if (visible.value) {
    visible.value = false
  }
}

const throttleClosePopover = throttle(closePopover, 0) as (payload: WheelEvent) => void

onMounted(() => {
  openPopover(props.clientX, props.clientY, props.eventList, props.options)
})

const deletePopover = () => {
  emit('close')
}

defineExpose({
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
          :class="{
            disabled: callbackItem.disabled,
            active: callbackItem.active
          }"
          @click="callEvent(callbackItem.event, callbackItem.disabled)"
          @touchstart="callEvent(callbackItem.event, callbackItem.disabled)"
        >
          <div style="width: fit-content">
            <FontAwesomeIcon
              v-if="callbackItem.icon.length > 0"
              :icon="callbackItem.icon"
              style="width: 24px"
            />
          </div>
          <span>{{ callbackItem.label }}</span>
        </li>
      </ul>
      <div v-else>empty</div>

      <template #reference>
        <div v-click-outside="deletePopover" class="popover-test" @click="visible = !visible"></div>
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
    z-index: var(--i-z-index-popover);
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

    transition-duration: 0.3s;
    color: var(--el-text-color-primary);
    background-color: var(--el-bg-color);

    &.active,
    &:hover {
      color: var(--el-menu-active-color);
      background-color: var(--el-color-info-light-9);
    }

    &.disabled {
      cursor: not-allowed;
      color: var(--el-text-color-disabled);
      background-color: var(--el-color-info-light-7);
    }
  }
}
</style>
