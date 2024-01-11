import type { PropType } from 'vue'

import { getUuid } from '@/lib/lib_utils'

export const version = '1.0.0'

export const scopedId = getUuid('__i-drawer__')

export type DrawerDirection = 'rtl' | 'ltr' | 'ttb' | 'btt'

export const props = {
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否顯示'
  },
  direction: {
    type: String as PropType<DrawerDirection>,
    default: 'rtl',
    description: '打開方向'
  },
  title: {
    type: String as PropType<string>,
    default: '',
    description: '標題'
  },
  destroyOnClose: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否在關閉抽屜之後將子元素全部銷毀'
  },
  customClass: {
    type: String as PropType<string>,
    default: '',
    description: 'Drawer自訂class'
  },
  modal: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: '是否需要遮罩'
  },
  modalClass: {
    type: String as PropType<string>,
    default: '',
    description: '遮罩自訂class'
  },
  size: {
    type: [Number, String] as PropType<number | string>,
    default: '',
    description: '視窗大小'
  }
}
