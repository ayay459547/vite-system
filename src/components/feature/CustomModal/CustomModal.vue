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
import { useBoundingClientRect } from '@/lib/lib_hook'
import { CustomButton, CustomIcon, CustomTooltip } from '@/components'
import { getUuid } from '@/lib/lib_utils'
import throttle from '@/lib/lib_throttle'
import { useCustomModalStore } from '@/stores/stores_CustomModal'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props } from './CustomModalInfo'
import { version, props as modalProps, minModalIndex } from './CustomModalInfo'

const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const scopedName = '__i-modal__'
const scopedId = getUuid(scopedName)

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
const modalCurrentIndex = computed(() => {
  const tempIndex = modalIndexMap?.value[scopedId] ?? 0
  return tempIndex + minModalIndex
})
const setModalIndex = () => {
  customModalStore.setModalIndex(scopedId)
}
const removeModalIndex = () => {
  customModalStore.removeModalIndex(scopedId)
}

const isCloseAllModal = computed(() => {
  if (tempValue.value && modalCount.value <= 0) {
    close()
  }

  return modalCount.value >= 2
})

const wrapperIsShow = ref(false)
const containerIsShow = ref(false)

const openModal = async () => {
  wrapperIsShow.value = true

  if (props.draggable) {
    transform.x = '-50%'
    transform.y = '-50%'
  }

  setTimeout(() => {
    containerIsShow.value = true
  }, 10)

  // 等過場動畫結束
  await nextTick()
  if (props.draggable) {
    setTimeout(() => {
      resetRect()
    }, 400)

    setTimeout(async () => {
      resetMove()
      isFinishInit.value = true
    }, 500)
  }
}

const closeModal = () => {
  containerIsShow.value = false
  isFinishInit.value = false

  setTimeout(() => {
    wrapperIsShow.value = false
  }, 200)
}

const close = async () => {
  await nextTick()
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

const setCenter = (x: number, y: number) => {
  centerRect.x = x
  centerRect.y = y
}
const setLimit = (x: number, y: number) => {
  limitRect.x = x
  limitRect.y = y
}
// 由於過場動畫
// 所以需要再重設: 中心的 transform 值 + 移動的邊界值
const resetRect = () => {
  const contentRect = containerRef.value.getBoundingClientRect()
  const { width, height } = contentRect
  const [centerX, cneterY] = [width / 2, height / 2]

  setCenter(centerX, cneterY)

  const [windowWidth, windowHeight] = [window.innerWidth, window.innerHeight]

  // 確保 modal 全顯示
  // setLimit(windowWidth / 2 - centerX, windowHeight / 2 - cneterY)

  // 確保 有 50 顯示
  setLimit(windowWidth / 2 - 50, windowHeight / 2 - 50)
}

const resetMove = async () => {
  wrapperStyle.value = 'transition-duration: 0.2s;'
  await nextTick()

  const { x: centerX, y: centerY } = centerRect

  const limitRect = {
    x: window.innerWidth / 2 - centerX,
    y: window.innerHeight / 2 - centerY
  }

  switch (props.xPosition) {
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

  switch (props.yPosition) {
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

  setTimeout(() => {
    wrapperStyle.value = ''
  }, 200)
}

// 視窗大小變化時 位置重設
useBoundingClientRect(containerRef, () => {
  if (!isFinishInit.value || !props.draggable) return
  resetRect()
  resetMove()
})

const mousedownClient = {
  clientX: 0,
  clientY: 0
}
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
const throttleUpdateTransform = throttle(updateTransform, 8) as typeof updateTransform

// 確認是否超出螢幕 要重設位置
// const windowSize = reactive({
//   width: 0,
//   height: 0
// })
const fixModalOutSide = () => {
  const contentRect = containerRef.value.getBoundingClientRect()
  const { x, y, width, height } = contentRect
  const [windowWidth, windowHeight] = [window.innerWidth, window.innerHeight]

  if (x < -width || x > windowWidth || y < -height || y > windowHeight) {
    resetRect()
    resetMove()
  }
}
const throttleFixModalOutSide = throttle(fixModalOutSide, 2000) as typeof fixModalOutSide

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

  // 有時超出銀幕
  setTimeout(() => {
    throttleFixModalOutSide()
  }, 1000)
}

// 新增拖拉用事件
const addEvent = ($event: MouseEvent) => {
  if (!props.draggable) return
  resetRect()

  mousedownClient.clientX = $event.clientX
  mousedownClient.clientY = $event.clientY

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
    watch(
      tempValue,
      newValue => {
        if (newValue) {
          setModalIndex()

          setTimeout(() => {
            openModal()
          }, 0)
        } else {
          removeModalIndex()
          removeEvent()

          setTimeout(() => {
            closeModal()
          }, 0)
        }
      },
      {
        deep: false,
        immediate: true
      }
    )
  })
})

onUnmounted(async () => {
  tempValue.value = false

  setTimeout(() => {
    scope.stop()
  }, 0)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-show="wrapperIsShow"
      class="modal-mask"
      :class="[
        `CustomModal_${version}`,
        scopedId,
        scopedName,
        containerIsShow ? 'is-show' : 'is-close',
        props.modal ? 'is-modal' : ''
      ]"
      :style="{ zIndex: modalCurrentIndex }"
    >
      <div
        class="modal-wrapper"
        :class="[`width-${props.widthSize}`, `height-${props.heightSize}`]"
        :style="`
          transform: translateX(${transform.x}) translateY(${transform.y});
          ${wrapperStyle};
          ${bindStyle};
          z-index: ${modalCurrentIndex};
        `"
        @mousedown="setModalIndex"
        v-click-outside="clickOutside"
      >
        <Transition name="modal">
          <div
            v-show="containerIsShow"
            ref="containerRef"
            class="modal-container"
            v-loading="props.loading"
          >
            <div class="modal-header">
              <div v-if="props.draggable" class="modal-draggable" @mousedown="addEvent">
                <CustomIcon name="up-down-left-right" />
                <slot name="header">
                  <h3>{{ props.title }}</h3>
                </slot>
              </div>
              <slot v-else name="header">
                <h3>{{ props.title }}</h3>
              </slot>

              <div class="flex-row">
                <CustomButton icon-x-type="fa" icon-name="Minus" text />
                <CustomButton icon-x-type="fa" icon-name="WindowRestoreRegular" text />
                <CustomButton icon-x-type="fa" icon-name="WindowMaximizeRegular" text />

                <!-- 關閉全部 -->
                <CustomTooltip v-if="isCloseAllModal" trigger="hover" placement="top">
                  <CustomButton icon-name="close" text @click="close" />
                  <template #content>
                    <CustomButton
                      :label="i18nTranslate('closeAll', defaultModuleType)"
                      type="danger"
                      icon-name="close"
                      @click="onCloseAllClick"
                    />
                  </template>
                </CustomTooltip>
                <!-- 關閉單個 -->
                <CustomButton v-else-if="!isCloseAllModal" icon-name="close" text @click="close" />
              </div>
            </div>

            <div class="modal-body">
              <KeepAlive>
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
                    :label="i18nTranslate('cancel', defaultModuleType)"
                    icon-name="angle-left"
                    icon-move="translate"
                    @click="cancel"
                  />
                  <CustomButton
                    v-if="!props.hiddenSubmit"
                    type="success"
                    :label="i18nTranslate('confirm', defaultModuleType)"
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

    transition-duration: 0.3s;
    &.is-close {
      background-color: #00000000;
    }
    &.is-show {
      background-color: #00000066;
    }
    &.is-modal {
      display: block
    }
  }

  &-wrapper {
    position: fixed;
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
      &-extraSmall {
        width: 450px;
        @media (max-width: 992px) {
          width: 65%;
        }
        @media (max-width: 576px) {
          width: 85%;
        }
      }
      &-fitContent {
        width: fit-content;
      }
    }
    &.height {
      & {
        max: {
          width: 100%;
          height: 100%;
        }
      }

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
      &-fitContent {
        height: fit-content;
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
    min: {
      width: 100px;
      height: 100px;
    }
    border-radius: 6px;
  }

  &-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    height: 40px;
    border-bottom: 1px solid var(--el-text-color-disabled);
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
