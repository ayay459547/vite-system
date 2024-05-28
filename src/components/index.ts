import type { Ref } from 'vue'
import type { ValidationOptions, ValidationResult } from 'vee-validate'

// 通用
export type CustomSize = 'large' | 'default' | 'small'
export type CustomElType = '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type { Option, Options } from '@/declare/columnSetting'

// chart
export { default as CustomCharts } from './chart/CustomCharts/CustomCharts.vue'
export { default as GanttChart } from './chart/GanttChart/GanttChart.vue'
export { default as WeekSchedule } from './chart/WeekSchedule/WeekSchedule.vue'

// feature
export type { Props as ButtonProps } from './feature/CustomButton/CustomButtonInfo'
export { default as CustomButton } from './feature/CustomButton/CustomButton.vue'

export type { Props as CardProps } from './feature/CustomCard/CustomCardInfo'
export { default as CustomCard } from './feature/CustomCard/CustomCard.vue'

export type { Props as CollapseProps } from './feature/CustomCollapse/CustomCollapseInfo'
export { default as CustomCollapse } from './feature/CustomCollapse/CustomCollapse.vue'

// 棄用 CustomModal 代替
export type { Props as DialogProps } from './feature/CustomDialog/CustomDialogInfo'
export { default as CustomDialog } from './feature/CustomDialog/CustomDialog.vue'

export type { Props as BadgeProps } from './feature/CustomBadge/CustomBadgeInfo'
export { default as CustomBadge } from './feature/CustomBadge/CustomBadge.vue'

export type { Props as DividerProps } from './feature/CustomDivider/CustomDividerInfo'
export { default as CustomDivider } from './feature/CustomDivider/CustomDivider.vue'

export type { Props as DraggableProps, DraggableChange } from './feature/CustomDraggable/CustomDraggableInfo'
export { default as CustomDraggable } from './feature/CustomDraggable/CustomDraggable.vue'

export type { Props as DrawerProps } from './feature/CustomDrawer/CustomDrawerInfo'
export { default as CustomDrawer } from './feature/CustomDrawer/CustomDrawer.vue'

export type { Props as EmptyProps } from './feature/CustomEmpty/CustomEmptyInfo'
export { default as CustomEmpty } from './feature/CustomEmpty/CustomEmpty.vue'

export type { Props as ImageProps } from './feature/CustomImage/CustomImageInfo'
export { default as CustomImage } from './feature/CustomImage/CustomImage.vue'

export type { IconType, Props as IconProps } from './feature/CustomIcon/CustomIconInfo'
export { default as CustomIcon } from './feature/CustomIcon/CustomIcon.vue'

export type {
  ModelValue as InputModelValue,
  InputType
} from './feature/CustomInput/CustomInputInfo'

export { default as CustomInput } from './feature/CustomInput/CustomInput'

export type { Props as MarkdownProps } from './feature/CustomMarkdown/CustomMarkdownInfo'
export { default as CustomMarkdown } from './feature/CustomMarkdown/CustomMarkdown.vue'

export type { Props as ModalProps } from './feature/CustomModal/CustomModalInfo'
export { default as CustomModal } from './feature/CustomModal/CustomModal.vue'

export { default as CustomUpload } from './feature/CustomUpload/CustomUpload.vue'

export { default as CustomWatermark } from './feature/CustomWatermark/CustomWatermark.vue'

export type { Props as PopoverProps } from './feature/CustomPopover/CustomPopoverInfo'
export { default as CustomPopover } from './feature/CustomPopover/CustomPopover.vue'

export type { Props as CustomProgressProps } from './feature/CustomProgress/CustomProgressInfo'
export { default as CustomProgress } from './feature/CustomProgress/CustomProgress.vue'

export type {
  OnScrollParams,
  HandleScroll,
  ScrollTo,
  SetScrollTop,
  SetScrollLeft,
  Update,
  WrapRef,
  Props as ScrollbarProps
} from './feature/CustomScrollbar/CustomScrollbarInfo'
export { default as CustomScrollbar } from './feature/CustomScrollbar/CustomScrollbar.vue'

// 搜尋用組件
export { default as CustomSearch } from './feature/CustomSearch/CustomSearch.vue'
// GroupSearch 需搭配 CustomSearch 或 CustomInput 使用
export { default as GroupSearch } from './feature/CustomSearch/GroupSearch.vue'

export { default as CustomSteps } from './feature/CustomSteps/CustomSteps.vue'

export type {
  Size as SwitchSize,
  ModelValue as SwitchModelValue
} from './feature/CustomSwitch/CustomSwitchInfo'
export { default as CustomSwitch } from './feature/CustomSwitch/CustomSwitch.vue'

// 純表格
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

export type { Props as CustomTabsProps } from './feature/CustomTabs/CustomTabsInfo'
export { default as CustomTabs } from './feature/CustomTabs/CustomTabs.vue'

export type { TagType, TagSize, TagEffect } from './feature/CustomTag/CustomTagInfo'
export { default as CustomTag } from './feature/CustomTag/CustomTag.vue'

export type {
  Placement as TooltipPlacement,
  Trigger as TooltipTrigger
} from './feature/CustomTooltip/CustomTooltipInfo'
export { default as CustomTooltip } from './feature/CustomTooltip/CustomTooltip.vue'

export type { TreeOptionProps } from './feature/CustomTree/CustomTreeInfo'
export { default as CustomTree } from './feature/CustomTree/CustomTree.vue'
export type { TreeV2OptionProps } from './feature/CustomTreeV2/CustomTreeV2Info'
export { default as CustomTreeV2 } from './feature/CustomTreeV2/CustomTreeV2.vue'

export type {
  Size as TimeLineSize,
  Placement as TimeLinePlacement,
  TimeType,
  Options as TimeLineOptions
} from './feature/CustomTimeLine/CustomTimeLineInfo'
export { default as CustomTimeLine } from './feature/CustomTimeLine/CustomTimeLine.vue'

export { default as SimpleFilter } from './feature/SimpleFilter/SimpleFilter'

export { default as SimpleTable } from './feature/SimpleTable/SimpleTable.vue'

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
