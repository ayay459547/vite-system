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
export type {
  Custom as BadgeCustom,
  Props as BadgeProps,
  Emits as BadgeEmits,
  Expose as BadgeExpose
} from './feature/CustomBadge/CustomBadgeInfo'
export const CustomBadge = useAsyncComponent(() => import('./feature/CustomBadge/CustomBadge.vue'), 'caption')

// 按鈕
export type {
  Custom as ButtonCustom,
  Props as ButtonProps,
  Emits as ButtonEmits,
  Expose as ButtonExpose
} from './feature/CustomButton/CustomButtonInfo'
export { default as CustomButton } from './feature/CustomButton/CustomButton.vue'

// 卡片
export type {
  Custom as CardCustom,
  Props as CardProps,
  Emits as CardEmits,
  Expose as CardExpose
} from './feature/CustomCard/CustomCardInfo'
export const CustomCard = useAsyncComponent(() => import('./feature/CustomCard/CustomCard.vue'), 'rect')

// 輪播
export type {
  Custom as CarouselCustom,
  Props as CarouselProps,
  Emits as CarouselEmits,
  Expose as CarouselExpose
} from './feature/CustomCarousel/CustomCarouselInfo'
export const CustomCarousel = useAsyncComponent(() => import('./feature/CustomCarousel/CustomCarousel.vue'), 'rect')

// 展開/縮起 區塊
export type {
  Custom as CollapseCustom,
  Props as CollapseProps,
  Emits as CollapseEmits,
  Expose as CollapseExpose
} from './feature/CustomCollapse/CustomCollapseInfo'
export const CustomCollapse = useAsyncComponent(() => import('./feature/CustomCollapse/CustomCollapse.vue'), 'rect')

// 棄用 CustomModal 代替
export type {
  Custom as DialogCustom,
  Props as DialogProps,
  Emits as DialogEmits,
  Expose as DialogExpose
} from './feature/CustomDialog/CustomDialogInfo'
export const CustomDialog = useAsyncComponent(() => import('./feature/CustomDialog/CustomDialog.vue'), 'p')

// 分隔線
export type {
  Custom as DividerCustom,
  Props as DividerProps,
  Emits as DividerEmits,
  Expose as DividerExpose
} from './feature/CustomDivider/CustomDividerInfo'
export const CustomDivider = useAsyncComponent(() => import('./feature/CustomDivider/CustomDivider.vue'), 'p')

// 分隔檢視
export type {
  Custom as DividerViewCustom,
  Props as DividerViewProps,
  Emits as DividerViewEmits,
  Expose as DividerViewExpose
} from './feature/CustomDividerView/CustomDividerViewInfo'
export const CustomDividerView = useAsyncComponent(() => import('./feature/CustomDividerView/CustomDividerView.vue'), 'rect')

// 拖拉
export type {
  Custom as DraggableCustom,
  Props as DraggableProps,
  Emits as DraggableEmits,
  Expose as DraggableExpose
} from './feature/CustomDraggable/CustomDraggableInfo'
export const CustomDraggable = useAsyncComponent(() => import('./feature/CustomDraggable/CustomDraggable.vue'), 'rect')

// 從銀幕外插入畫面
export type {
  Custom as DrawerCustom,
  Props as DrawerProps,
  Emits as DrawerEmits,
  Expose as DrawerExpose
} from './feature/CustomDrawer/CustomDrawerInfo'
export const CustomDrawer = useAsyncComponent(() => import('./feature/CustomDrawer/CustomDrawer.vue'), 'p')

// 無資料
export type {
  Custom as EmptyCustom,
  Props as EmptyProps,
  Emits as EmptyEmits,
  Expose as EmptyExpose
} from './feature/CustomEmpty/CustomEmptyInfo'
export const CustomEmpty = useAsyncComponent(() => import('./feature/CustomEmpty/CustomEmpty.vue'), 'rect')

// 圖示
export type {
  Custom as IconCustom,
  Props as IconProps,
  Emits as IconEmits,
  Expose as IconExpose
} from './feature/CustomIcon/CustomIconInfo'
export { default as CustomIcon } from './feature/CustomIcon/CustomIcon.vue'

// 圖片
export type {
  Custom as ImageCustom,
  Props as ImageProps,
  Emits as ImageEmits,
  Expose as ImageExpose
} from './feature/CustomImage/CustomImageInfo'
export const CustomImage = useAsyncComponent(() => import('./feature/CustomImage/CustomImage.vue'), 'image')

// 跳轉用組件
export type {
  Custom as LinkCustom,
  Props as LinkProps,
  Emits as LinkEmits,
  Expose as LinkExpose
} from './feature/CustomLink/CustomLinkInfo'
export const CustomLink = useAsyncComponent(() => import('./feature/CustomLink/CustomLink.vue'), 'caption')

// 鎖定
export type {
  Custom as LockViewCustom,
  Props as LockViewProps,
  Emits as LockViewEmits,
  Expose as LockViewExpose
} from './feature/CustomLockView/CustomLockViewInfo'
export const CustomLockView = useAsyncComponent(() => import('./feature/CustomLockView/CustomLockView.vue'), 'rect')

// .md
export type {
  Custom as MarkdownCustom,
  Props as MarkdownProps,
  Emits as MarkdownEmits,
  Expose as MarkdownExpose
} from './feature/CustomMarkdown/CustomMarkdownInfo'
export const CustomMarkdown = useAsyncComponent(() => import('./feature/CustomMarkdown/CustomMarkdown.vue'), 'rect')

// 彈窗
export type {
  Custom as ModalCustom,
  Props as ModalProps,
  Emits as ModalEmits,
  Expose as ModalExpose
} from './feature/CustomModal/CustomModalInfo'
export const CustomModal = useAsyncComponent(() => import('./feature/CustomModal/CustomModal.vue'), 'p')

// 彈出 區塊提示
export type {
  Custom as PopoverCustom,
  Props as PopoverProps,
  Emits as PopoverEmits,
  Expose as PopoverExpose
} from './feature/CustomPopover/CustomPopoverInfo'
export const CustomPopover = useAsyncComponent(() => import('./feature/CustomPopover/CustomPopover.vue'), 'p')

// 進度條
export type {
  Custom as ProgressCustom,
  Props as ProgressProps,
  Emits as ProgressEmits,
  Expose as ProgressExpose
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
  Props as StepsProps,
  Emits as StepsEmits,
  Expose as StepsExpose
} from './feature/CustomSteps/CustomStepsInfo'
export const CustomSteps = useAsyncComponent(() => import('./feature/CustomSteps/CustomSteps.vue'), 'rect')

// 分頁
export type {
  Custom as TabsCustom,
  Props as TabsProps,
  Emits as TabsEmits,
  Expose as TabsExpose
} from './feature/CustomTabs/CustomTabsInfo'
export const CustomTabs = useAsyncComponent(() => import('./feature/CustomTabs/CustomTabs.vue'), 'h1')

// 類似按鈕的標籤
export type {
  Custom as TagCustom,
  Props as TagProps,
  Emits as TagEmits,
  Expose as TagExpose
} from './feature/CustomTag/CustomTagInfo'
export const CustomTag = useAsyncComponent(() => import('./feature/CustomTag/CustomTag.vue'), 'caption')

// 時間線
export type {
  Custom as TimeLineCustom,
  Props as TimeLineProps,
  Emits as TimeLineEmits,
  Expose as TimeLineExpose
} from './feature/CustomTimeLine/CustomTimeLineInfo'
export const CustomTimeLine = useAsyncComponent(() => import('./feature/CustomTimeLine/CustomTimeLine.vue'), 'rect')

// 彈出 文字提示
export type {
  Custom as TooltipCustom,
  Props as TooltipProps,
  Emits as TooltipEmits,
  Expose as TooltipExpose
} from './feature/CustomTooltip/CustomTooltipInfo'
export const CustomTooltip = useAsyncComponent(() => import('./feature/CustomTooltip/CustomTooltip.vue'), 'p')

// 引導
export type {
  Custom as TourCustom,
  Props as TourProps,
  Emits as TourEmits,
  Expose as TourExpose
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
  Emits as ColorEmits,
  Expose as ColorExpose
} from './feature/CustomColor/CustomColorInfo'
export const CustomColor = useAsyncComponent(() => import('./feature/CustomColor/CustomColor.vue'), 'rect')

// QRcode
export type {
  Custom as QRcodeCustom,
  Props as QRcodeProps,
  Emits as QRcodeEmits,
  Expose as QRcodeExpose
} from './feature/SimpleQRcode/SimpleQRcodeInfo'
export { default as SimpleQRcode } from './feature/SimpleQRcode/SimpleQRcode.vue'

// input

// 輸入框
export type {
  Custom as InputCustom,
  Props as InputProps,
  Emits as InputEmits,
  Expose as InputExpose
} from './input/CustomInput/CustomInputInfo'
export { default as CustomInput } from './input/CustomInput/CustomInput.vue'

// 搜尋用組件
export type {
  Custom as SearchCustom,
  Props as SearchProps,
  Emits as SearchEmits,
  Expose as SearchExpose
} from './input/CustomSearch/CustomSearchInfo'
export { default as CustomSearch } from './input/CustomSearch/CustomSearch.vue'

// GroupSearch 需搭配 CustomSearch 或 CustomInput 使用
export type {
  Custom as GroupSearchCustom,
  Props as GroupSearchProps,
  Emits as GroupSearchEmits,
  Expose as GroupSearchExpose
} from './input/CustomSearch/CustomSearchInfo'
export const GroupSearch = useAsyncComponent(() => import('./input/CustomSearch/GroupSearch.vue'), 'p')

// 切換鈕
export type {
  Custom as SwitchCustom,
  Props as SwitchProps,
  Emits as SwitchEmits,
  Expose as SwitchExpose
} from './input/CustomSwitch/CustomSwitchInfo'
export const CustomSwitch = useAsyncComponent(() => import('./input/CustomSwitch/CustomSwitch.vue'), 'button')

// 檔案上傳
export type {
  Custom as UploadCustom,
  Props as UploadProps,
  Emits as UploadEmits,
  Expose as UploadExpose
} from './input/CustomUpload/CustomUploadInfo'
export const CustomUpload = useAsyncComponent(() => import('./input/CustomUpload/CustomUpload.vue'), 'rect')

// 過濾
export type {
  Custom as SimpleFilterCustom,
  Props as SimpleFilterProps,
  Emits as SimpleFilterEmits,
  Expose as SimpleFilterExpose
} from './input/SimpleFilter/SimpleFilterInfo'
export const SimpleFilter = useAsyncComponent(() => import('./input/SimpleFilter/SimpleFilter.vue'), 'p')

// 時間維度切換
export type {
  Custom as TimeLevelManagementCustom,
  Props as TimeLevelManagementProps,
  Emits as TimeLevelManagementEmits,
  Expose as TimeLevelManagementExpose
} from './input/TimeLevelManagement/TimeLevelManagementInfo'
export { default as TimeLevelManagement } from './input/TimeLevelManagement/TimeLevelManagement.vue'

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
 * 專案用表格
 * 功能:
 * 紀錄欄位設定
 * 提供分頁
 */
export type {
  Custom as TableCustom,
  Props as TableProps,
  Emits as TableEmits,
  Expose as TableExpose
} from './table/CustomTable/CustomTableInfo'
export { default as CustomTable } from './table/CustomTable/CustomTable.vue'

/**
 * 虛擬表格
 */
export type {
  Custom as TableV2Custom,
  Props as TableV2Props,
  Emits as TableV2Emits,
  Expose as TableV2Expose
} from './table/CustomTable/CustomTableInfo'
export const CustomTableV2 = useAsyncComponent(() => import('./table/CustomTableV2/CustomTableV2.vue'), 'rect')

/**
 * 簡易表格
 * 功能:
 * 可拖拉
 */
export type {
  Custom as SimpleTableCustom,
  Props as SimpleTableProps,
  Emits as SimpleTableEmits,
  Expose as SimpleTableExpose
} from './table/CustomTable/CustomTableInfo'
export const SimpleTable = useAsyncComponent(() => import('./table/SimpleTable/SimpleTable.vue'), 'rect')

/**
 * Vxe Table
 * 功能:
 * 更加高效的渲染
 */
export const VxeColgroup = useAsyncComponent(() => import('./table/VxeTable/VxeColgroup.vue'), 'h1')
export const VxeColumn = useAsyncComponent(() => import('./table/VxeTable/VxeColumn.vue'), 'h1')
export type {
  Custom as VxeTableCustom,
  Props as VxeTableProps,
  Emits as VxeTableEmits,
  Expose as VxeTableExpose
} from './table/VxeTable/VxeTableInfo'
export const VxeTable = useAsyncComponent(() => import('./table/VxeTable/VxeTable.vue'), 'rect')

/**
 * 專案用特殊表格
 * 需配合後端
 * 功能:
 * 多欄位排序
 * 多欄位搜尋
 * 進階搜尋
 */
export type {
  Custom as WebViewTableCustom,
  Props as WebViewTableProps,
  Emits as WebViewTableEmits,
  Expose as WebViewTableExpose
} from './table/WebViewTable/WebViewTableInfo'
export const WebViewTable = useAsyncComponent(() => import('./table/WebViewTable/WebViewTable.vue'), 'rect')
