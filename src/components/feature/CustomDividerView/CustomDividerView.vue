<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'

import { CustomIcon, CustomScrollbar } from '@/components' // 系統組件
import { useResizeObserver } from '@/lib/lib_hook' // 自訂Composition API
import { getUuid, isEmpty } from '@/lib/lib_utils' // 工具
import throttle from '@/lib/lib_throttle'

import type { Props, Emits, Expose } from './CustomDividerViewInfo'
import { version, props as dividerViewProps } from './CustomDividerViewInfo'

const scopedId = getUuid(version)

const props = defineProps(dividerViewProps)

const draggableWidth = 10
const draggableWidthStyle = `${draggableWidth}px`

// 外框
const containerRef = ref()

// 目前拖拉的位置
const draggablePosition = ref<Props.DraggablePosition>('center')

// 是否是拖拉中
const isMove = ref(false)

// 監聽移動改變大小
let reSizeEvent = ($event: Event) => {
  console.log($event)
}

let beforeMoveWidth = 0
const getClientInfo = ($event: MouseEvent | TouchEvent): MouseEvent | Touch => {
  switch ($event.type) {
    // 使用觸控
    case 'touchstart':
    case 'touchmove': {
      const event = $event as TouchEvent
      return event.changedTouches[0]
    }
    // 使用滑鼠
    case 'mousedown':
    case 'mousemove':
    default: {
      return $event as MouseEvent
    }
  }
}
const onDraggableMousedown = ($event: MouseEvent | TouchEvent) => {
  if (isEmpty(containerRef.value) || isMove.value) return

  const clientInfo = getClientInfo($event)
  const { clientX: mouseDownX } = clientInfo
  beforeMoveWidth = defaultWidth.custom

  // 滑鼠移動時執行
  const throttleMousemoveEvent = throttle<typeof reSizeEvent>(function ($moveEvent: MouseEvent | TouchEvent) {
    const moveClientInfo = getClientInfo($moveEvent)
    const { clientX: mouseMoveX } = moveClientInfo
    // 變化高度
    const _moveX = mouseMoveX - mouseDownX
    currentLeftWidth.value = beforeMoveWidth + _moveX
  }, 24, { isNoLeading: true })

  reSizeEvent = throttleMousemoveEvent

  switch ($event.type) {
    case 'mousedown':
      containerRef.value.addEventListener('mousemove', reSizeEvent)
      break
    case 'touchstart':
      $event.preventDefault()
      containerRef.value.addEventListener('touchmove', reSizeEvent, { passive: false })
      break
  }

  draggablePosition.value = 'custom'
  isMove.value = true
}

const emit = defineEmits(['change'])
const onChange: Emits.Change = async () => {
  await nextTick()
  emit('change', defaultWidth.custom)
}

// 取消監聽事件
const removeEvent = () => {
  if (containerRef.value && isMove.value) {
    containerRef.value.removeEventListener('mousemove', reSizeEvent)

    if (draggablePosition.value === 'custom') {
      onChange()
    }
  }
  isMove.value = false
}

// 回復預設值
const onDraggableDblclick = () => {
  defaultWidth.custom = defaultWidth.center
  draggablePosition.value = 'center'
}

const onLeftClick = () => {
  switch (draggablePosition.value) {
    case 'custom':
    case 'center':
      defaultWidth.custom = defaultWidth.left
      draggablePosition.value = 'left'
      break
    case 'right':
      defaultWidth.custom = defaultWidth.center
      draggablePosition.value = 'center'
      break
  }
}

const onRightClick = () => {
  switch (draggablePosition.value) {
    case 'left':
      defaultWidth.custom = defaultWidth.center
      draggablePosition.value = 'center'
      break
    case 'custom':
    case 'center':
      defaultWidth.custom = defaultWidth.right
      draggablePosition.value = 'right'
      break
  }
}

/**
 * 右邊是 flex 彈性
 * 左邊是 px 設定固定值
 * 透過拖拉改變
 **/
const defaultWidth = reactive({
  left: 0,
  center: 0,
  right: 0,
  custom: 0
})
const currentLeftWidth = computed<any>({
  get () {
    switch (draggablePosition.value) {
      case 'left':
        return `${defaultWidth.left}px`
      case 'center':
        return `${defaultWidth.center}px`
      case 'right':
        return `${defaultWidth.right}px`
      case 'custom':
      default:
        return `${defaultWidth.custom}px`
    }
  },
  set (v: number) {
    defaultWidth.custom = v
  }
})

// 重設定中心寬度
const initDefaultCenter: Expose.InitDefaultCenter = () => {
  if (typeof props.leftWidth === 'number' && props.leftWidth > 0) {
    defaultWidth.center = props.leftWidth
  }
}
defineExpose({
  initDefaultCenter
})

// 設定預設寬度
const setDefaultWidth = (width: number) => {
  // 全部寬 - 拖拉寬 - (border 1px * 2)
  const fullWidth = (width - draggableWidth - 2)

  if (typeof props.leftWidth === 'number' && props.leftWidth > 0) {
    defaultWidth.center = props.leftWidth
  } else {
    defaultWidth.center = fullWidth / 2
  }
  defaultWidth.left = 0
  defaultWidth.right = fullWidth
}
useResizeObserver(containerRef, entries => {
  const entry = entries[0]

  setDefaultWidth(entry.contentRect.width)
  switch (draggablePosition.value) {
    case 'left':
      defaultWidth.custom = defaultWidth.left
      break
    case 'center':
      defaultWidth.custom = defaultWidth.center
      break
    case 'right':
      defaultWidth.custom = defaultWidth.right
      break
  }
})

onMounted(() => {
  draggablePosition.value = props.position
})

</script>

<template>
  <div
    ref="containerRef"
    class="divider-view-container"
    :class="[scopedId, isMove ? 'is-move' : '']"
    @mouseup="removeEvent"
    @touchend="removeEvent"
    @touchcancel="removeEvent"
    v-on-click-outside="removeEvent"
  >
    <!-- 左邊 -->
    <div
      v-show="draggablePosition !== 'left'"
      class="divider-view-left"
      :class="{ 'is-move': isMove }"
      :style="{ width: currentLeftWidth }"
    >
      <CustomScrollbar>
        <KeepAlive :max="1">
          <slot name="left"></slot>
        </KeepAlive>
      </CustomScrollbar>
    </div>
    <!-- 拖拉變更兩邊大小 -->
    <div
      class="divider-view-draggable"
      @mousedown.stop.self="onDraggableMousedown"
      @touchstart.stop.self="onDraggableMousedown"
      @dblclick.stop.self="onDraggableDblclick"
    >
      <div
        class="divider-view-btn"
        @mousedown.stop
        @touchstart.stop
      >
        <div class="left-icon" @click.stop="onLeftClick">
          <CustomIcon name="chevron-left" />
        </div>
        <div class="right-icon" @click.stop="onRightClick">
          <CustomIcon name="chevron-right"/>
        </div>
      </div>
    </div>
    <!-- 右邊 -->
    <div
      v-show="draggablePosition !== 'right'"
      class="divider-view-right"
      :class="{ 'is-move': isMove }"
    >
      <CustomScrollbar>
        <KeepAlive :max="1">
          <slot name="right"></slot>
        </KeepAlive>
      </CustomScrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$draggable-btn-width: 38px;

div[class*="__CustomDividerView"] {
  &.divider-view {
    &-container {
      width: 100%;
      height: 100%;
      display: flex;
      background-color: inherit;
      // background-color: var(--el-bg-color);
      // border: 1px solid var(--el-color-info-light-8);

      &.is-move {
        cursor: col-resize;
      }
    }
  }
  .divider-view {
    &-draggable {
      width: v-bind(draggableWidthStyle);
      height: 100%;
      background-color: var(--el-color-info-light-9);
      position: relative;
      border-radius: 6px;
      transition-duration: 0.2s;

      &:hover {
        cursor: col-resize;
        box-shadow: 0px 0px 8px 1px var(--el-color-info-light-3);
        & > .divider-view-btn {
          opacity: 1;
        }
      }
    }
    &-btn {
      transition: 0.2s opacity;
      opacity: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      z-index: 7;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -100%);

      width: $draggable-btn-width;
      height: $draggable-btn-width;
      border-radius: 50%;
      background-color: var(--el-color-info-light-9);
      cursor: pointer;

      .left-icon,
      .right-icon {
        flex: 1;
        width: 100%;
        height: $draggable-btn-width;
        padding: 2px 1px;
        color: var(--el-color-info-light-5);
        transition: 0.1s color;
        display: flex;
        align-items: center;
        &:hover {
          color: var(--el-color-primary);
        }
      }
      .left-icon {
        justify-content: flex-end;
      }
      .right-icon {
        justify-content: flex-start;
      }
    }

    &-left,
    &-right {
      width: 100%;
      height: 100%;
      overflow: auto;
      // transition: 0.1s;
      &.is-move {
        pointer-events: none;
        user-select: none;
      }

      :deep(.el-scrollbar__view) {
        width: 100%;
        height: 100%;
      }
    }
    &-right {
      flex: 1;
    }
  }
}
</style>
