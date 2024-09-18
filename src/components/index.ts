import type { Ref } from 'vue'
// import { defineAsyncComponent } from 'vue'
import type { ValidationOptions, ValidationResult } from 'vee-validate'
import { useAsyncComponent } from '@/lib/lib_hook'

// 通用
export type CustomSize = 'large' | 'default' | 'small'
export type CustomElType = '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type { Option, Options } from '@/declare/columnSetting'

// 圖表類
export type {
  Types as CustomChartsTypes,
  Props as CustomChartsProps,
  Emits as CustomChartsEmits,
  Expose as CustomChartsExpose
} from './chart/CustomCharts/CustomChartsInfo'
export const CustomCharts = useAsyncComponent(() => import('./chart/CustomCharts/CustomCharts.vue'), 'rect')

export type {
  Types as GanttChartTypes,
  Props as GanttChartProps,
  Emits as GanttChartEmits,
  Expose as GanttChartExpose
} from './chart/GanttChart/GanttChartInfo'
export const GanttChart = useAsyncComponent(() => import('./chart/GanttChart/GanttChart.vue'), 'rect')

export type {
  Types as WeekScheduleTypes,
  Props as WeekScheduleProps,
  Emits as WeekScheduleEmits,
  Expose as WeekScheduleExpose
} from './chart/WeekSchedule/WeekScheduleInfo'
export const WeekSchedule = useAsyncComponent(() => import('./chart/WeekSchedule/WeekSchedule.vue'), 'rect')

// 專案功能組件

// 區塊右上方顯示 數字/圖示/其他
export type {
  Types as CustomBadgeTypes,
  Props as CustomBadgeProps,
  Emits as CustomBadgeEmits,
  Expose as CustomBadgeExpose
} from './feature/CustomBadge/CustomBadgeInfo'
export const CustomBadge = useAsyncComponent(() => import('./feature/CustomBadge/CustomBadge.vue'), 'caption')

// 按鈕
export type {
  Types as CustomButtonTypes,
  Props as CustomButtonProps,
  Emits as CustomButtonEmits,
  Expose as CustomButtonExpose
} from './feature/CustomButton/CustomButtonInfo'
export { default as CustomButton } from './feature/CustomButton/CustomButton.vue'

// 卡片
export type {
  Types as CustomCardTypes,
  Props as CustomCardProps,
  Emits as CustomCardEmits,
  Expose as CustomCardExpose
} from './feature/CustomCard/CustomCardInfo'
export const CustomCard = useAsyncComponent(() => import('./feature/CustomCard/CustomCard.vue'), 'rect')

// 輪播
export type {
  Types as CarouselTypes,
  Props as CarouselProps,
  Emits as CarouselEmits,
  Expose as CarouselExpose
} from './feature/CustomCarousel/CustomCarouselInfo'
export const CustomCarousel = useAsyncComponent(() => import('./feature/CustomCarousel/CustomCarousel.vue'), 'rect')

// 展開/縮起 區塊
export type {
  Types as CustomCollapseTypes,
  Props as CustomCollapseProps,
  Emits as CustomCollapseEmits,
  Expose as CustomCollapseExpose
} from './feature/CustomCollapse/CustomCollapseInfo'
export const CustomCollapse = useAsyncComponent(() => import('./feature/CustomCollapse/CustomCollapse.vue'), 'rect')

// 棄用 CustomModal 代替
export type {
  Types as CustomDialogTypes,
  Props as CustomDialogProps,
  Emits as CustomDialogEmits,
  Expose as CustomDialogExpose
} from './feature/CustomDialog/CustomDialogInfo'
export const CustomDialog = useAsyncComponent(() => import('./feature/CustomDialog/CustomDialog.vue'), 'p')

// 分隔線
export type {
  Types as CustomDividerTypes,
  Props as CustomDividerProps,
  Emits as CustomDividerEmits,
  Expose as CustomDividerExpose
} from './feature/CustomDivider/CustomDividerInfo'
export const CustomDivider = useAsyncComponent(() => import('./feature/CustomDivider/CustomDivider.vue'), 'p')

// 分隔檢視
export type {
  Types as CustomDividerViewTypes,
  Props as CustomDividerViewProps,
  Emits as CustomDividerViewEmits,
  Expose as CustomDividerViewExpose
} from './feature/CustomDividerView/CustomDividerViewInfo'
export const CustomDividerView = useAsyncComponent(() => import('./feature/CustomDividerView/CustomDividerView.vue'), 'rect')

// 拖拉
export type {
  Types as CustomDraggableTypes,
  Props as CustomDraggableProps,
  Emits as CustomDraggableEmits,
  Expose as CustomDraggableExpose
} from './feature/CustomDraggable/CustomDraggableInfo'
export const CustomDraggable = useAsyncComponent(() => import('./feature/CustomDraggable/CustomDraggable.vue'), 'rect')

// 從銀幕外插入畫面
export type {
  Types as CustomDrawerTypes,
  Props as CustomDrawerProps,
  Emits as CustomDrawerEmits,
  Expose as CustomDrawerExpose
} from './feature/CustomDrawer/CustomDrawerInfo'
export const CustomDrawer = useAsyncComponent(() => import('./feature/CustomDrawer/CustomDrawer.vue'), 'p')

// 無資料
export type {
  Types as CustomEmptyTypes,
  Props as CustomEmptyProps,
  Emits as CustomEmptyEmits,
  Expose as CustomEmptyExpose
} from './feature/CustomEmpty/CustomEmptyInfo'
export const CustomEmpty = useAsyncComponent(() => import('./feature/CustomEmpty/CustomEmpty.vue'), 'rect')

// 圖示
export type {
  Types as CustomIconTypes,
  Props as CustomIconProps,
  Emits as CustomIconEmits,
  Expose as CustomIconExpose
} from './feature/CustomIcon/CustomIconInfo'
export { default as CustomIcon } from './feature/CustomIcon/CustomIcon.vue'

// 圖片
export type {
  Types as CustomImageTypes,
  Props as CustomImageProps,
  Emits as CustomImageEmits,
  Expose as CustomImageExpose
} from './feature/CustomImage/CustomImageInfo'
export const CustomImage = useAsyncComponent(() => import('./feature/CustomImage/CustomImage.vue'), 'image')

// 跳轉用組件
export type {
  Types as CustomLinkTypes,
  Props as CustomLinkProps,
  Emits as CustomLinkEmits,
  Expose as CustomLinkExpose
} from './feature/CustomLink/CustomLinkInfo'
export const CustomLink = useAsyncComponent(() => import('./feature/CustomLink/CustomLink.vue'), 'caption')

// 鎖定
export type {
  Types as CustomLockViewTypes,
  Props as CustomLockViewProps,
  Emits as CustomLockViewEmits,
  Expose as CustomLockViewExpose
} from './feature/CustomLockView/CustomLockViewInfo'
export const CustomLockView = useAsyncComponent(() => import('./feature/CustomLockView/CustomLockView.vue'), 'rect')

// .md
export type {
  Types as CustomMarkdownTypes,
  Props as CustomMarkdownProps,
  Emits as CustomMarkdownEmits,
  Expose as CustomMarkdownExpose
} from './feature/CustomMarkdown/CustomMarkdownInfo'
export const CustomMarkdown = useAsyncComponent(() => import('./feature/CustomMarkdown/CustomMarkdown.vue'), 'rect')

// 彈窗
export type {
  Types as CustomModalTypes,
  Props as CustomModalProps,
  Emits as CustomModalEmits,
  Expose as CustomModalExpose
} from './feature/CustomModal/CustomModalInfo'
export const CustomModal = useAsyncComponent(() => import('./feature/CustomModal/CustomModal.vue'), 'p')

// 彈出 區塊提示
export type {
  Types as CustomPopoverTypes,
  Props as CustomPopoverProps,
  Emits as CustomPopoverEmits,
  Expose as CustomPopoverExpose
} from './feature/CustomPopover/CustomPopoverInfo'
export const CustomPopover = useAsyncComponent(() => import('./feature/CustomPopover/CustomPopover.vue'), 'p')

// 進度條
export type {
  Types as CustomProgressTypes,
  Props as CustomProgressProps,
  Emits as CustomProgressEmits,
  Expose as CustomProgressExpose
} from './feature/CustomProgress/CustomProgressInfo'
export const CustomProgress = useAsyncComponent(() => import('./feature/CustomProgress/CustomProgress.vue'), 'rect')

// 滾輪
export type {
  Types as CustomScrollbarTypes,
  Props as CustomScrollbarProps,
  Emits as CustomScrollbarEmits,
  Expose as CustomScrollbarExpose
} from './feature/CustomScrollbar/CustomScrollbarInfo'
export { default as CustomScrollbar } from './feature/CustomScrollbar/CustomScrollbar.vue'

// 步驟
export type {
  Types as CustomStepsTypes,
  Props as CustomStepsProps,
  Emits as CustomStepsEmits,
  Expose as CustomStepsExpose
} from './feature/CustomSteps/CustomStepsInfo'
export const CustomSteps = useAsyncComponent(() => import('./feature/CustomSteps/CustomSteps.vue'), 'rect')

// 分頁
export type {
  Types as CustomTabsTypes,
  Props as CustomTabsProps,
  Emits as CustomTabsEmits,
  Expose as CustomTabsExpose
} from './feature/CustomTabs/CustomTabsInfo'
export const CustomTabs = useAsyncComponent(() => import('./feature/CustomTabs/CustomTabs.vue'), 'h1')

// 類似按鈕的標籤
export type {
  Types as CustomTagTypes,
  Props as CustomTagProps,
  Emits as CustomTagEmits,
  Expose as CustomTagExpose
} from './feature/CustomTag/CustomTagInfo'
export const CustomTag = useAsyncComponent(() => import('./feature/CustomTag/CustomTag.vue'), 'caption')

// 時間線
export type {
  Types as CustomTimeLineTypes,
  Props as CustomTimeLineProps,
  Emits as CustomTimeLineEmits,
  Expose as CustomTimeLineExpose
} from './feature/CustomTimeLine/CustomTimeLineInfo'
export const CustomTimeLine = useAsyncComponent(() => import('./feature/CustomTimeLine/CustomTimeLine.vue'), 'rect')

// 彈出 文字提示
export type {
  Types as CustomTooltipTypes,
  Props as CustomTooltipProps,
  Emits as CustomTooltipEmits,
  Expose as CustomTooltipExpose
} from './feature/CustomTooltip/CustomTooltipInfo'
export const CustomTooltip = useAsyncComponent(() => import('./feature/CustomTooltip/CustomTooltip.vue'), 'p')

// 引導
export type {
  Types as CustomTourTypes,
  Props as CustomTourProps,
  Emits as CustomTourEmits,
  Expose as CustomTourExpose
} from './feature/CustomTour/CustomTourInfo'
export const CustomTour = useAsyncComponent(() => import('./feature/CustomTour/CustomTour.vue'), 'p')

// 樹狀
export type {
  Types as CustomTreeTypes,
  Props as CustomTreeProps,
  Emits as CustomTreeEmits,
  Expose as CustomTreeExpose
 } from './feature/CustomTree/CustomTreeInfo'
export const CustomTree = useAsyncComponent(() => import('./feature/CustomTree/CustomTree.vue'), 'rect')

// 虛擬樹狀
export type {
  Types as CustomTreeV2Types,
  Props as CustomTreeV2Props,
  Emits as CustomTreeV2Emits,
  Expose as CustomTreeV2Expose
 } from './feature/CustomTreeV2/CustomTreeV2Info'
export const CustomTreeV2 = useAsyncComponent(() => import('./feature/CustomTreeV2/CustomTreeV2.vue'), 'rect')

// 浮水印
export type {
  Types as CustomWatermarkTypes,
  Props as CustomWatermarkProps,
  Emits as CustomWatermarkEmits,
  Expose as CustomWatermarkExpose
 } from './feature/CustomWatermark/CustomWatermarkInfo'
export const CustomWatermark = useAsyncComponent(() => import('./feature/CustomWatermark/CustomWatermark.vue'), 'rect')

// 選色器
export type {
  Types as CustomColorTypes,
  Props as CustomColorProps,
  Emits as CustomColorEmits,
  Expose as CustomColorExpose
} from './feature/CustomColor/CustomColorInfo'
export const CustomColor = useAsyncComponent(() => import('./feature/CustomColor/CustomColor.vue'), 'rect')

// QRcode
export type {
  Types as SimpleQRcodeTypes,
  Props as SimpleQRcodeProps,
  Emits as SimpleQRcodeEmits,
  Expose as SimpleQRcodeExpose
} from './feature/SimpleQRcode/SimpleQRcodeInfo'
export { default as SimpleQRcode } from './feature/SimpleQRcode/SimpleQRcode.vue'

// input

// 輸入框
export type {
  Types as CustomInputTypes,
  Props as CustomInputProps,
  Emits as CustomInputEmits,
  Expose as CustomInputExpose
} from './input/CustomInput/CustomInputInfo'
export { default as CustomInput } from './input/CustomInput/CustomInput.vue'

export declare interface TempCustomInputExpose {
  key: string
  value: Ref<string>
  handleReset: () => void
  validate: (opts?: Partial<ValidationOptions>) => Promise<ValidationResult>
  setvalidateKey: (validateKey: string) => void
  getDom: () => Element
}

// 搜尋用組件
export type {
  Types as CustomSearchTypes,
  Props as CustomSearchProps,
  Emits as CustomSearchEmits,
  Expose as CustomSearchExpose
} from './input/CustomSearch/CustomSearchInfo'
export { default as CustomSearch } from './input/CustomSearch/CustomSearch.vue'

// GroupSearch 需搭配 CustomSearch 或 CustomInput 使用
export type {
  Types as GroupSearchTypes,
  Props as GroupSearchProps,
  Emits as GroupSearchEmits,
  Expose as GroupSearchExpose
} from './input/CustomSearch/CustomSearchInfo'
export const GroupSearch = useAsyncComponent(() => import('./input/CustomSearch/GroupSearch.vue'), 'p')

// 切換鈕
export type {
  Types as CustomSwitchTypes,
  Props as CustomSwitchProps,
  Emits as CustomSwitchEmits,
  Expose as CustomSwitchExpose
} from './input/CustomSwitch/CustomSwitchInfo'
export const CustomSwitch = useAsyncComponent(() => import('./input/CustomSwitch/CustomSwitch.vue'), 'button')

// 檔案上傳
export type {
  Types as CustomUploadTypes,
  Props as CustomUploadProps,
  Emits as CustomUploadEmits,
  Expose as CustomUploadExpose
} from './input/CustomUpload/CustomUploadInfo'
export const CustomUpload = useAsyncComponent(() => import('./input/CustomUpload/CustomUpload.vue'), 'rect')

// Form
export type {
  Types as FormAutocompleteTypes,
  Props as FormAutocompleteProps,
  Emits as FormAutocompleteEmits,
  Expose as FormAutocompleteExpose
} from './input/FormAutocomplete/FormAutocompleteInfo'
export const FormAutocomplete = useAsyncComponent(() => import('./input/FormAutocomplete/FormAutocomplete.vue'), 'h1')

export type {
  Types as FormCheckboxTypes,
  Props as FormCheckboxProps,
  Emits as FormCheckboxEmits,
  Expose as FormCheckboxExpose
} from './input/FormCheckbox/FormCheckboxInfo'
export const FormCheckbox = useAsyncComponent(() => import('./input/FormCheckbox/FormCheckbox.vue'), 'h1')

export type {
  Types as FormDatePickerTypes,
  Props as FormDatePickerProps,
  Emits as FormDatePickerEmits,
  Expose as FormDatePickerExpose
} from './input/FormDatePicker/FormDatePickerInfo'
export const FormDatePicker = useAsyncComponent(() => import('./input/FormDatePicker/FormDatePicker.vue'), 'h1')

export type {
  Types as FormInputTypes,
  Props as FormInputProps,
  Emits as FormInputEmits,
  Expose as FormInputExpose
} from './input/FormInput/FormInputInfo'
export const FormInput = useAsyncComponent(() => import('./input/FormInput/FormInput.vue'), 'h1')

export type {
  Types as FormOperatorTypes,
  Props as FormOperatorProps,
  Emits as FormOperatorEmits,
  Expose as FormOperatorExpose
} from './input/FormOperator/FormOperatorInfo'
export const FormOperator = useAsyncComponent(() => import('./input/FormOperator/FormOperator.vue'), 'h1')

export type {
  Types as FormRadioTypes,
  Props as FormRadioProps,
  Emits as FormRadioEmits,
  Expose as FormRadioExpose
} from './input/FormRadio/FormRadioInfo'
export const FormRadio = useAsyncComponent(() => import('./input/FormRadio/FormRadio.vue'), 'h1')

export type {
  Types as FormSelectTypes,
  Props as FormSelectProps,
  Emits as FormSelectEmits,
  Expose as FormSelectExpose
} from './input/FormSelect/FormSelectInfo'
export const FormSelect = useAsyncComponent(() => import('./input/FormSelect/FormSelect.vue'), 'h1')

export type {
  Types as FormSelectTreeTypes,
  Props as FormSelectTreeProps,
  Emits as FormSelectTreeEmits,
  Expose as FormSelectTreeExpose
} from './input/FormSelectTree/FormSelectTreeInfo'
export const FormSelectTree = useAsyncComponent(() => import('./input/FormSelectTree/FormSelectTree.vue'), 'h1')

export type {
  Types as FormSelectV2Types,
  Props as FormSelectV2Props,
  Emits as FormSelectV2Emits,
  Expose as FormSelectV2Expose
} from './input/FormSelectV2/FormSelectV2Info'
export const FormSelectV2 = useAsyncComponent(() => import('./input/FormSelectV2/FormSelectV2.vue'), 'h1')

export type {
  Types as FormTimePickerTypes,
  Props as FormTimePickerProps,
  Emits as FormTimePickerEmits,
  Expose as FormTimePickerExpose
} from './input/FormTimePicker/FormTimePickerInfo'
export const FormTimePicker = useAsyncComponent(() => import('./input/FormTimePicker/FormTimePicker.vue'), 'h1')

export type {
  Types as FormListTypes,
  Props as FormListProps,
  Emits as FormListEmits,
  Expose as FormListExpose
} from './input/FormList/FormListInfo'
export const FormList = useAsyncComponent(() => import('./input/FormList/FormList.vue'), 'h1')

// 過濾
export type {
  Types as SimpleFilterTypes,
  Props as SimpleFilterProps,
  Emits as SimpleFilterEmits,
  Expose as SimpleFilterExpose
} from './input/SimpleFilter/SimpleFilterInfo'
export const SimpleFilter = useAsyncComponent(() => import('./input/SimpleFilter/SimpleFilter.vue'), 'p')

// 時間維度切換
export type {
  Types as TimeLevelManagementTypes,
  Props as TimeLevelManagementProps,
  Emits as TimeLevelManagementEmits,
  Expose as TimeLevelManagementExpose
} from './input/TimeLevelManagement/TimeLevelManagementInfo'
export { default as TimeLevelManagement } from './input/TimeLevelManagement/TimeLevelManagement.vue'

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
  Types as CustomTableTypes,
  Props as CustomTableProps,
  Emits as CustomTableEmits,
  Expose as CustomTableExpose
} from './table/CustomTable/CustomTableInfo'
export { default as CustomTable } from './table/CustomTable/CustomTable.vue'

/**
 * 虛擬表格
 */
export type {
  Types as CustomTableV2Types,
  Props as CustomTableV2Props,
  Emits as CustomTableV2Emits,
  Expose as CustomTableV2Expose
} from './table/CustomTableV2/CustomTableV2Info'
export const CustomTableV2 = useAsyncComponent(() => import('./table/CustomTableV2/CustomTableV2.vue'), 'rect')

/**
 * 簡易表格
 * 功能:
 * 可拖拉
 */
export type {
  Types as SimpleCustomTableTypes,
  Props as SimpleCustomTableProps,
  Emits as SimpleTableEmits,
  Expose as SimpleTableExpose
} from './table/SimpleTable/SimpleTableInfo'
export const SimpleTable = useAsyncComponent(() => import('./table/SimpleTable/SimpleTable.vue'), 'rect')

export type {
  Types as TimeLineCustomTableTypes,
  Props as TimeLineCustomTableProps,
  Emits as TimeLineTableEmits,
  Expose as TimeLineTableExpose
} from './table/TimeLineTable/TimeLineTableInfo'
export const TimeLineTable = useAsyncComponent(() => import('./table/TimeLineTable/TimeLineTable.vue'), 'rect')

/**
 * Vxe Table
 * 功能:
 * 更加高效的渲染
 */
export type {
  Types as VxeColgroupTypes,
  Props as VxeColgroupProps,
  Emits as VxeColgroupEmits,
  Expose as VxeColgroupExpose
} from './table/VxeTable/VxeColgroupInfo'
export const VxeColgroup = useAsyncComponent(() => import('./table/VxeTable/VxeColgroup.vue'), 'h1')
export type {
  Types as VxeColumnTypes,
  Props as VxeColumnProps,
  Emits as VxeColumnEmits,
  Expose as VxeColumnExpose
} from './table/VxeTable/VxeColumnInfo'
export const VxeColumn = useAsyncComponent(() => import('./table/VxeTable/VxeColumn.vue'), 'h1')
export type {
  Types as VxeTableTypes,
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
  Types as WebViewCustomTableTypes,
  Props as WebViewCustomTableProps,
  Emits as WebViewTableEmits,
  Expose as WebViewTableExpose
} from './table/WebViewTable/WebViewTableInfo'
export const WebViewTable = useAsyncComponent(() => import('./table/WebViewTable/WebViewTable.vue'), 'rect')
