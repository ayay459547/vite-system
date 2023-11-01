<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import type { WritableComputedRef, PropType } from 'vue'
import {
  ref,
  computed,
  watch,
  inject,
  effectScope,
  onMounted,
  onUnmounted,
  reactive,
  nextTick
} from 'vue'
import { CustomButton, CustomIcon } from '@/components'
import { useBoundingClientRect, getUuid } from '@/lib/lib_utils'
import throttle from '@/lib/lib_throttle'

export type WidthSize = 'fill' | 'large'| 'default'| 'small'
export type HeightSize = 'fill' | 'large'| 'default'| 'small'
export type ModelValue = boolean

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<ModelValue>,
    default: false,
    description: 'v-model 綁定是否顯示'
  },
  title: {
    type: String as PropType<string>,
    default: '',
    description: '標題'
  },
  clickOutside: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '點擊外面是否會關閉'
  },
  width: {
    type: String as PropType<string>,
    default: '',
    description: 'style width'
  },
  height: {
    type: String as PropType<string>,
    default: '',
    description: 'style height'
  },
  widthSize: {
    type: String as PropType<WidthSize>,
    default: 'default',
    description: '寬度尺寸類型'
  },
  heightSize: {
    type: String as PropType<HeightSize>,
    default: 'default',
    description: '高度尺寸類型'
  },
  modal: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: '是否需要遮罩'
  },
  autoClose: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: '是否點擊x 或 取消 自動關閉'
  },
  draggable: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否可拖拉'
  },
  hiddenFooter: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否隱藏footer'
  },
  hiddenSubmit: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否隱藏 確認按鈕'
  },
  hiddenCancel: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否隱藏 取消按鈕'
  }
})

const emit = defineEmits([
  'update:modelValue',
  'close',
  'cancel',
  'submit'
])

const scopedId = getUuid()
const wrapperIsShow = ref(false)
const containerIsShow = ref(false)

const tempValue: WritableComputedRef<ModelValue> = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => emit('update:modelValue', value)
})

const openModal = () => {
  wrapperIsShow.value = true

  if (props.draggable) {
    transform.x = '-50%'
    transform.y = '-50%'
  }

  setTimeout(() => {
    containerIsShow.value = true
  }, 100)

  // 等過場動畫結束
  setTimeout(async () => {
    await nextTick()
    if (props.draggable) {
      resetRect()
      resetMove()
      isFinishInit.value = true
    }
  }, 300)
}

const closeModal = () => {
  containerIsShow.value = false
  isFinishInit.value = false

  setTimeout(() => {
    wrapperIsShow.value = false
  }, 200)
}

const close = () => {
  if (props.autoClose) {
    tempValue.value = false
  }
  emit('close')
}

const cancel = () => {
  if (props.autoClose) {
    tempValue.value = false
  }
  emit('cancel')
}

const submit = () => {
  emit('submit')
}

const bindStyle = computed(() => {
  let resStyle = ''
  if (props.width.length > 0) {
    resStyle += `width: ${props.width};`
  }
  if (props.height.length > 0) {
    resStyle += `height: ${props.height};`
  }
  return resStyle
})

const scope = effectScope()

/**
 * 拖拉
 * 移動方式 transform
 * 單位 px
 **/

// 中心點
const centerRect = reactive({ x: 0, y: 0 })
// 邊界 移動超出退回
const limitRect = reactive({ x: 0, y: 0 })
const wrapperStyle = ref('')

// 移動多少
const move = reactive({
  // 移動過程中比對用 移動完後更新
  x: 0,
  y: 0,
  // 移動過程中 給最後的位置
  lastX: 0,
  lastY: 0
})
// 實際移動 style
const transform = reactive({
  x: '-50%',
  y: '-50%'
})

const containerRef = ref()
const isFinishInit = ref(false)

// 由於過場動畫
// 所以需要再重設: 中心的 transform 值 + 移動的邊界值
const resetRect = () => {
  const contentRect = containerRef.value.getBoundingClientRect()
  const { width, height } = contentRect
  const [ centerX, cneterY ] = [ width / 2, height / 2 ]

  setCenter(centerX, cneterY)

  const [ windowWidth, windowHeight ] = [ window.innerWidth, window.innerHeight ]
  setLimit(windowWidth / 2 - centerX / 2, windowHeight / 2 - cneterY / 2)
}
const setCenter = (x: number, y: number) => {
  centerRect.x = x
  centerRect.y = y
}
const setLimit = (x: number, y: number) => {
  limitRect.x = x
  limitRect.y = y
}
const resetMove = () => {
  move.x = 0
  move.y = 0
  move.lastX = 0
  move.lastY = 0
}

// 視窗大小變化時 位置重設
useBoundingClientRect(containerRef, () => {
  if (!isFinishInit.value || !props.draggable) return
  resetRect()
  resetMove()
})

const mousedownClient = reactive({
  clientX: 0,
  clientY: 0
})
const updateTransform = (e: MouseEvent) => {
  const {
    clientX: mouseDownX,
    clientY: mouseDownY
  } = mousedownClient

  const {
    clientX: mouseMoveX,
    clientY: mouseMoveY
  } = e

  const _moveX = mouseMoveX - mouseDownX
  const _moveY = mouseMoveY - mouseDownY

  const { x: centerX, y: centerY } = centerRect

  const { x: moveX, y: moveY } = move

  const [ newMoveX, newMoveY ] = [ _moveX + moveX, _moveY + moveY ]

  // 舊的位移要加回來
  transform.x = `${-(centerX - newMoveX)}px`
  transform.y = `${-(centerY - newMoveY)}px`

  // 移動後 設定已經移動的值
  move.lastX = newMoveX
  move.lastY = newMoveY

  e.stopPropagation()
  e.preventDefault()
}
const throttleUpdateTransform = throttle(updateTransform, 1) as typeof updateTransform

const mouseupEvent = () => {
  const { x: centerX, y: centerY } = centerRect
  // 有超出邊界
  if (
    move.lastX < -limitRect.x ||
    move.lastX > limitRect.x ||
    move.lastY < -limitRect.y ||
    move.lastY > limitRect.y
  ) {
    wrapperStyle.value = 'transition-duration: 0.2s;'

    // x軸邊界修正
  if (move.lastX < -limitRect.x) {
    move.x = -limitRect.x
    transform.x = `${-(centerX - (-limitRect.x))}px`
  } else if (move.lastX > limitRect.x) {
    move.x = limitRect.x
    transform.x = `${-(centerX - limitRect.x)}px`
  } else {
    move.x = move.lastX
  }

  // y軸邊界修正
  if (move.lastY < -limitRect.y) {
    move.y = -limitRect.y
    transform.y = `${-(centerY - (-limitRect.y))}px`
  } else if (move.lastY > limitRect.y) {
    move.y = limitRect.y
    transform.y = `${-(centerY - limitRect.y)}px`
  } else {
    move.y = move.lastY
  }
  move.lastY = move.y

  setTimeout(() => {
    wrapperStyle.value = ''
  }, 250)

  } else {
    wrapperStyle.value = ''

    move.x = move.lastX
    move.y = move.lastY
  }

  // 修正最後更新值
  if (move.lastX !== move.x) {
    move.lastX = move.x
  }
  if (move.lastY !== move.y) {
    move.lastY = move.y
  }
  window.removeEventListener('mousemove', throttleUpdateTransform)
}

const addEvent = ($event: MouseEvent) => {
  if (!props.draggable) return
  resetRect()

  const { clientX, clientY } = $event
  mousedownClient.clientX = clientX
  mousedownClient.clientY = clientY

  window.addEventListener('mousemove', throttleUpdateTransform)
  window.addEventListener('mouseup', mouseupEvent)
}

const removeEvent = () => {
  setTimeout(() => {
    window.removeEventListener('mouseup', mouseupEvent)
  }, 0)
}

const clickOutside = () => {
  removeEvent()

  if (!props.clickOutside) return

  if (wrapperIsShow.value && containerIsShow.value) {
    tempValue.value = false
  }
}

onMounted(() => {
  scope.run(() => {
    watch(tempValue, (newValue) => {
      if (newValue) {
        openModal()
      } else {
        removeEvent()
        closeModal()
      }
    })
  })
})

onUnmounted(() => {
  scope.stop()
})

</script>

<template>
  <div
    v-show="wrapperIsShow"
    class="modal-mask"
    :class="containerIsShow ? 'is-show': 'is-close'"
    :style="props.modal ? 'display: block;' : 'display: contents;'"
  >
    <div
      class="modal-wrapper"
      :class="[
        `width-${props.widthSize}`,
        `height-${props.heightSize}`
      ]"
      :style="`
        transform: translateX(${transform.x}) translateY(${transform.y});
        ${wrapperStyle};
        user-select:none;
        ${bindStyle};
      `"
      v-click-outside="clickOutside"
    >
      <Transition name="modal">
        <div
          ref="containerRef"
          v-show="containerIsShow"
          class="modal-container"
          :class="`__modal__${scopedId}`"
        >
          <div class="modal-header">
            <div
              v-if="props.draggable"
              class="modal-draggable"
              @mousedown="addEvent"
            >
              <CustomIcon name="up-down-left-right"/>
              <slot name="header">
                <h3>{{ props.title }}</h3>
              </slot>
            </div>

            <slot v-else name="header">
              <h3>{{ props.title }}</h3>
            </slot>

            <CustomButton
              icon-name="close"
              text
              @click="close"
            />
          </div>

          <div class="modal-body">
            <div v-if="tempValue" style="width: 100%; height: 100%">
              <slot>Body</slot>
            </div>
          </div>

          <div v-if="!props.hiddenFooter" class="modal-footer">
            <slot name="footer">
              <div
                v-if="props.draggable"
                class="modal-footer-draggable"
                @mousedown="addEvent"
              ></div>

              <div class="modal-footer-btn">
                <CustomButton
                  v-if="!props.hiddenCancel"
                  :label="i18nTranslate('cancel')"
                  icon-name="angle-left"
                  icon-move="translate"
                  @click="cancel"
                />
                <CustomButton
                  v-if="!props.hiddenSubmit"
                  type="success"
                  :label="i18nTranslate('confirm')"
                  icon-name="check"
                  icon-move="scale"
                  @click="submit"
                />
              </div>
            </slot>
          </div>
          <div v-else class="modal-footer-hidden">
            <div
              v-if="props.draggable"
              class="modal-footer-draggable"
              @mousedown="addEvent"
            ></div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.modal {
  &-mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: $modal-index;
    left: 0;
    top: 0;
    transform: none;

    transition-duration: 0.3s;
    &.is-close {
      background-color: #00000000;
    }
    &.is-show {
      background-color: #00000066;
    }
  }

  &-wrapper {
    position: fixed;
    z-index: $modal-index;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    &.width {
      &-fill {
        width: 100%;
      }
      &-large {
        width: 85%;
        @media (max-width: 992px) {
          width: 90%;
        }
        @media (max-width: 576px) {
          width: 95%;
        }
      }
      &-default {
        width: 65%;
        @media (max-width: 992px) {
          width: 70%;
        }
        @media (max-width: 576px) {
          width: 90%;
        }
      }
      &-small {
        width: 650px;
        @media (max-width: 992px) {
          width: 65%;
        }
        @media (max-width: 576px) {
          width: 85%;
        }
      }
    }
    &.height {
      &-fill {
        height: 100%;
      }
      &-large {
        height: 85%;
      }
      &-default {
        height: 65%;
      }
      &-small {
        height: 500px;
      }

      &-large,
      &-default,
      &-small {
        @media (max-height: 576px) {
          height: 90%;
        }
      }
    }
  }

  &-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    box-shadow: 2px 2px 8px 1px #d6d6d6;
    transition-duration: 0.3s;
    min-width: 400px;
    min-height: 300px;
    border-radius: 6px;
  }

  &-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    height: 40px;
    border-bottom: 1px solid #d6d6d6;
  }
  &-draggable {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 4px;
    cursor: pointer;
  }

  &-body {
    width: 100%;
    flex: 1;
    overflow: auto;
  }

  &-footer {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 8px;
    border-top: 1px solid #d6d6d6;

    &-hidden {
      width: 100%;
      height: 24px;
      border-top: 1px solid #d6d6d6;
    }

    &-btn {
      display: flex;
      gap: 12px;
    }

    &-draggable {
      width: 100%;
      height: 100%;
      flex: 1;
      cursor: pointer;
    }
  }
}
</style>