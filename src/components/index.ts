import type { Ref } from 'vue'
// import { defineAsyncComponent } from 'vue'
import type { ValidationOptions, ValidationResult } from 'vee-validate'
import { useAsyncComponent } from '@/lib/lib_hook'
// 通用
export type CustomSize = 'large' | 'default' | 'small'
export type CustomElType = '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type { Option, Options } from '@/declare/columnSetting'

// 圖表類
export const CustomCharts = useAsyncComponent(() => import('./chart/CustomCharts/CustomCharts.vue'))

export const GanttChart = useAsyncComponent(() => import('./chart/GanttChart/GanttChart.vue'))

export const WeekSchedule = useAsyncComponent(() => import('./chart/WeekSchedule/WeekSchedule.vue'))

// 專案功能組件

// 區塊右上方顯示 數字/圖示/其他
export type { Props as BadgeProps } from './feature/CustomBadge/CustomBadgeInfo'
export const CustomBadge = useAsyncComponent(() => import('./feature/CustomBadge/CustomBadge.vue'))

// 按鈕
export type {
  Props as ButtonProps,
  Emits as ButtonEmits
} from './feature/CustomButton/CustomButtonInfo'
export const CustomButton = useAsyncComponent(() => import('./feature/CustomButton/CustomButton.vue'))

// 卡片
export type { Props as CardProps } from './feature/CustomCard/CustomCardInfo'
export const CustomCard = useAsyncComponent(() => import('./feature/CustomCard/CustomCard.vue'))

// 輪播
export type { CarouselItem as CarouselItem } from './feature/CustomCarousel/CustomCarouselInfo'
export const CustomCarousel = useAsyncComponent(() => import('./feature/CustomCarousel/CustomCarousel.vue'))

// 展開/縮起 區塊
export type {
  Custom as CollapseCustom,
  Props as CollapseProps,
  Emits as CollapseEmits
} from './feature/CustomCollapse/CustomCollapseInfo'
export const CustomCollapse = useAsyncComponent(() => import('./feature/CustomCollapse/CustomCollapse.vue'))

// 棄用 CustomModal 代替
export type { Props as DialogProps } from './feature/CustomDialog/CustomDialogInfo'
export const CustomDialog = useAsyncComponent(() => import('./feature/CustomDialog/CustomDialog.vue'))

// 分隔線
export type { Props as DividerProps } from './feature/CustomDivider/CustomDividerInfo'
export const CustomDivider = useAsyncComponent(() => import('./feature/CustomDivider/CustomDivider.vue'))

// 分隔檢視
export type { Props as DividerViewProps } from './feature/CustomDividerView/CustomDividerViewInfo'
export const CustomDividerView = useAsyncComponent(() => import('./feature/CustomDividerView/CustomDividerView.vue'))

// 拖拉
export type {
  Custom as DraggableCustom,
  Props as DraggableProps,
  Emits as DraggableEmits
} from './feature/CustomDraggable/CustomDraggableInfo'
export const CustomDraggable = useAsyncComponent(() => import('./feature/CustomDraggable/CustomDraggable.vue'))

// 從銀幕外插入畫面
export type {
  Props as DrawerProps,
  Emits as DrawerEmits
} from './feature/CustomDrawer/CustomDrawerInfo'
export const CustomDrawer = useAsyncComponent(() => import('./feature/CustomDrawer/CustomDrawer.vue'))

// 無資料
export type { Props as EmptyProps } from './feature/CustomEmpty/CustomEmptyInfo'
export const CustomEmpty = useAsyncComponent(() => import('./feature/CustomEmpty/CustomEmpty.vue'))

// 圖示
export type {
  Custom as IconCustom,
  Props as IconProps
} from './feature/CustomIcon/CustomIconInfo'
// 系統一開始就有用到 不使用useAsyncComponent
export { default as CustomIcon } from './feature/CustomIcon/CustomIcon.vue'

// 圖片
export type {
  Props as ImageProps,
  Emits as ImageEmits
} from './feature/CustomImage/CustomImageInfo'
export const CustomImage = useAsyncComponent(() => import('./feature/CustomImage/CustomImage.vue'))

// 輸入框
export type {
  ModelValue as InputModelValue,
  InputType
} from './feature/CustomInput/CustomInputInfo'
export { default as CustomInput } from './feature/CustomInput/CustomInput'

// 跳轉用組件
export type {
  Custom as LinkCustom,
  Props as LinkProps
} from './feature/CustomLink/CustomLinkInfo'
export const CustomLink = useAsyncComponent(() => import('./feature/CustomLink/CustomLink.vue'))

// 鎖定
export type {
  Props as LockViewProps
} from './feature/CustomLockView/CustomLockViewInfo'
export const CustomLockView = useAsyncComponent(() => import('./feature/CustomLockView/CustomLockView.vue'))

// .md
export type { Props as MarkdownProps } from './feature/CustomMarkdown/CustomMarkdownInfo'
export const CustomMarkdown = useAsyncComponent(() => import('./feature/CustomMarkdown/CustomMarkdown.vue'))

// 彈窗
export type {
  Custom as ModalCustom,
  Props as ModalProps,
  Emits as ModalEmits
} from './feature/CustomModal/CustomModalInfo'
export const CustomModal = useAsyncComponent(() => import('./feature/CustomModal/CustomModal.vue'))

// 彈出 區塊提示
export type { Props as PopoverProps } from './feature/CustomPopover/CustomPopoverInfo'
export const CustomPopover = useAsyncComponent(() => import('./feature/CustomPopover/CustomPopover.vue'))

// 進度條
export type {
  Custom as ProgressCustom,
  Props as ProgressProps
} from './feature/CustomProgress/CustomProgressInfo'
export const CustomProgress = useAsyncComponent(() => import('./feature/CustomProgress/CustomProgress.vue'))

// 滾輪
export type {
  Custom as ScrollbarCustom,
  Props as ScrollbarProps,
  Emits as ScrollbarEmits,
  Expose as ScrollbarExpose
} from './feature/CustomScrollbar/CustomScrollbarInfo'
export const CustomScrollbar = useAsyncComponent(() => import('./feature/CustomScrollbar/CustomScrollbar.vue'))

// 搜尋用組件
export const CustomSearch = useAsyncComponent(() => import('./feature/CustomSearch/CustomSearch.vue'))

// GroupSearch 需搭配 CustomSearch 或 CustomInput 使用
export const GroupSearch = useAsyncComponent(() => import('./feature/CustomSearch/GroupSearch.vue'))

// 步驟
export type {
  Custom as StepsCustom,
  Props as StepsProps
} from './feature/CustomSteps/CustomStepsInfo'
export const CustomSteps = useAsyncComponent(() => import('./feature/CustomSteps/CustomSteps.vue'))

// 切換鈕
export type {
  Custom as SwitchCustom,
  Props as SwitchProps,
  Emits as SwitchEmits
} from './feature/CustomSwitch/CustomSwitchInfo'
export const CustomSwitch = useAsyncComponent(() => import('./feature/CustomSwitch/CustomSwitch.vue'))

// 表格
export const TableMain = useAsyncComponent(() => import('./feature/CustomTable/TableMain.vue'))
// 虛擬表格
export const CustomTableV2 = useAsyncComponent(() => import('./feature/CustomTableV2/CustomTableV2.vue'))

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
export const CustomTable = useAsyncComponent(() => import('./feature/CustomTable/CustomTable.vue'))

// 分頁
export type {
  Props as TabsProps,
  Emits as TabsEmits
} from './feature/CustomTabs/CustomTabsInfo'
export const CustomTabs = useAsyncComponent(() => import('./feature/CustomTabs/CustomTabs.vue'))

// 類似按鈕的標籤
export type {
  Props as TagProps,
  Emits as TagEmits
} from './feature/CustomTag/CustomTagInfo'
export const CustomTag = useAsyncComponent(() => import('./feature/CustomTag/CustomTag.vue'))

// 時間線
export type {
  Custom as TimeLineCustom,
  Props as TimeLineProps
} from './feature/CustomTimeLine/CustomTimeLineInfo'
export const CustomTimeLine = useAsyncComponent(() => import('./feature/CustomTimeLine/CustomTimeLine.vue'))

// 彈出 文字提示
export type { Props as TooltipProps } from './feature/CustomTooltip/CustomTooltipInfo'
export const CustomTooltip = useAsyncComponent(() => import('./feature/CustomTooltip/CustomTooltip.vue'))

// 引導
export type {
  Custom as TourCustom,
  Props as TourProps
} from './feature/CustomTour/CustomTourInfo'
export const CustomTour = useAsyncComponent(() => import('./feature/CustomTour/CustomTour.vue'))

// 樹狀
export type {
  Custom as TreeCustom,
  Props as TreeProps,
  Emits as TreeEmits,
  Expose as TreeExpose
 } from './feature/CustomTree/CustomTreeInfo'
export const CustomTree = useAsyncComponent(() => import('./feature/CustomTree/CustomTree.vue'))

// 虛擬樹狀
export type {
  Custom as TreeV2Custom,
  Props as TreeV2Props,
  Emits as TreeV2Emits,
  Expose as TreeV2Expose
 } from './feature/CustomTreeV2/CustomTreeV2Info'
export const CustomTreeV2 = useAsyncComponent(() => import('./feature/CustomTreeV2/CustomTreeV2.vue'))

// 檔案上傳
export const CustomUpload = useAsyncComponent(() => import('./feature/CustomUpload/CustomUpload.vue'))

// 浮水印
export const CustomWatermark = useAsyncComponent(() => import('./feature/CustomWatermark/CustomWatermark.vue'))

// 過濾
export const SimpleFilter = useAsyncComponent(() => import('./feature/SimpleFilter/SimpleFilter'))

// 表格
export const SimpleTable = useAsyncComponent(() => import('./feature/SimpleTable/SimpleTable.vue'))

// QRcode
export const SimpleQRcode = useAsyncComponent(() => import('./feature/SimpleQRcode/SimpleQRcode.vue'))

// form
export type { FetchSuggestions } from './form/FormAutocomplete.vue'
export const FormAutocomplete = useAsyncComponent(() => import('./form/FormAutocomplete.vue'))

export const FormCheckbox = useAsyncComponent(() => import('./form/FormCheckbox.vue'))

export type { Shortcuts, DatePickerType } from './form/FormDatePicker.vue'
export const FormDatePicker = useAsyncComponent(() => import('./form/FormDatePicker.vue'))

export declare interface FormInputExpose {
  key: string
  value: Ref<string>
  handleReset: () => void
  validate: (opts?: Partial<ValidationOptions>) => Promise<ValidationResult>
  setvalidateKey: (validateKey: string) => void
  getDom: () => Element
}

export const FormInput = useAsyncComponent(() => import('./form/FormInput.vue'))

export const FormOperator = useAsyncComponent(() => import('./form/FormOperator.vue'))

export const FormRadio = useAsyncComponent(() => import('./form/FormRadio.vue'))

export type { Options as FormSelectOptions } from './form/FormSelect.vue'
export const FormSelect = useAsyncComponent(() => import('./form/FormSelect.vue'))

export const FormSelectV2 = useAsyncComponent(() => import('./form/FormSelectV2.vue'))

export type { TimePickerType } from './form/FormTimePicker.vue'
export const FormTimePicker = useAsyncComponent(() => import('./form/FormTimePicker.vue'))

export const FormList = useAsyncComponent(() => import('./form/FormList.vue'))

export const WebViewTable = useAsyncComponent(() => import('./views/WebViewTable/WebViewTable.vue'))
