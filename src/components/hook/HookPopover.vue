<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, shallowRef, onMounted } from 'vue'

import type { EventOptions, EventItem } from '@/types/types_hook' // 全域功能類型
import { CustomPopover, CustomIcon } from '@/components/feature' // 系統組件
import { throttle } from '@/lib/lib_lodash'
import { isEmpty } from '@/lib/lib_utils'

export interface Types {
  placement:
    | 'top' | 'top-start' | 'top-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
    | 'right' | 'right-start' | 'right-end'
}

export interface Props {
  clientX: number
  clientY: number
  eventList: EventItem[]
  options: EventOptions
}

export interface Emits {
  Close: () => void
}

export interface Expose {
  openPopover: (
    clientX: number,
    clientY: number,
    eventList: EventItem[],
    options?: EventOptions
  ) => void
  closePopover: () => void
}

const visible = ref<boolean>(false)
const placement = ref<Types['placement']>('bottom')
const left = ref<number>(0)
const top = ref<number>(0)

const callbackList = shallowRef<EventItem[]>([])
const popoverWidth = ref(150)

const props = defineProps({
  clientX: {
    type: Number as PropType<Props['clientX']>,
    default: 0
  },
  clientY: {
    type: Number as PropType<Props['clientY']>,
    default: 0
  },
  eventList: {
    type: Array as PropType<Props['eventList']>,
    default: () => []
  },
  options: {
    type: Object as PropType<Props['options']>,
    default: () => {
      return { width: 150 }
    }
  }
})

const emit = defineEmits(['close'])

const iconAttr = (attr: any) => {
  if (Array.isArray(attr)) return { icon: attr }
  if (typeof attr === 'object') return { ...attr }
  return {}
}

const callEvent = (callback: ((...args: any[]) => any), disabled: boolean) => {
  if (typeof disabled === 'boolean' && disabled) return
  callback()
}

const openPopover: Expose['openPopover'] = (clientX, clientY, eventList, options) => {
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

  window.addEventListener('wheel', throttleClosePopover, { passive: true })
  window.addEventListener('resize', throttleClosePopover, { passive: true })

  setTimeout(() => {
    visible.value = true
  }, 100)
}

const closePopover: Expose['closePopover'] = () => {
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

defineExpose({ openPopover, closePopover })

</script>

<template>
  <div
    class="hook-event-container"
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
      <ul v-if="callbackList.length > 0" class="hook-event-list">
        <li
          v-for="(callbackItem, callbackIndex) in callbackList"
          class="hook-event-item"
          :key="callbackIndex"
          :class="[
            `${callbackItem?.class ?? ''}`,
            {
              disabled: callbackItem.disabled,
              active: callbackItem.active
            }
          ]"
          :id="callbackItem?.id ?? ''"
          @click="callEvent(callbackItem.event, callbackItem.disabled)"
          @touchstart="callEvent(callbackItem.event, callbackItem.disabled)"
        >
          <div style="width: fit-content">
            <CustomIcon
              v-if="!isEmpty(callbackItem.icon)"
              style="width: 24px"
              v-bind="iconAttr(callbackItem.icon)"
            />
          </div>
          <span>{{ callbackItem.label }}</span>
        </li>
      </ul>
      <div v-else>empty</div>

      <template #reference>
        <div
          v-on-click-outside="deletePopover"
          class="hook-event-test"
          @click="visible = !visible"
        ></div>
      </template>
    </CustomPopover>
  </div>
</template>

<style lang="scss" scoped>
.hook-event {
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
    font-size: 0.9em;
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
