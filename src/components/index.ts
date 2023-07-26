import type { Ref } from 'vue'
import type { ValidationOptions, ValidationResult } from 'vee-validate'

// chart
export { default as WeekSchedule } from './chart/WeekSchedule/WeekSchedule.vue'
export { default as GanttChart } from './chart/GanttChart.vue'

// feature
export type { ButtonType, ButtonSize } from './feature/CustomButton/CustomButton.vue'
export { default as CustomButton } from './feature/CustomButton/CustomButton.vue'

export type {
  ModelValue as CheckboxModelValue
} from './feature/CustomCheckbox/CustomCheckbox.vue'
export { default as CustomCheckbox } from './feature/CustomCheckbox/CustomCheckbox.vue'

export type {
  ModelValue as DatePickerModelValue
} from './feature/CustomDatePicker/CustomDatePicker.vue'
export { default as CustomDatePicker } from './feature/CustomDatePicker/CustomDatePicker.vue'

export type { IconType, IconSize } from './feature/CustomIcon/CustomIcon.vue'
export { default as CustomIcon } from './feature/CustomIcon/CustomIcon.vue'

export type {
  ModelValue as InputModelValue
} from './feature/CustomInput/CustomInput.vue'
export { default as CustomInput } from './feature/CustomInput/CustomInput.vue'

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

export type {
  Placement as PopoverPlacement,
  Trigger as PopoverTrigger
} from './feature/CustomPopover/CustomPopover.vue'
export { default as CustomPopover } from './feature/CustomPopover/CustomPopover.vue'


export type {
  Options as RadioOptions,
  ModelValue as RadioModelValue
} from './feature/CustomRadio/CustomRadio.vue'
export { default as CustomRadio } from './feature/CustomRadio/CustomRadio.vue'

export type {
  Options as SelectOptions,
  ModelValue as SelectModelValue
} from './feature/CustomRadio/CustomRadio.vue'
export { default as CustomSelect } from './feature/CustomSelect/CustomSelect.vue'

import type { TableParams, PageChange } from './feature/CustomTable/CustomTable.vue'
export declare interface CustomTableExpose {
  pageChange: PageChange
  getTableParams: () => TableParams
}
export type { PageChange, TableParams, Sort } from './feature/CustomTable/CustomTable.vue'
export { default as CustomTable } from './feature/CustomTable/CustomTable.vue'

export type {
  ListItem,
  ListType,
  ModelValue as TabsModelValue
} from './feature/CustomTabs/CustomTabs.vue'
export { default as CustomTabs } from './feature/CustomTabs/CustomTabs.vue'

export type {
  Placement as TooltipPlacement,
  Trigger as TooltipTrigger
} from './feature/CustomTooltip/CustomTooltip.vue'
export { default as CustomTooltip } from './feature/CustomTooltip/CustomTooltip.vue'

export { default as SimpleTable } from './feature/SimpleTable/SimpleTable'

// form
export { default as FormCheckbox } from './form/FormCheckbox.vue'

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
