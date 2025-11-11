<script setup lang="ts">
import {
  ref, inject, nextTick,
  computed, watch, effectScope,
  onBeforeMount, onMounted, onUnmounted
} from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook, SwalResult } from '@/types/types_hook' // 全域功能類型

import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'
import CustomTooltip from '@/components/feature/CustomTooltip/CustomTooltip.vue'
import { getUuid, awaitTime } from '@/lib/lib_utils' // 工具
import { useCustomModalStore } from '@/stores/stores_components/useCustomModalStore'
import { defaultModuleType } from '@/declare/declare_i18n'
import { useResizeObserver } from '@/lib/lib_hook' // 自訂Composition API

import type { Props } from './CustomModalInfo'
import { version, props as modalProps, minModalIndex } from './CustomModalInfo'
import { useDraggable } from './hook'

const useHook = inject('useHook') as UseHook
const { swal, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const scopedId = getUuid(version)

const props = defineProps(modalProps)

const emit = defineEmits([
  'update:model-value',
  'close',
  'cancel',
  'submit'
])

const tempValue = computed<Props['modelValue']>({
  get: () => props.modelValue,
  set: (value: Props['modelValue']) => emit('update:model-value', value)
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

// 拖拉
const {
  isDraggable,
  isDisabledDrag,
  isDisabledResize,
  resetInteractToCenter,
  unsetInteract,
  initInteract
} = useDraggable({
  draggable: props.draggable,
  useResize: props.useResize,
  scopedId
})

// 是否佔全螢幕
const isFill = ref(props.widthSize === 'fill' && props.heightSize === 'fill')
const setFill = (newFill: boolean) => {
  isFill.value = newFill
  isCollapse.value = false

  isDisabledDrag.value = isCollapse.value ? false : isFill.value
  isDisabledResize.value = isFill.value || isCollapse.value
}

// 是否縮小
const isCollapse = ref(false)
const setCollapse = (newCollapse: boolean) => {
  isFill.value = false
  isCollapse.value = newCollapse

  isDisabledDrag.value = isCollapse.value ? false : isFill.value
  isDisabledResize.value = isFill.value || isCollapse.value
}

// header 點兩下切換顯示
const onHeaderDoubleClick = () => {
  setFill(!isFill.value)
}

// 視窗大小變化時 位置重設
useResizeObserver(document.body, () => {
  if (!tempValue.value) return
  resetInteractToCenter()
})

// 開啟彈窗
const openModal = async () => {
  wrapperIsShow.value = true

  await awaitTime(16)
  containerIsShow.value = true
  resetInteractToCenter()

  // 等過場動畫結束
  await awaitTime(480)
  setFill(isFill.value)

  initInteract()
}

// 關閉彈窗
const closeModal = async () => {
  removeModalIndex()
  containerIsShow.value = false

  await awaitTime(240)
  wrapperIsShow.value = false

  unsetInteract()
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


// 點擊 modal 外自動關閉
const clickOutside = async () => {
  if (!props.clickOutside || !containerIsShow.value) return
  await awaitTime(120)
  tempValue.value = false
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

// 監聽
const scope = effectScope()

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
        isDraggable ? 'is-draggable user-select-none' : '',
      ]"
      :style="{ 'z-index': modalZIndex }"
    >
      <div
        interact-draggable
        class="modal-wrapper modal-draggable"
        :class="[
          `width-${props.widthSize}`,
          `height-${props.heightSize}`,
          isFill ? 'width-isFill height-isFill' : '',
          isCollapse ? 'width-isCollapse height-isCollapse' : ''
        ]"
        :style="{ 'z-index': modalZIndex }"
        v-on-click-outside="clickOutside"
      >
        <Transition name="modal">
          <div
            v-show="containerIsShow"
            class="modal-container"
            v-loading="props.loading"
          >
            <div class="modal-header">
              <CustomTooltip
                trigger="hover"
                placement="top-start"
                :show-after="1200"
                :show-arrow="false"
                :disabled="isDraggable || [undefined, null, ''].includes(props.title)"
              >
                <div class="modal-title" @dblclick="onHeaderDoubleClick">
                  <h4 class="fill">
                    <slot name="header">
                      {{ props.title }}
                    </slot>
                  </h4>
                </div>

                <template #content>
                  <h4>{{ props.title }}</h4>
                </template>
              </CustomTooltip>

              <div class="flex-row">
                <!-- 測試用按鈕 -->
                <!-- <div class="flex-row i-ga-xs i-px-md">
                  <CustomButton
                    icon-x-type="material"
                    icon-name="CenterFocusStrongSharp"
                    icon-size='small'
                    type="primary"
                    @click="resetInteractToCenter()"
                  />
                  <CustomButton
                    icon-x-type="fa"
                    icon-name="WindowCloseRegular"
                    icon-size='small'
                    type="danger"
                    @click="unsetInteract()"
                  />
                  <CustomButton
                    icon-x-type="tabler"
                    icon-name="DragDrop"
                    icon-size='small'
                    type="success"
                    @click="initInteract()"
                  />
                </div> -->

                <!-- 縮小 -->
                <CustomButton
                  v-if="!props.hiddenCollapse"
                  v-show="!isCollapse && !props.clickOutside"
                  icon-x-type="fa"
                  icon-name="Minus"
                  icon-size='small'
                  text
                  @click="setCollapse(true)"
                />
                <!-- 視窗 -->
                <CustomButton
                  v-show="isCollapse || isFill"
                  icon-x-type="fa"
                  icon-size='small'
                  icon-name="WindowRestoreRegular"
                  text
                  @click="setFill(false)"
                />
                <!-- 滿屏 -->
                <CustomButton
                  v-show="isCollapse || !isFill"
                  icon-x-type="fa"
                  icon-size='small'
                  icon-name="WindowMaximizeRegular"
                  text
                  @click="setFill(true)"
                />

                <!-- 關閉 -->
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
              <div class="modal-body-mask" :class="{ 'is-draggable': isDraggable }"></div>
            </div>

            <div
              v-show="!isCollapse"
              class="modal-footer"
              :class="props.hiddenFooter ? 'modal-footer-hidden' : ''"
            >
              <slot name="footer">
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
                    @click="() => emit('submit')"
                  />
                </div>
              </slot>
            </div>

            <div class="modal-resize-left"></div>
            <div class="modal-resize-right"></div>
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
    // 拖拉時 使用遮罩 防止無法順利拖拉縮放
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
    left: 0;
    top: 0;
    max: {
      width: 100%;
      height: 100%;
    }

    &.width {
      &-isFill {
        transform: translate(0, 0) !important;
        min-width: 100% !important;
      }
      // &-isCollapse {
      //   max-width: 450px !important;
      // }
      &-fill,
      &-large {
        width: 85%;
        @media (max-width: 992px) { width: 90% }
        @media (max-width: 576px) { width: 95% }
      }
      &-default {
        width: 65%;
        @media (max-width: 992px) { width: 70% }
        @media (max-width: 576px) { width: 90% }
      }
      &-small {
        width: 650px;
        @media (max-width: 992px) { width: 65% }
        @media (max-width: 576px) { width: 85% }
      }
      &-extraSmall {
        width: 450px;
        @media (max-width: 992px) { width: 65% }
        @media (max-width: 576px) { width: 85% }
      }
    }
    &.height {
      &-isFill {
        transform: translate(0, 0) !important;
        min-height: 100%;
      }
      &-isCollapse {
        max-height: 48px !important;
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
        @media (max-height: 576px) { height: 90%; }
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
    border-radius: 6px;
    box-shadow: 1px 1px 8px 2px var(--el-text-color-disabled);
    min: {
      width: 80px;
      height: 48px;
    }
    position: relative;

    // 左右拖拉 position 防止與 scrollbar 重疊
    @mixin modalResizeStyle ($position, $w, $h) {
      width: $w;
      height: $h;
      position: absolute;
      #{$position}: -6px;
      z-index: 1;
    }
    .modal-resize-left {
      @include modalResizeStyle(left, 5px, 100%);
    }
    .modal-resize-right {
      @include modalResizeStyle(right, 5px, 100%);
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
    border-radius: 6px 6px 0 0;
    // border 有機率不會被渲染
    // border-bottom: 1px solid var(--el-text-color-disabled);
    box-shadow: 0px 0px 1px 1px var(--el-text-color-disabled);
    z-index: var(--i-z-index-modal);
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

    & > h4 {
      font-size: 1.05rem;
    }
  }

  &-body {
    width: 100%;
    flex: 1;
    overflow: auto;
    position: relative;

    &-mask {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: contents;

      // 拖拉時 使用遮罩 防止無法順利拖拉縮放
      &.is-draggable {
        display: block;
      }
    }
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
  }
}
</style>
