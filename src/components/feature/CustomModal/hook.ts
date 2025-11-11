import type { Ref } from 'vue'
import { ref, computed, nextTick } from 'vue'
import interact from 'interactjs'

import type { UseInteractReturn } from '@/lib/lib_hook' // 自訂Composition API
import { useInteract } from '@/lib/lib_hook' // 自訂Composition API

import { isEmpty } from '@/lib/lib_utils'

type UseDraggableOptions = {
  draggable: boolean
  useResize: boolean
  scopedId: string
}
export const useDraggable = ({ draggable, useResize, scopedId }: UseDraggableOptions) => {
  const target = `div[class*="${scopedId}"] div[interact-draggable].modal-draggable`
  const __interactable__: UseInteractReturn | Ref<null> = ref()

  // 滑鼠是否處於拖拉狀態
  const isDraggable = ref(false)
  // 拖拉定位
  const dragPosition = { x: 0, y: 0 }
  const wrapperSize = { width: 0, height: 0 }

  const setTargetElStyle = (targetEl: HTMLElement, style: Partial<CSSStyleDeclaration>) => {
    const { width = '', height = '', transform = '' } = style
    targetEl.style.width = width
    targetEl.style.height = height
    targetEl.style.transform = transform
  }

  // 是否可以拖拉
  const __isDisabledDrag__ = ref(false)
  const isDisabledDrag = computed({
    get: () => __isDisabledDrag__.value,
    set: (v: boolean) => {
      __isDisabledDrag__.value = v
      if (!isEmpty(__interactable__.value) && draggable) {
        __interactable__.value.draggable({ enabled: !v })
      }
    }
  })
  const initDraggable = (isEnabled: boolean = false) => {
    if (!draggable) return

    __interactable__.value.pointerEvents({
      allowFrom: '.modal-header, .modal-footer',
      ignoreFrom: '.modal-body'
    }).draggable({
      allowFrom: '.modal-header, .modal-footer',
      ignoreFrom: '.modal-body',
      listeners: {
        start () { isDraggable.value = true },
        end () { isDraggable.value = false },
        move (event) {
          if (isDisabledDrag.value) return
          const targetEl = event.target

          dragPosition.x += event.dx
          dragPosition.y += event.dy

          setTargetElStyle(targetEl, {
            width: `${wrapperSize.width}px`,
            height: `${wrapperSize.height}px`,
            transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`
          })
        }
      },
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'body',
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        })
      ]
    })

    isDisabledDrag.value = isEnabled
  }

  // 是否可以變更大小
  const __isDisabledResize__ = ref(false)
  const isDisabledResize = computed({
    get: () => __isDisabledResize__.value,
    set: (v: boolean) => {
      __isDisabledResize__.value = v
      if (!isEmpty(__interactable__.value) && useResize) {
        __interactable__.value.resizable({ enabled: !v })
      }
    }
  })
  const initResize = (isEnabled: boolean = false) => {
    if (!useResize) return

    __interactable__.value.resizable({
      edges: {
        top: true,
        bottom: true,
        left: '.modal-resize-left',
        right: '.modal-resize-right'
      },
      listeners: {
        start () { isDraggable.value = true },
        end () { isDraggable.value = false },
        move (event) {
          if (isDisabledDrag.value) return
          const targetEl = event.target

          dragPosition.x += event.deltaRect.left
          dragPosition.y += event.deltaRect.top

          wrapperSize.width = event.rect.width
          wrapperSize.height = event.rect.height

          setTargetElStyle(targetEl, {
            width: `${wrapperSize.width}px`,
            height: `${wrapperSize.height}px`,
            transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`
          })
        }
      },
      modifiers: [
        interact.modifiers.restrictEdges({
          outer: 'body'
        }),
        interact.modifiers.restrictSize({
          min: { width: 300, height: 300 }
        })
      ],
      inertia: true
    })

    isDisabledResize.value = isEnabled
  }

  // 重置位置
  const resetInteractToCenter = async () => {
    const targetEl = document.querySelector(target) as HTMLElement
    if (isEmpty(targetEl)) return
    // 為了計算 dragPosition 先清空 width + height
    targetEl.style.width = ''
    targetEl.style.height = ''

    await nextTick()
    const bodyRect = document.body.getBoundingClientRect()
    const targetRect = targetEl.getBoundingClientRect()

    // 預設清空style, 以 wrapper 的寬高為主
    dragPosition.x = (bodyRect.width - targetRect.width) / 2
    dragPosition.y = (bodyRect.height - targetRect.height) / 2

    wrapperSize.width = targetRect.width
    wrapperSize.height = targetRect.height

    setTargetElStyle(targetEl, {
      width: '',
      height: '',
      transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`
    })
  }

  // 取消事件
  const unsetInteract = () => {
    if (__interactable__.value) {
      isDisabledDrag.value = true
      isDisabledResize.value = true
      __interactable__.value.unset()
    }
  }

  // 初始化事件
  const initInteract = async () => {
    const interactable = await useInteract(target)
    __interactable__.value = interactable.value
    initDraggable(isDisabledDrag.value)
    initResize(isDisabledResize.value)
  }

  return {
    isDraggable,
    isDisabledDrag,
    isDisabledResize,
    resetInteractToCenter,
    unsetInteract,
    initInteract
  }
}
