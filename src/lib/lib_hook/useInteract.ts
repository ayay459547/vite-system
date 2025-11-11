import type { Ref } from 'vue'
import { nextTick, ref } from 'vue'

import type { Target as InteractTarget } from '@interactjs/core/types'
import type { Options as InteractOptions } from '@interactjs/core/options'
import type { Interactable } from '@interactjs/core/Interactable'
import interact from 'interactjs'

export type UseInteractReturn = Ref<Interactable>
/**
 * @description 使用 Interact.js 來處理拖曳事件
 * @param {InteractTarget} target 目標元素
 * @param {InteractOptions} options 參數
 */
export const useInteract = async (target: InteractTarget, options?: InteractOptions): Promise<UseInteractReturn> => {
  await nextTick()
  const interactable = ref<Interactable>()
  try {
    interactable.value = interact(target, options)
  } catch (e) {
    console.warn(e)
  }
  return interactable
}
