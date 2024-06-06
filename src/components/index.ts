import type { Ref } from 'vue'
import type { ValidationOptions, ValidationResult } from 'vee-validate'

// 通用
export type CustomSize = 'large' | 'default' | 'small'
export type CustomElType = '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type { Option, Options } from '@/declare/columnSetting'

// 圖表類
export { default as CustomCharts } from './chart/CustomCharts/CustomCharts.vue'
export { default as GanttChart } from './chart/GanttChart/GanttChart.vue'
export { default as WeekSchedule } from './chart/WeekSchedule/WeekSchedule.vue'

// 專案功能組件

// 區塊右上方顯示 數字/圖示/其他
export type { Props as BadgeProps } from './feature/CustomBadge/CustomBadgeInfo'
export { default as CustomBadge } from './feature/CustomBadge/CustomBadge.vue'

// 按鈕
export type {
  Props as ButtonProps,
  Emits as ButtonEmits
} from './feature/CustomButton/CustomButtonInfo'
export { default as CustomButton } from './feature/CustomButton/CustomButton.vue'

// 卡片
export type { Props as CardProps } from './feature/CustomCard/CustomCardInfo'
export { default as CustomCard } from './feature/CustomCard/CustomCard.vue'

// 展開/縮起 區塊
export type {
  Custom as CollapseCustom,
  Props as CollapseProps,
  Emits as CollapseEmits
} from './feature/CustomCollapse/CustomCollapseInfo'
export { default as CustomCollapse } from './feature/CustomCollapse/CustomCollapse.vue'

// 棄用 CustomModal 代替
export type { Props as DialogProps } from './feature/CustomDialog/CustomDialogInfo'
export { default as CustomDialog } from './feature/CustomDialog/CustomDialog.vue'

// 分隔線
export type { Props as DividerProps } from './feature/CustomDivider/CustomDividerInfo'
export { default as CustomDivider } from './feature/CustomDivider/CustomDivider.vue'

// 拖拉
export type {
  Custom as DraggableCustom,
  Props as DraggableProps,
  Emits as DraggableEmits
} from './feature/CustomDraggable/CustomDraggableInfo'
export { default as CustomDraggable } from './feature/CustomDraggable/CustomDraggable.vue'

// 從銀幕外插入畫面
export type {
  Props as DrawerProps,
  Emits as DrawerEmits
} from './feature/CustomDrawer/CustomDrawerInfo'
export { default as CustomDrawer } from './feature/CustomDrawer/CustomDrawer.vue'

// 無資料
export type { Props as EmptyProps } from './feature/CustomEmpty/CustomEmptyInfo'
export { default as CustomEmpty } from './feature/CustomEmpty/CustomEmpty.vue'

// 圖示
export type { Custom as IconCustom, Props as IconProps } from './feature/CustomIcon/CustomIconInfo'
export { default as CustomIcon } from './feature/CustomIcon/CustomIcon.vue'

// 圖片
export type {
  Props as ImageProps,
  Emits as ImageEmits
} from './feature/CustomImage/CustomImageInfo'
export { default as CustomImage } from './feature/CustomImage/CustomImage.vue'

// 輸入框
export type {
  ModelValue as InputModelValue,
  InputType
} from './feature/CustomInput/CustomInputInfo'
export { default as CustomInput } from './feature/CustomInput/CustomInput'

// 跳轉用組件
// export { default as CustomLink } from './feature/CustomLink/CustomLink.vue'

// .md
export type { Props as MarkdownProps } from './feature/CustomMarkdown/CustomMarkdownInfo'
export { default as CustomMarkdown } from './feature/CustomMarkdown/CustomMarkdown.vue'

// 彈窗
export type {
  Custom as ModalCustom,
  Props as ModalProps,
  Emits as ModalEmits
} from './feature/CustomModal/CustomModalInfo'
export { default as CustomModal } from './feature/CustomModal/CustomModal.vue'

// 彈出 區塊提示
export type { Props as PopoverProps } from './feature/CustomPopover/CustomPopoverInfo'
export { default as CustomPopover } from './feature/CustomPopover/CustomPopover.vue'

// 進度條
export type {
  Custom as ProgressCustom,
  Props as ProgressProps
} from './feature/CustomProgress/CustomProgressInfo'
export { default as CustomProgress } from './feature/CustomProgress/CustomProgress.vue'

// 滾輪
export type {
  Custom as ScrollbarCustom,
  Props as ScrollbarProps,
  Emits as ScrollbarEmits,
  Expose as ScrollbarExpose
} from './feature/CustomScrollbar/CustomScrollbarInfo'
export { default as CustomScrollbar } from './feature/CustomScrollbar/CustomScrollbar.vue'

// 搜尋用組件
export { default as CustomSearch } from './feature/CustomSearch/CustomSearch.vue'
// GroupSearch 需搭配 CustomSearch 或 CustomInput 使用
export { default as GroupSearch } from './feature/CustomSearch/GroupSearch.vue'

// 步驟
export type {
  Custom as StepsCustom,
  Props as StepsProps
} from './feature/CustomSteps/CustomStepsInfo'
export { default as CustomSteps } from './feature/CustomSteps/CustomSteps.vue'

// 切換鈕
export type {
  Custom as SwitchCustom,
  Props as SwitchProps,
  Emits as SwitchEmits
} from './feature/CustomSwitch/CustomSwitchInfo'
export { default as CustomSwitch } from './feature/CustomSwitch/CustomSwitch.vue'

// 表格
export { default as TableMain } from './feature/CustomTable/TableMain.vue'
// 虛擬表格
export { default as CustomTableV2 } from './feature/CustomTableV2/CustomTableV2.vue'
// 專案用表格
import type { TableParams, PageChange } from './feature/CustomTable/CustomTableInfo'
export declare interface CustomTableExpose {
  pageChange: PageChange
  getTableParams: () => TableParams
  setTableParams: (params: TableParams) => void
  resetScroll: () => void
  toggleSelection: (rows: any[]) => void
  getSelectionRows: () => any[]
}
export type {
  Order,
  Sort,
  Sorting,
  SortingList,
  SortingMap,
  PageChange,
  TableParams,
  LazyLoadingStatus,
  TableSize,
  SpanMethod,
  PropsTableColumn,
  ShowType
} from './feature/CustomTable/CustomTableInfo'
export { default as CustomTable } from './feature/CustomTable/CustomTable.vue'

// 分頁
export type { Props as TabsProps, Emits as TabsEmits } from './feature/CustomTabs/CustomTabsInfo'
export { default as CustomTabs } from './feature/CustomTabs/CustomTabs.vue'

// 類似按鈕的標籤
export type { Props as TagProps, Emits as TagEmits } from './feature/CustomTag/CustomTagInfo'
export { default as CustomTag } from './feature/CustomTag/CustomTag.vue'

// 時間線
export type {
  Custom as TimeLineCustom,
  Props as TimeLineProps
} from './feature/CustomTimeLine/CustomTimeLineInfo'
export { default as CustomTimeLine } from './feature/CustomTimeLine/CustomTimeLine.vue'

// 彈出 文字提示
export type { Props as TooltipProps } from './feature/CustomTooltip/CustomTooltipInfo'
export { default as CustomTooltip } from './feature/CustomTooltip/CustomTooltip.vue'

// 樹狀
export type {
  Custom as TreeCustom,
  Props as TreeProps,
  Emits as TreeEmits,
  Expose as TreeExpose
} from './feature/CustomTree/CustomTreeInfo'
export { default as CustomTree } from './feature/CustomTree/CustomTree.vue'

// 虛擬樹狀
export type {
  Custom as TreeV2Custom,
  Props as TreeV2Props,
  Emits as TreeV2Emits,
  Expose as TreeV2Expose
} from './feature/CustomTreeV2/CustomTreeV2Info'
export { default as CustomTreeV2 } from './feature/CustomTreeV2/CustomTreeV2.vue'

// 檔案上傳
export { default as CustomUpload } from './feature/CustomUpload/CustomUpload.vue'

// 浮水印
export { default as CustomWatermark } from './feature/CustomWatermark/CustomWatermark.vue'

// 過濾
export { default as SimpleFilter } from './feature/SimpleFilter/SimpleFilter'

// 表格
export { default as SimpleTable } from './feature/SimpleTable/SimpleTable.vue'

// QRcode
export { default as SimpleQRcode } from './feature/SimpleQRcode/SimpleQRcode.vue'

// form
export type { FetchSuggestions } from './form/FormAutocomplete.vue'
export { default as FormAutocomplete } from './form/FormAutocomplete.vue'

export { default as FormCheckbox } from './form/FormCheckbox.vue'

export type { Shortcuts, DatePickerType } from './form/FormDatePicker.vue'
export { default as FormDatePicker } from './form/FormDatePicker.vue'

export declare interface FormInputExpose {
  key: string
  value: Ref<string>
  handleReset: () => void
  validate: (opts?: Partial<ValidationOptions>) => Promise<ValidationResult>
  setvalidateKey: (validateKey: string) => void
  getDom: () => Element
}

export { default as FormInput } from './form/FormInput.vue'

export { default as FormOperator } from './form/FormOperator.vue'

export { default as FormRadio } from './form/FormRadio.vue'

export type { Options as FormSelectOptions } from './form/FormSelect.vue'
export { default as FormSelect } from './form/FormSelect.vue'
export { default as FormSelectV2 } from './form/FormSelectV2.vue'

export type { TimePickerType } from './form/FormTimePicker.vue'
export { default as FormTimePicker } from './form/FormTimePicker.vue'

export { default as FormList } from './form/FormList.vue'

export { default as WebViewTable } from './views/WebViewTable/WebViewTable.vue'
