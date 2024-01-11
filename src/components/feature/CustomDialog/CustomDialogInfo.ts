import type { PropType } from 'vue'

import { getUuid } from '@/lib/lib_utils'

export const version = '1.0.0'

export const scopedId = getUuid('__i-dialog__')

export type ModelValue = boolean

export const props = {
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
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '',
    description: '寬度'
  },
  fullscreen: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否全屏'
  },
  top: {
    type: String as PropType<string>,
    default: '',
    description: 'dialog CSS 中的 margin-top值'
  },
  modal: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否需要遮罩'
  },
  modalClass: {
    type: String as PropType<string>,
    default: '',
    description: '自訂遮罩class'
  },
  appendToBody: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否插入至body'
  },
  lockScroll: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: '是否再出現時鎖住 bodey 的 scroll'
  },
  draggable: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否可拖拉'
  }
}