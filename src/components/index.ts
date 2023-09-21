import type { Ref } from 'vue'
import type { ValidationOptions, ValidationResult } from 'vee-validate'

// chart
export { default as WeekSchedule } from './chart/WeekSchedule/WeekSchedule.vue'
export { default as GanttChart } from './chart/GanttChart/GanttChart.vue'

// feature
export type { ButtonType, ButtonSize } from './feature/CustomButton/CustomButton.vue'
export { default as CustomButton } from './feature/CustomButton/CustomButton.vue'

export { default as CustomDivider } from './feature/CustomDivider/CustomDivider.vue'

export type {
  Change as DraggableChange
} from './feature/CustomDraggable/CustomDraggable.vue'
export { default as CustomDraggable } from './feature/CustomDraggable/CustomDraggable.vue'

export { default as CustomEmpty } from './feature/CustomEmpty/CustomEmpty.vue'

export type {
  Fit
} from './feature/CustomImage/CustomImage.vue'
export { default as CustomImage } from './feature/CustomImage/CustomImage.vue'

export type { IconType, IconSize } from './feature/CustomIcon/CustomIcon.vue'
export { default as CustomIcon } from './feature/CustomIcon/CustomIcon.vue'

export type {
  ModelValue as InputModelValue,
  Option,
  Options
} from './feature/CustomInput/props'
// @ts-ignore
export { default as CustomInput } from './feature/CustomInput/CustomInput.tsx'

export { default as CustomMarkdown } from './feature/CustomMarkdown/CustomMarkdown.vue'

export type {
  WidthSize,
  HeightSize,
  ModelValue as ModalModelValue
} from './feature/CustomModal/CustomModal.vue'
export { default as CustomModal } from './feature/CustomModal/CustomModal.vue'

export type {
  OperatorOptions,
  ModelValue as OperatorModelValue
} from './feature/CustomOperator/CustomOperator.vue'
export { default as CustomOperator } from './feature/CustomOperator/CustomOperator.vue'

export { default as CustomUpload } from './feature/CustomUpload/CustomUpload.vue'

export type {
  Placement as PopoverPlacement,
  Trigger as PopoverTrigger
} from './feature/CustomPopover/CustomPopover.vue'
export { default as CustomPopover } from './feature/CustomPopover/CustomPopover.vue'

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
}
export type {
  PageChange,
  TableParams,
  Sort,
  LazyLoadingStatus
} from './feature/CustomTable/CustomTable.vue'
export { default as CustomTable } from './feature/CustomTable/CustomTable.vue'

export type {
  ListItem,
  ListType,
  ModelValue as TabsModelValue
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
export { default as FormCheckbox } from './form/FormCheckbox.vue'

export type {
  Shortcuts,
  PickerType
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

export { default as FormRadio } from './form/FormRadio.vue'

export type {
  Options as FormSelectOptions
} from './form/FormSelect.vue'
export { default as FormSelect } from './form/FormSelect.vue'

export { default as FormList } from './form/FormList.vue'
