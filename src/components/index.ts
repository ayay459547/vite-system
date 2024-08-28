import type { Ref } from 'vue'
// import { defineAsyncComponent } from 'vue'
import type { ValidationOptions, ValidationResult } from 'vee-validate'
import { useAsyncComponent } from '@/lib/lib_hook'
// 通用
export type CustomSize = 'large' | 'default' | 'small'
export type CustomElType = '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type { Option, Options } from '@/declare/columnSetting'

// 圖表類
export const CustomCharts = useAsyncComponent(() => import('./chart/CustomCharts/CustomCharts.vue'), 'rect')

export const GanttChart = useAsyncComponent(() => import('./chart/GanttChart/GanttChart.vue'), 'rect')

export const WeekSchedule = useAsyncComponent(() => import('./chart/WeekSchedule/WeekSchedule.vue'), 'rect')

// 專案功能組件

// 區塊右上方顯示 數字/圖示/其他
export type { Props as BadgeProps } from './feature/CustomBadge/CustomBadgeInfo'
export const CustomBadge = useAsyncComponent(() => import('./feature/CustomBadge/CustomBadge.vue'), 'caption')

// 按鈕
export type {
  Props as ButtonProps,
  Emits as ButtonEmits
} from './feature/CustomButton/CustomButtonInfo'
export { default as CustomButton } from './feature/CustomButton/CustomButton.vue'

// 卡片
export type { Props as CardProps } from './feature/CustomCard/CustomCardInfo'
export const CustomCard = useAsyncComponent(() => import('./feature/CustomCard/CustomCard.vue'), 'rect')

// 輪播
export type { CarouselItem as CarouselItem } from './feature/CustomCarousel/CustomCarouselInfo'
export const CustomCarousel = useAsyncComponent(() => import('./feature/CustomCarousel/CustomCarousel.vue'), 'rect')

// 展開/縮起 區塊
export type {
  Custom as CollapseCustom,
  Props as CollapseProps,
  Emits as CollapseEmits
} from './feature/CustomCollapse/CustomCollapseInfo'
export const CustomCollapse = useAsyncComponent(() => import('./feature/CustomCollapse/CustomCollapse.vue'), 'rect')

// 棄用 CustomModal 代替
export type { Props as DialogProps } from './feature/CustomDialog/CustomDialogInfo'
export const CustomDialog = useAsyncComponent(() => import('./feature/CustomDialog/CustomDialog.vue'), 'p')

// 分隔線
export type { Props as DividerProps } from './feature/CustomDivider/CustomDividerInfo'
export const CustomDivider = useAsyncComponent(() => import('./feature/CustomDivider/CustomDivider.vue'), 'p')

// 分隔檢視
export type { Props as DividerViewProps } from './feature/CustomDividerView/CustomDividerViewInfo'
export const CustomDividerView = useAsyncComponent(() => import('./feature/CustomDividerView/CustomDividerView.vue'), 'rect')

// 拖拉
export type {
  Custom as DraggableCustom,
  Props as DraggableProps,
  Emits as DraggableEmits
} from './feature/CustomDraggable/CustomDraggableInfo'
export const CustomDraggable = useAsyncComponent(() => import('./feature/CustomDraggable/CustomDraggable.vue'), 'rect')

// 從銀幕外插入畫面
export type {
  Props as DrawerProps,
  Emits as DrawerEmits
} from './feature/CustomDrawer/CustomDrawerInfo'
export const CustomDrawer = useAsyncComponent(() => import('./feature/CustomDrawer/CustomDrawer.vue'), 'p')

// 無資料
export type { Props as EmptyProps } from './feature/CustomEmpty/CustomEmptyInfo'
export const CustomEmpty = useAsyncComponent(() => import('./feature/CustomEmpty/CustomEmpty.vue'), 'rect')

// 圖示
export type {
  Custom as IconCustom,
  Props as IconProps
} from './feature/CustomIcon/CustomIconInfo'
export { default as CustomIcon } from './feature/CustomIcon/CustomIcon.vue'

// 圖片
export type {
  Props as ImageProps,
  Emits as ImageEmits
} from './feature/CustomImage/CustomImageInfo'
export const CustomImage = useAsyncComponent(() => import('./feature/CustomImage/CustomImage.vue'), 'image')

// 跳轉用組件
export type {
  Custom as LinkCustom,
  Props as LinkProps
} from './feature/CustomLink/CustomLinkInfo'
export const CustomLink = useAsyncComponent(() => import('./feature/CustomLink/CustomLink.vue'), 'caption')

// 鎖定
export type {
  Props as LockViewProps
} from './feature/CustomLockView/CustomLockViewInfo'
export const CustomLockView = useAsyncComponent(() => import('./feature/CustomLockView/CustomLockView.vue'), 'rect')

// .md
export type { Props as MarkdownProps } from './feature/CustomMarkdown/CustomMarkdownInfo'
export const CustomMarkdown = useAsyncComponent(() => import('./feature/CustomMarkdown/CustomMarkdown.vue'), 'rect')

// 彈窗
export type {
  Custom as ModalCustom,
  Props as ModalProps,
  Emits as ModalEmits
} from './feature/CustomModal/CustomModalInfo'
export const CustomModal = useAsyncComponent(() => import('./feature/CustomModal/CustomModal.vue'), 'p')

// 彈出 區塊提示
export type { Props as PopoverProps } from './feature/CustomPopover/CustomPopoverInfo'
export const CustomPopover = useAsyncComponent(() => import('./feature/CustomPopover/CustomPopover.vue'), 'p')

// 進度條
export type {
  Custom as ProgressCustom,
  Props as ProgressProps
} from './feature/CustomProgress/CustomProgressInfo'
export const CustomProgress = useAsyncComponent(() => import('./feature/CustomProgress/CustomProgress.vue'), 'rect')

// 滾輪
export type {
  Custom as ScrollbarCustom,
  Props as ScrollbarProps,
  Emits as ScrollbarEmits,
  Expose as ScrollbarExpose
} from './feature/CustomScrollbar/CustomScrollbarInfo'
export { default as CustomScrollbar } from './feature/CustomScrollbar/CustomScrollbar.vue'

// 步驟
export type {
  Custom as StepsCustom,
  Props as StepsProps
} from './feature/CustomSteps/CustomStepsInfo'
export const CustomSteps = useAsyncComponent(() => import('./feature/CustomSteps/CustomSteps.vue'), 'rect')

// 分頁
export type {
  Props as TabsProps,
  Emits as TabsEmits
} from './feature/CustomTabs/CustomTabsInfo'
export const CustomTabs = useAsyncComponent(() => import('./feature/CustomTabs/CustomTabs.vue'), 'h1')

// 類似按鈕的標籤
export type {
  Props as TagProps,
  Emits as TagEmits
} from './feature/CustomTag/CustomTagInfo'
export const CustomTag = useAsyncComponent(() => import('./feature/CustomTag/CustomTag.vue'), 'caption')

// 時間線
export type {
  Custom as TimeLineCustom,
  Props as TimeLineProps
} from './feature/CustomTimeLine/CustomTimeLineInfo'
export const CustomTimeLine = useAsyncComponent(() => import('./feature/CustomTimeLine/CustomTimeLine.vue'), 'rect')

// 彈出 文字提示
export type { Props as TooltipProps } from './feature/CustomTooltip/CustomTooltipInfo'
export const CustomTooltip = useAsyncComponent(() => import('./feature/CustomTooltip/CustomTooltip.vue'), 'p')

// 引導
export type {
  Custom as TourCustom,
  Props as TourProps
} from './feature/CustomTour/CustomTourInfo'
export const CustomTour = useAsyncComponent(() => import('./feature/CustomTour/CustomTour.vue'), 'p')

// 樹狀
export type {
  Custom as TreeCustom,
  Props as TreeProps,
  Emits as TreeEmits,
  Expose as TreeExpose
 } from './feature/CustomTree/CustomTreeInfo'
export const CustomTree = useAsyncComponent(() => import('./feature/CustomTree/CustomTree.vue'), 'rect')

// 虛擬樹狀
export type {
  Custom as TreeV2Custom,
  Props as TreeV2Props,
  Emits as TreeV2Emits,
  Expose as TreeV2Expose
 } from './feature/CustomTreeV2/CustomTreeV2Info'
export const CustomTreeV2 = useAsyncComponent(() => import('./feature/CustomTreeV2/CustomTreeV2.vue'), 'rect')

// 浮水印
export const CustomWatermark = useAsyncComponent(() => import('./feature/CustomWatermark/CustomWatermark.vue'), 'rect')

// 選色器
export type {
  Custom as ColorCustom,
  Props as ColorProps,
  Emits as ColorEmits
} from './feature/CustomColor/CustomColorInfo'
export const CustomColor = useAsyncComponent(() => import('./feature/CustomColor/CustomColor.vue'), 'rect')

// QRcode
// export const SimpleQRcode = useAsyncComponent(() => import('./feature/SimpleQRcode/SimpleQRcode.vue'), 'rect')
export { default as SimpleQRcode } from './feature/SimpleQRcode/SimpleQRcode.vue'

// input

// 輸入框
export type {
  ModelValue as InputModelValue,
  InputType
} from './input/CustomInput/CustomInputInfo'
export { default as CustomInput } from './input/CustomInput/CustomInput.vue'

// 搜尋用組件
export { default as CustomSearch } from './input/CustomSearch/CustomSearch.vue'

// GroupSearch 需搭配 CustomSearch 或 CustomInput 使用
export const GroupSearch = useAsyncComponent(() => import('./input/CustomSearch/GroupSearch.vue'), 'p')

// 切換鈕
export type {
  Custom as SwitchCustom,
  Props as SwitchProps,
  Emits as SwitchEmits
} from './input/CustomSwitch/CustomSwitchInfo'
export const CustomSwitch = useAsyncComponent(() => import('./input/CustomSwitch/CustomSwitch.vue'), 'button')

// 檔案上傳
export const CustomUpload = useAsyncComponent(() => import('./input/CustomUpload/CustomUpload.vue'), 'rect')

// 過濾
export const SimpleFilter = useAsyncComponent(() => import('./input/SimpleFilter/SimpleFilter.vue'), 'p')

export type { FetchSuggestions } from './input/FormAutocomplete.vue'
export const FormAutocomplete = useAsyncComponent(() => import('./input/FormAutocomplete.vue'), 'h1')

export const FormCheckbox = useAsyncComponent(() => import('./input/FormCheckbox.vue'), 'h1')

export type { Shortcuts, DatePickerType } from './input/FormDatePicker.vue'
export const FormDatePicker = useAsyncComponent(() => import('./input/FormDatePicker.vue'), 'h1')

export declare interface FormInputExpose {
  key: string
  value: Ref<string>
  handleReset: () => void
  validate: (opts?: Partial<ValidationOptions>) => Promise<ValidationResult>
  setvalidateKey: (validateKey: string) => void
  getDom: () => Element
}

export const FormInput = useAsyncComponent(() => import('./input/FormInput.vue'), 'h1')

export const FormOperator = useAsyncComponent(() => import('./input/FormOperator.vue'), 'h1')

export const FormRadio = useAsyncComponent(() => import('./input/FormRadio.vue'), 'h1')

export type { Options as FormSelectOptions } from './input/FormSelect.vue'
export const FormSelect = useAsyncComponent(() => import('./input/FormSelect.vue'), 'h1')

export const FormSelectV2 = useAsyncComponent(() => import('./input/FormSelectV2.vue'), 'h1')

export type { TimePickerType } from './input/FormTimePicker.vue'
export const FormTimePicker = useAsyncComponent(() => import('./input/FormTimePicker.vue'), 'h1')

export const FormList = useAsyncComponent(() => import('./input/FormList.vue'), 'h1')

// table

/**
 * 表格
 */
export { default as TableMain } from './table/CustomTable/TableMain.vue'

/**
 * 虛擬表格
 */
export const CustomTableV2 = useAsyncComponent(() => import('./table/CustomTableV2/CustomTableV2.vue'), 'rect')

/**
 * 專案用表格
 * 功能:
 * 紀錄欄位設定
 * 提供分頁
 */
import type { TableParams, PageChange } from './table/CustomTable/CustomTableInfo'
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
} from './table/CustomTable/CustomTableInfo'
export { default as CustomTable } from './table/CustomTable/CustomTable.vue'

/**
 * 簡易表格
 * 功能:
 * 可拖拉
 */
export const SimpleTable = useAsyncComponent(() => import('./table/SimpleTable/SimpleTable.vue'), 'rect')

/**
 * Vxe Table
 * 功能:
 * 更加高效的渲染
 */
export const VxeColgroup = useAsyncComponent(() => import('./table/VxeTable/VxeColgroup.vue'), 'h1')
export const VxeColumn = useAsyncComponent(() => import('./table/VxeTable/VxeColumn.vue'), 'h1')
export const VxeTable = useAsyncComponent(() => import('./table/VxeTable/VxeTable.vue'), 'rect')

/**
 * 專案用特殊表格
 * 需配合後端
 * 功能:
 * 多欄位排序
 * 多欄位搜尋
 * 進階搜尋
 */
export const WebViewTable = useAsyncComponent(() => import('./table/WebViewTable/WebViewTable.vue'), 'rect')
