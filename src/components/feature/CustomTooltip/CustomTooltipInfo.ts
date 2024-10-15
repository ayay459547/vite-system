import type { PropType } from 'vue'

export const version = '__CustomTooltip_1.0.0__'

export declare namespace Types {
  type Placement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
}

export declare namespace Props {
  type AppendTo = string | HTMLElement
  type Content = string
  type RawContent = boolean
  type Placement = Types.Placement
  type FallbackPlacements = Array<Types.Placement>
  type Visible = boolean | null
  type Disabled = boolean
  type Offset = number
  type Transition = string
  type PopperOptions = Record<string, any>
  type ShowAfter = number
  type ShowArrow = boolean
  type HideAfter = number
  type AutoClose = number
  type PopperClass = string
  type Enterable = boolean
  type Teleported = boolean
  type Trigger = 'click' | 'focus' | 'hover' | 'contextmenu'
  type VirtualTriggering = boolean
  type VirtualRef = HTMLElement
  type TriggerKeys = Array<any>
  type Persistent = boolean
  type AriaLabel = string
}
export const props = {
  appendTo: {
    type: [String, Object] as PropType<Props.AppendTo>,
    required: false,
    default: undefined,
    description: '指示 Tooltip 的內容將附加在哪一個網頁元素上'
  },
  content: {
    type: String as PropType<Props.Content>,
    required: false,
    default: '',
    description: '顯示的內容，也可被 slot#content 覆蓋'
  },
  rawContent: {
    type: Boolean as PropType<Props.RawContent>,
    required: false,
    default: false,
    description: 'content 中的內容是否以 HTML 字串處理'
  },
  placement: {
    type: String as PropType<Props.Placement>,
    required: false,
    default: 'top',
    description: '顯示位置'
  },
  fallbackPlacements: {
    type: Array as PropType<Props.FallbackPlacements>,
    required: false,
    default: undefined,
    description: `
      Tooltip 可用的 positions 請查看popper.js 文檔
      https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements
      
    `
  },
  visible: {
    type: Boolean as PropType<Props.Visible>,
    required: false,
    default: null,
    description: '是否顯示'
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  offset: {
    type: Number as PropType<Props.Offset>,
    required: false,
    default: 6,
    description: '定位偏移量'
  },
  transition: {
    type: String as PropType<Props.Transition>,
    required: false,
    default: undefined,
    description: '動畫名稱'
  },
  popperOptions: {
    type: Object as PropType<Props.PopperOptions>,
    required: false,
    default () {
      return {}
    },
    description: `
      popper.js 参数
      https://popper.js.org/docs/v2/
    `
  },
  showAfter: {
    type: Number as PropType<Props.ShowAfter>,
    required: false,
    default: 0,
    description: '觸發後多久顯示內容，單位毫秒'
  },
  showArrow: {
    type: Boolean as PropType<Props.ShowArrow>,
    required: false,
    default: true,
    description: '是否顯示箭頭'
  },
  hideAfter: {
    type: Number as PropType<Props.HideAfter>,
    required: false,
    default: 200,
    description: '觸發後多久顯示內容，單位毫秒'
  },
  autoClose: {
    type: Number as PropType<Props.AutoClose>,
    required: false,
    default: 0,
    description: 'tooltip 出現後自動隱藏式延遲，單位毫秒'
  },
  popperClass: {
    type: String as PropType<Props.PopperClass>,
    required: false,
    default: '',
    description: 'class'
  },
  enterable: {
    type: Boolean as PropType<Props.Enterable>,
    required: false,
    default: true,
    description: '滑鼠是否可進到 tooltip 中'
  },
  teleported: {
    type: Boolean as PropType<Props.Teleported>,
    required: false,
    default: true,
    description: '是否使用 teleport。設定成 true則會被追加到 append-to 的位置'
  },
  trigger: {
    type: String as PropType<Props.Trigger>,
    required: false,
    default: 'hover',
    description: '如何觸發 Tooltip'
  },
  virtualTriggering: {
    type: Boolean as PropType<Props.VirtualTriggering>,
    required: false,
    default: undefined,
    description: '用來標識虛擬觸發是否已啟用'
  },
  virtualRef: {
    type: Object as PropType<Props.VirtualRef>,
    required: false,
    default: undefined,
    description: '標識虛擬觸發時的觸發元素'
  },
  triggerKeys: {
    type: Array as PropType<Props.TriggerKeys>,
    required: false,
    default: ['Enter', 'Space'],
    description: `
      當滑鼠點擊或對焦在觸發元素上時，
      可以定義一組鍵盤按鍵並且透過它們來控制 Tooltip 的顯示
    `
  },
  persistent: {
    type: Boolean as PropType<Props.Persistent>,
    required: false,
    default: undefined,
    description: `    
      當 tooltip 元件長時間不觸發且 persistent 屬性設定為 false 時，
      popconfirm 將會被刪除
    `
  },
  ariaLabel: {
    type: String as PropType<Props.AriaLabel>,
    required: false,
    default: undefined,
    description: '和 aria-label 屬性保持一致'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
