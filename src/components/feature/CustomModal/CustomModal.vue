<script setup lang="ts">
import {
  ref,
  inject,
  computed,
  watch,
  effectScope,
  onBeforeMount,
  onMounted,
  onUnmounted,
  reactive,
  nextTick
} from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook, SwalResult } from '@/declare/hook'
import { useResizeObserver } from '@/lib/lib_hook' // 自訂Composition API
import { CustomButton, CustomTooltip } from '@/components' // 系統組件
import { getUuid } from '@/lib/lib_utils' // 工具
import throttle from '@/lib/lib_throttle'
import debounce from '@/lib/lib_debounce'
import { useCustomModalStore } from '@/stores/stores_CustomModal'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props } from './CustomModalInfo'
import { version, props as modalProps, minModalIndex } from './CustomModalInfo'

const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const scopedId = getUuid(version)

const props = defineProps(modalProps)

const emit = defineEmits(['update:modelValue', 'close', 'cancel', 'submit'])

const tempValue = computed<Props.ModelValue>({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => emit('update:modelValue', value)
})

// 正在使用中的 modal 會被至頂
// 如果有多個 modal 可以一次關閉全部
const customModalStore = useCustomModalStore()
const { modalIndexMap, modalCount } = storeToRefs(customModalStore)
const modalZIndex = computed(() => {
  const tempIndex = modalIndexMap?.value[scopedId] ?? 0
  return tempIndex + minModalIndex
})
const setModalIndex = () => {
  customModalStore.setModalIndex(scopedId)
}
const removeModalIndex = () => {
  customModalStore.removeModalIndex(scopedId)
}

// 關閉全部的 modal
const isCloseAllModal = computed(() => {
  if (tempValue.value && modalCount.value <= 0) {
    onClose('close')
  }

  return modalCount.value >= 2
})

const wrapperIsShow = ref(false)
const containerIsShow = ref(false)

// 是否佔全螢幕
const isFill = ref(props.widthSize === 'fill' && props.heightSize === 'fill')
const setFill = async (newFill: boolean) => {
  isCollapse.value = false
  isFill.value = newFill

  await nextTick()
  setCenterAndLimit()
  resetMove()
}

// 是否縮起來
const isCollapse = ref(false)
const setCollapse = async (newCollapse: boolean) => {
  isFill.value = false
  isCollapse.value = newCollapse

  await nextTick()
  setCenterAndLimit()
  resetMove('start', 'bottom')
}

// header 點兩下切換顯示
const onHeaderDoubleClick = () => {
  if (isCollapse.value) {
    setFill(false)
  } else {
    setFill(!isFill.value)
  }
}

// 開啟彈窗
const openModal = () => {
  wrapperIsShow.value = true

  transform.x = '-50%'
  transform.y = '-50%'

  setTimeout(() => {
    containerIsShow.value = true
  }, 16)

  // 等過場動畫結束
  isCollapse.value = false
  setTimeout(() => {
    setFill(isFill.value)
  }, 480)

  setTimeout(() => {
    isFinishInit.value = true
  }, 560)
}

const closeModal = () => {
  removeModalIndex()
  containerIsShow.value = false
  isFinishInit.value = false

  removeEvent()
  setTimeout(() => {
    wrapperIsShow.value = false
  }, 240)
}

const onClose = async (emitEvent: string) => {
  await nextTick()
  if (props.autoClose) {
    tempValue.value = false
  }

  switch (emitEvent) {
    case 'close':
    case 'cancel':
      emit(emitEvent)
      break
  }
}

const submit = () => {
  emit('submit')
}

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

const modalTransitionDuration = ref('0s')

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
const setCenterAndLimit = () => {
  const contentRect = containerRef.value.getBoundingClientRect()
  const [centerX, cneterY] = [contentRect.width / 2, contentRect.height / 2]

  centerRect.x = centerX
  centerRect.y = cneterY

  // 確保 modal 全顯示
  const [windowWidth, windowHeight] = [window.innerWidth, window.innerHeight]
  limitRect.x = windowWidth / 2 - centerX
  limitRect.y = windowHeight / 2 - cneterY
}

const resetMove = async (xPosition?: Props.XPosition, yPosition?: Props.YPosition) => {
  await nextTick()

  const { x: centerX, y: centerY } = centerRect

  const limitRect = {
    x: window.innerWidth / 2 - centerX,
    y: window.innerHeight / 2 - centerY
  }

  switch (xPosition ?? props.xPosition) {
    case 'center':
      move.x = 0
      transform.x = '-50%'
      break
    case 'start':
      move.x = -limitRect.x
      transform.x = `${-(centerX - -limitRect.x)}px`
      break
    case 'end':
      move.x = limitRect.x
      transform.x = `${-(centerX - limitRect.x)}px`
      break
  }

  switch (yPosition ?? props.yPosition) {
    case 'center':
      move.y = 0
      transform.y = '-50%'
      break
    case 'top':
      move.y = -limitRect.y
      transform.y = `${-(centerY - -limitRect.y)}px`
      break
    case 'bottom':
      move.y = limitRect.y
      transform.y = `${-(centerY - limitRect.y)}px`
      break
  }

  move.lastX = move.x
  move.lastY = move.y
}

const mousedownClient = reactive({
  clientX: 0,
  clientY: 0
})
const updateTransform = (e: MouseEvent) => {
  const { clientX: mouseDownX, clientY: mouseDownY } = mousedownClient

  const { clientX: mouseMoveX, clientY: mouseMoveY } = e

  const _moveX = mouseMoveX - mouseDownX
  const _moveY = mouseMoveY - mouseDownY

  const { x: centerX, y: centerY } = centerRect

  const { x: moveX, y: moveY } = move

  const [newMoveX, newMoveY] = [_moveX + moveX, _moveY + moveY]

  // 舊的位移要加回來
  transform.x = `${-(centerX - newMoveX)}px`
  transform.y = `${-(centerY - newMoveY)}px`

  // 移動後 設定已經移動的值
  move.lastX = newMoveX
  move.lastY = newMoveY

  e.stopPropagation()
  e.preventDefault()
}
const throttleUpdateTransform = throttle(updateTransform, 8, { isNoTrailing: true }) as typeof updateTransform

// 確認是否超出螢幕 要重設位置
const fixModalOutSide = async () => {
  await nextTick()
  const contentRect = containerRef.value.getBoundingClientRect()
  const { x, y, width, height } = contentRect
  const [windowWidth, windowHeight] = [window.innerWidth, window.innerHeight]

  if (x < -width || x > windowWidth || y < -height || y > windowHeight) {
    setCenterAndLimit()
    resetMove()
  }
}
const debounceFixModalOutSide = debounce(fixModalOutSide, 2400) as typeof fixModalOutSide

// 視窗大小變化時 位置重設
useResizeObserver(containerRef, () => {
  if (tempValue.value) {
    debounceFixModalOutSide()
  }
})

const onMouseUp = () => {
  const { x: centerX, y: centerY } = centerRect
  // 有超出邊界
  if (
    move.lastX < -limitRect.x ||
    move.lastX > limitRect.x ||
    move.lastY < -limitRect.y ||
    move.lastY > limitRect.y
  ) {
    modalTransitionDuration.value = '0.2s'

    // x軸邊界修正
    if (move.lastX < -limitRect.x) {
      move.x = -limitRect.x
      transform.x = `${-(centerX - -limitRect.x)}px`
    } else if (move.lastX > limitRect.x) {
      move.x = limitRect.x
      transform.x = `${-(centerX - limitRect.x)}px`
    } else {
      move.x = move.lastX
    }

    // y軸邊界修正
    if (move.lastY < -limitRect.y) {
      move.y = -limitRect.y
      transform.y = `${-(centerY - -limitRect.y)}px`
    } else if (move.lastY > limitRect.y) {
      move.y = limitRect.y
      transform.y = `${-(centerY - limitRect.y)}px`
    } else {
      move.y = move.lastY
    }

    setTimeout(() => {
      modalTransitionDuration.value = '0s'
    }, 240)
  } else {
    modalTransitionDuration.value = '0s'

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
  removeEvent()

  // 有時超出銀幕
  debounceFixModalOutSide()

  if (!props.draggable) return
  isDraggable.value = false
}

// 新增拖拉用事件
const isDraggable = ref(false)
const onMouseDown = ($event: MouseEvent) => {
  if (!props.draggable) return
  isDraggable.value = true
  setCenterAndLimit()

  mousedownClient.clientX = $event.clientX
  mousedownClient.clientY = $event.clientY

  window.addEventListener('mousemove', throttleUpdateTransform)
  window.addEventListener('mouseup', onMouseUp)
}

const clickOutside = () => {
  if (props.clickOutside && containerIsShow.value) {
    setTimeout(() => {
      tempValue.value = false
    }, 320)
  }
}

// 移除事件
const removeEvent = () => {
  window.removeEventListener('mousemove', throttleUpdateTransform)
  window.removeEventListener('mouseup', onMouseUp)
}

const onCloseAllClick = () => {
  swal({
    title: i18nTranslate('closeAll-confirm', defaultModuleType),
    icon: 'question'
  }).then(async (result: SwalResult) => {
    if (result.isConfirmed) {
      customModalStore.clearModal()
    }
  })
}

onBeforeMount(() => {
  // 如果一開始 綁定的值是 true 先設定 index
  if (props.modelValue) {
    setModalIndex()
  }
})

onMounted(() => {
  scope.run(() => {
    watch(tempValue, (newValue: boolean) => {
      if (newValue) {
        setModalIndex()

        setTimeout(() => { openModal() }, 0)
      } else {
        setTimeout(() => { closeModal() }, 0)
      }
    }, { deep: false, immediate: true })
  })
})

onUnmounted(() => {
  tempValue.value = false
  setTimeout(() => { scope.stop() }, 0)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-show="wrapperIsShow"
      class="modal-mask"
      :class="[
        scopedId,
        containerIsShow ? 'is-show' : 'is-hidden',
        props.modal ? 'is-modal' : '',
        isDraggable ? 'is-draggable user-select-none' : ''
      ]"
      :style="{ 'z-index': modalZIndex }"
    >
      <div
        class="modal-wrapper"
        :class="[
          `width-${props.widthSize}`,
          `height-${props.heightSize}`,
          isFill ? 'width-isFill height-isFill' : '',
          isCollapse ? 'width-isCollapse height-isCollapse isCollapse' : ''
        ]"
        :style="{
          transform: `translateX(${transform.x}) translateY(${transform.y})`,
          'transition-duration': modalTransitionDuration,
          'z-index': modalZIndex
        }"
        @mousedown="setModalIndex"
        v-on-click-outside="clickOutside"
      >
        <Transition name="modal">
          <div
            v-show="containerIsShow"
            ref="containerRef"
            class="modal-container"
            :class="containerIsShow ? 'opacity-10' : 'opacity-0'"
            v-loading="props.loading"
          >
            <div class="modal-header">
              <CustomTooltip
                trigger="hover"
                placement="top-start"
                :show-after="560"
                :disabled="[undefined, null, ''].includes(props.title) || isDraggable"
              >
                <div
                  class="modal-title"
                  :class="props.draggable ? 'cursor-pointer' : 'cursor-default'"
                  @mousedown="onMouseDown"
                  @dblclick="onHeaderDoubleClick"
                >
                  <slot name="header">
                    <h3>{{ props.title }}</h3>
                  </slot>
                </div>

                <template #content>
                  <h3>{{ props.title }}</h3>
                </template>
              </CustomTooltip>

              <div class="flex-row">
                <CustomButton
                  v-if="!props.hiddenCollapse"
                  v-show="!isCollapse && !props.clickOutside"
                  icon-x-type="fa"
                  icon-name="Minus"
                  text
                  @click="setCollapse(true)"
                />
                <CustomButton
                  v-show="isCollapse || isFill"
                  icon-x-type="fa"
                  icon-name="WindowRestoreRegular"
                  text
                  @click="setFill(false)"
                />
                <CustomButton
                  v-show="isCollapse || !isFill"
                  icon-x-type="fa"
                  icon-name="WindowMaximizeRegular"
                  text
                  @click="setFill(true)"
                />

                <CustomTooltip
                  trigger="hover"
                  placement="top"
                  :disabled="!isCloseAllModal"
                >
                  <!-- 關閉單個 -->
                  <CustomButton icon-name="close" text @click="onClose('close')" />
                  <template #content>
                    <!-- 關閉全部 -->
                    <CustomButton
                      :label="i18nTranslate('closeAll', defaultModuleType)"
                      type="danger"
                      icon-name="close"
                      @click="onCloseAllClick"
                    />
                  </template>
                </CustomTooltip>
              </div>
            </div>

            <div v-show="!isCollapse" class="modal-body">
              <KeepAlive :max="1">
                <template v-if="props.isKeepAlive">
                  <div v-show="tempValue" style="width: 100%; height: 100%">
                    <slot :key="scopedId">Body</slot>
                  </div>
                </template>
                <template v-else>
                  <div v-if="tempValue" style="width: 100%; height: 100%">
                    <slot :key="scopedId">Body</slot>
                  </div>
                </template>
              </KeepAlive>
            </div>

            <div
              v-show="!isCollapse"
              :class="props.hiddenFooter ? 'modal-footer-hidden' : 'modal-footer'"
            >
              <slot name="footer">
                <div
                  v-if="props.draggable"
                  class="modal-footer-draggable"
                  @mousedown="onMouseDown"
                ></div>

                <div v-if="!props.hiddenFooter" class="modal-footer-btn">
                  <CustomButton
                    v-if="!props.hiddenCancel"
                    :label="i18nTranslate('confirm-no', defaultModuleType)"
                    icon-name="angle-left"
                    icon-move="translate"
                    @click="onClose('cancel')"
                  />
                  <CustomButton
                    v-if="!props.hiddenSubmit"
                    type="success"
                    :label="i18nTranslate('submit', defaultModuleType)"
                    icon-name="check"
                    icon-move="scale"
                    @click="submit"
                  />
                </div>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal {
  &-mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    transform: none;

    display: contents;
    &.is-hidden {
      background-color: #00000000;
    }
    &.is-show {
      background-color: #00000066;
    }
    &.is-modal {
      display: block;
    }
    &.is-draggable {
      display: block;

      background-color: #00000000;
      &.is-modal {
        background-color: #00000066;
      }
    }
  }

  &-wrapper {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    max: {
      width: 100%;
      height: 100%;
    }
    &.width {
      &-isFill {
        width: 100% !important;
      }
      &-isCollapse.isCollapse {
        width: 320px !important;
      }
      &-fill,
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
      &-extraSmall {
        width: 450px;
        @media (max-width: 992px) {
          width: 65%;
        }
        @media (max-width: 576px) {
          width: 85%;
        }
      }
    }
    &.height {
      &-isFill {
        height: 100% !important;
      }
      &-isCollapse.isCollapse {
        height: 32px !important;
      }
      &-fill,
      &-large {
        height: 85%;
      }
      &-default {
        height: 65%;
      }
      &-small {
        height: 500px;
      }
      &-extraSmall {
        height: 400px;
      }

      &-large,
      &-default,
      &-small,
      &-extraSmall {
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
    background-color: var(--i-color-system-page);
    box-shadow: 1px 1px 8px 2px var(--el-text-color-disabled);
    transition-duration: 0.3s;
    border-radius: 6px;
    min: {
      width: 80px;
      height: 48px;
    }
  }

  &-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    line-height: 40px;
    overflow: hidden;
    // border-bottom: 1px solid var(--el-text-color-disabled);
    box-shadow: 0px 0px 1px 1px var(--el-text-color-disabled);
    z-index: 1;
  }
  &-title {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 4px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
    border-top: 1px solid var(--el-text-color-disabled);

    &-hidden {
      width: 100%;
      height: 24px;
      border-top: 1px solid var(--el-text-color-disabled);
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
