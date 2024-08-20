<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

import { CustomIcon, CustomScrollbar } from '@/components'
import { useBoundingClientRect } from '@/lib/lib_hook'
import { getUuid, isEmpty } from '@/lib/lib_utils'
import throttle from '@/lib/lib_throttle'

import type { Props } from './CustomDividerViewInfo'
import { version, props as dividerViewProps } from './CustomDividerViewInfo'

const scopedName = '__i-divider-view__'
const scopedId = getUuid(scopedName)

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
let reSizeEvent = ($event: MouseEvent) => {
  console.log($event)
}
let beforeMoveWidth = 0
const onDraggableMousedown = ($event: MouseEvent) => {
  if (isEmpty(containerRef.value) || isMove.value) return

  const { clientX: mouseDownX } = $event
  beforeMoveWidth = defaultWidth.custom

  // 滑鼠移動時執行
  const throttleMousemoveEvent = throttle<typeof reSizeEvent>(function ($event: MouseEvent) {
    const { clientX: mouseMoveX } = $event
    // 變化高度
    const _moveX = mouseMoveX - mouseDownX
    currentLeftWidth.value = beforeMoveWidth + _moveX
  }, 16, { isNoLeading: true })

  reSizeEvent = throttleMousemoveEvent
  containerRef.value.addEventListener('mousemove', reSizeEvent)

  draggablePosition.value = 'custom'
  isMove.value = true
}
// 取消監聽事件
const removeEvent = () => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', reSizeEvent)
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
useBoundingClientRect(containerRef, ({ width }) => {
  setDefaultWidth(width)
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
    :class="[
      `CustomDividerView_${version}`,
      scopedId,
      scopedName,
      isMove ? 'is-move' : ''
    ]"
    @mouseup.stop="removeEvent"
    @mouseleave.stop="removeEvent"
    v-click-outside="removeEvent"
  >
    <!-- 左邊 -->
    <div
      v-show="draggablePosition !== 'left'"
      class="divider-view-left"
      :class="{ 'is-move': isMove }"
      :style="{ width: currentLeftWidth }"
    >
      <CustomScrollbar>
        <slot name="left"></slot>
      </CustomScrollbar>
    </div>
    <!-- 拖拉變更兩邊大小 -->
    <div
      class="divider-view-draggable"
      @mousedown="onDraggableMousedown"
      @dblclick="onDraggableDblclick"
    >
      <div class="divider-view-btn" @mousedown.stop>
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
        <slot name="right"></slot>
      </CustomScrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$draggable-btn-width: 38px;

.__i-divider-view__ {
  &.divider-view {
    &-container {
      width: 100%;
      height: 100%;
      display: flex;
      background-color: inherit;

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

      &:hover {
        cursor: col-resize;

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
