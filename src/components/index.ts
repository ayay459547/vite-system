import type { Ref } from 'vue'
import type { ValidationOptions, ValidationResult } from 'vee-validate'

// chart
export { default as CustomCharts } from './chart/CustomCharts/CustomCharts.vue'
export { default as GanttChart } from './chart/GanttChart/GanttChart.vue'
export { default as WeekSchedule } from './chart/WeekSchedule/WeekSchedule.vue'

// feature
export type {
  ButtonType,
  ButtonSize,
  ButtonMove,
  ButtonIconType
} from './feature/CustomButton/CustomButton.vue'
export { default as CustomButton } from './feature/CustomButton/CustomButton.vue'

export type {
  ModelValue as CollapseModelValue
} from './feature/CustomCollapse/CustomCollapse.vue'
export { default as CustomCollapse } from './feature/CustomCollapse/CustomCollapse.vue'

export { default as CustomDialog } from './feature/CustomDialog/CustomDialog.vue'

export type { BadgeType } from './feature/CustomBadge/CustomBadge.vue'
export { default as CustomBadge } from './feature/CustomBadge/CustomBadge.vue'

export type {
  DividerDirection,
  DividerBorderStyle,
  DividerContentPosition
} from './feature/CustomDivider/CustomDivider.vue'
export { default as CustomDivider } from './feature/CustomDivider/CustomDivider.vue'

export type {
  DraggableChange
} from './feature/CustomDraggable/CustomDraggable.vue'
export { default as CustomDraggable } from './feature/CustomDraggable/CustomDraggable.vue'

export type {
  DrawerDirection
} from './feature/CustomDrawer/CustomDrawer.vue'
export { default as CustomDrawer } from './feature/CustomDrawer/CustomDrawer.vue'

export { default as CustomEmpty } from './feature/CustomEmpty/CustomEmpty.vue'

export type { ImageFit } from './feature/CustomImage/CustomImage.vue'
export { default as CustomImage } from './feature/CustomImage/CustomImage.vue'

export type { IconType, IconSize } from './feature/CustomIcon/CustomIcon.vue'
export { default as CustomIcon } from './feature/CustomIcon/CustomIcon.vue'

export type {
  ModelValue as InputModelValue,
  Option,
  Options,
  InputType
} from './feature/CustomInput/props'
// @ts-ignore
export { default as CustomInput } from './feature/CustomInput/CustomInput.tsx'

export { default as CustomMarkdown } from './feature/CustomMarkdown/CustomMarkdown.vue'

export type {
  WidthSize,
  HeightSize,
  ModelValue as ModalModelValue,
  XPosition,
  YPosition
} from './feature/CustomModal/CustomModal.vue'
export { default as CustomModal } from './feature/CustomModal/CustomModal.vue'

export { default as CustomUpload } from './feature/CustomUpload/CustomUpload.vue'

export type {
  Placement as PopoverPlacement,
  Trigger as PopoverTrigger
} from './feature/CustomPopover/CustomPopover.vue'
export { default as CustomPopover } from './feature/CustomPopover/CustomPopover.vue'

export type {
  AriaOrientation,
  OnScrollParams,
  HandleScroll,
  ScrollTo,
  SetScrollTop,
  SetScrollLeft,
  Update,
  WrapRef
} from './feature/CustomScrollbar/CustomScrollbar.vue'
export { default as CustomScrollbar } from './feature/CustomScrollbar/CustomScrollbar.vue'

// 搜尋用組件
export { default as CustomSearch } from './feature/CustomSearch/CustomSearch.vue'
// GroupSearch 需搭配 CustomSearch 或 CustomInput 使用
export { default as GroupSearch } from './feature/CustomSearch/GroupSearch.vue'

export { default as CustomSteps } from './feature/CustomSteps/CustomSteps.vue'

export type {
  Size as SwitchSize,
  ModelValue as SwitchModelValue
} from './feature/CustomSwitch/CustomSwitch.vue'
export { default as CustomSwitch } from './feature/CustomSwitch/CustomSwitch.vue'

import type { TableParams, PageChange } from './feature/CustomTable/CustomTable.vue'
export declare interface CustomTableExpose {
  pageChange: PageChange
  getTableParams: () => TableParams
  setTableParams: (params: TableParams) => void
  resetScroll: () => void
  toggleSelection: (rows: any[]) => void
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
  SpanMethod
} from './feature/CustomTable/CustomTable.vue'
export { default as CustomTable } from './feature/CustomTable/CustomTable.vue'

export { default as TableMain } from './feature/CustomTable/TableMain.vue'

export { default as CustomTableV2 } from './feature/CustomTableV2/CustomTableV2.vue'

export type {
  ListItem,
  ListType,
  ModelValue as TabsModelValue,
  TabPosition
} from './feature/CustomTabs/CustomTabs.vue'
export { default as CustomTabs } from './feature/CustomTabs/CustomTabs.vue'

export type {
  TagType,
  TagSize,
  TagEffect
} from './feature/CustomTag/CustomTag.vue'
export { default as CustomTag } from './feature/CustomTag/CustomTag.vue'

export type {
  Placement as TooltipPlacement,
  Trigger as TooltipTrigger
} from './feature/CustomTooltip/CustomTooltip.vue'
export { default as CustomTooltip } from './feature/CustomTooltip/CustomTooltip.vue'

export type {
  TreeOptionProps
} from './feature/CustomTree/CustomTree.vue'
export { default as CustomTree } from './feature/CustomTree/CustomTree.vue'

export type {
  Size as TimeLineSize,
  Placement as TimeLinePlacement,
  TimeType,
  Options as TimeLineOptions
} from './feature/CustomTimeLine/CustomTimeLine.vue'
export { default as CustomTimeLine } from './feature/CustomTimeLine/CustomTimeLine.vue'

// @ts-ignore
export { default as SimpleFilter } from '@/components/feature/SimpleFilter/SimpleFilter.tsx'

export { default as SimpleTable } from './feature/SimpleTable/SimpleTable.vue'

export { default as SimpleQRcode } from './feature/SimpleQRcode/SimpleQRcode.vue'

// form
export type {
  FetchSuggestions
} from './form/FormAutocomplete.vue'
export { default as FormAutocomplete } from './form/FormAutocomplete.vue'

export { default as FormCheckbox } from './form/FormCheckbox.vue'

export type {
  Shortcuts,
  DatePickerType
} from './form/FormDatePicker.vue'
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

export type {
  Options as FormSelectOptions
} from './form/FormSelect.vue'
export { default as FormSelect } from './form/FormSelect.vue'

export type {
  TimePickerType
} from './form/FormTimePicker.vue'
export { default as FormTimePicker } from './form/FormTimePicker.vue'

export { default as FormList } from './form/FormList.vue'
