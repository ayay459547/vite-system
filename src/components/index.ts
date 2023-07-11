import type { Ref } from 'vue'
import type { ValidationOptions, ValidationResult } from 'vee-validate'

// chart
export { default as WeekSchedule } from './chart/WeekSchedule/WeekSchedule.vue'
export { default as GanttChart } from './chart/GanttChart.vue'

// feature
export type { ButtonType, ButtonSize } from './feature/CustomButton/CustomButton.vue'
export { default as CustomButton } from './feature/CustomButton/CustomButton.vue'

export type { IconType, IconSize } from './feature/CustomIcon/CustomIcon.vue'
export { default as CustomIcon } from './feature/CustomIcon/CustomIcon.vue'

export { default as CustomInput } from './feature/CustomInput/CustomInput.vue'

export type { WidthSize, HeightSize } from './feature/CustomModal/CustomModal.vue'
export { default as CustomModal } from './feature/CustomModal/CustomModal.vue'

export type {
  Placement as PopoverPlacement,
  Trigger as PopoverTrigger
} from './feature/CustomPopover/CustomPopover.vue'
export { default as CustomPopover } from './feature/CustomPopover/CustomPopover.vue'


export type {
  Options as RadioOptions
} from './feature/CustomRadio/CustomRadio.vue'
export { default as CustomRadio } from './feature/CustomRadio/CustomRadio.vue'

export type { PageChange } from './feature/CustomTable/CustomTable.vue'
export { default as CustomTable } from './feature/CustomTable/CustomTable.vue'

export type { ListItem, ListType } from './feature/CustomTabs/CustomTabs.vue'
export { default as CustomTabs } from './feature/CustomTabs/CustomTabs.vue'

export type {
  Placement as TooltipPlacement,
  Trigger as TooltipTrigger
} from './feature/CustomTooltip/CustomTooltip.vue'
export { default as CustomTooltip } from './feature/CustomTooltip/CustomTooltip.vue'

export { default as CustomCheckbox } from './feature/CustomCheckbox/CustomCheckbox.vue'

export { default as DataTable } from './feature/DataTable/DataTable'

// form
export { default as FormCheckbox } from './form/FormCheckbox.vue'

export { default as FormDatePicker } from './form/FormDatePicker.vue'

export declare interface Expose {
  key: string
  value: Ref<string>
  handleReset: () => void
  validate: (opts?: Partial<ValidationOptions>) => Promise<ValidationResult>
}
export { default as FormInput } from './form/FormInput.vue'

export { default as FormRadio } from './form/FormRadio.vue'

export { default as FormSelect } from './form/FormSelect.vue'

