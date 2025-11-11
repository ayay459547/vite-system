import type { PropType, WritableComputedRef, Ref } from 'vue'
import type { Placement as ElPlacement } from 'element-plus'

export const version = '__CustomTooltip_1.0.0__'

export interface Types {}

export interface Props {
  appendTo: string | HTMLElement
  content: string
  rawContent: boolean
  placement: ElPlacement
  fallbackPlacements: Array<ElPlacement>
  visible: Ref<boolean> | WritableComputedRef<boolean> | boolean | null
  disabled: boolean
  offset: number
  transition: string
  popperOptions: Record<string, any>
  showAfter: number
  showArrow: boolean
  hideAfter: number
  autoClose: number
  popperClass: string
  enterable: boolean
  teleported: boolean
  trigger: 'click' | 'focus' | 'hover' | 'contextmenu'
  virtualTriggering: boolean
  virtualRef: HTMLElement
  triggerKeys: Array<any>
  persistent: boolean
  ariaLabel: string
}
export const props = {
  appendTo: {
    type: [String, Object] as PropType<Props['appendTo']>,
    required: false,
    default: undefined,
    description: '指示 Tooltip 的內容將附加在哪一個網頁元素上'
  },
  content: {
    type: String as PropType<Props['content']>,
    required: false,
    default: '',
    description: '顯示的內容，也可被 slot#content 覆蓋'
  },
  rawContent: {
    type: Boolean as PropType<Props['rawContent']>,
    required: false,
    default: false,
    description: 'content 中的內容是否以 HTML 字串處理'
  },
  placement: {
    type: String as PropType<Props['placement']>,
    required: false,
    default: 'top',
    description: '顯示位置'
  },
  fallbackPlacements: {
    type: Array as PropType<Props['fallbackPlacements']>,
    required: false,
    default: undefined,
    description: `
      Tooltip 可用的 positions 請查看popper.js 文檔
      https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements

    `
  },
  visible: {
    type: [Object, Boolean] as PropType<Props['visible']>,
    required: false,
    default: undefined,
    description: '是否顯示'
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  offset: {
    type: Number as PropType<Props['offset']>,
    required: false,
    default: 6,
    description: '定位偏移量'
  },
  transition: {
    type: String as PropType<Props['transition']>,
    required: false,
    default: undefined,
    description: '動畫名稱'
  },
  popperOptions: {
    type: Object as PropType<Props['popperOptions']>,
    required: false,
    default: () => {
      return {}
    },
    description: `
      popper.js 参数
      https://popper.js.org/docs/v2/
    `
  },
  showAfter: {
    type: Number as PropType<Props['showAfter']>,
    required: false,
    default: 0,
    description: '觸發後多久顯示內容，單位毫秒'
  },
  showArrow: {
    type: Boolean as PropType<Props['showArrow']>,
    required: false,
    default: true,
    description: '是否顯示箭頭'
  },
  hideAfter: {
    type: Number as PropType<Props['hideAfter']>,
    required: false,
    default: 200,
    description: '觸發後多久顯示內容，單位毫秒'
  },
  autoClose: {
    type: Number as PropType<Props['autoClose']>,
    required: false,
    default: 0,
    description: 'tooltip 出現後自動隱藏式延遲，單位毫秒'
  },
  popperClass: {
    type: String as PropType<Props['popperClass']>,
    required: false,
    default: '',
    description: 'class'
  },
  enterable: {
    type: Boolean as PropType<Props['enterable']>,
    required: false,
    default: true,
    description: '滑鼠是否可進到 tooltip 中'
  },
  teleported: {
    type: Boolean as PropType<Props['teleported']>,
    required: false,
    default: true,
    description: '是否使用 teleport。設定成 true則會被追加到 append-to 的位置'
  },
  trigger: {
    type: String as PropType<Props['trigger']>,
    required: false,
    default: 'hover',
    description: '如何觸發 Tooltip'
  },
  virtualTriggering: {
    type: Boolean as PropType<Props['virtualTriggering']>,
    required: false,
    default: undefined,
    description: '用來標識虛擬觸發是否已啟用'
  },
  virtualRef: {
    type: Object as PropType<Props['virtualRef']>,
    required: false,
    default: undefined,
    description: '標識虛擬觸發時的觸發元素'
  },
  triggerKeys: {
    type: Array as PropType<Props['triggerKeys']>,
    required: false,
    default: ['Enter', 'Space'],
    description: `
      當滑鼠點擊或對焦在觸發元素上時，
      可以定義一組鍵盤按鍵並且透過它們來控制 Tooltip 的顯示
    `
  },
  persistent: {
    type: Boolean as PropType<Props['persistent']>,
    required: false,
    default: undefined,
    description: `
      當 tooltip 元件長時間不觸發且 persistent 屬性設定為 false 時，
      popconfirm 將會被刪除
    `
  },
  ariaLabel: {
    type: String as PropType<Props['ariaLabel']>,
    required: false,
    default: undefined,
    description: '和 aria-label 屬性保持一致'
  }
}

export interface Emits {}

export interface Expose {}
