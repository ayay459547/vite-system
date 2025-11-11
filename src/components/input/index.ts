// import { defineAsyncComponent } from 'vue'
import { useAsyncComponent } from '@/lib/lib_hook' // 自訂Composition API

/**
 * @author Caleb
 * @description 輸入框(綜合各類型的input)
 */
export type {
  Types as CustomInputTypes,
  Props as CustomInputProps,
  Emits as CustomInputEmits,
  Expose as CustomInputExpose
} from './CustomInput/CustomInputInfo'
export { default as CustomInput } from './CustomInput/CustomInput.vue'

/**
 * @author Caleb
 * @contributors Howard
 * @description 搜尋用組件
 */
export type {
  Types as CustomSearchTypes,
  Props as CustomSearchProps,
  Emits as CustomSearchEmits,
  Expose as CustomSearchExpose
} from './CustomSearch/CustomSearchInfo'
export { default as CustomSearch } from './CustomSearch/CustomSearch.vue'

/**
 * @author Caleb
 * @contributors Howard
 * @description GroupSearch 需搭配 CustomSearch 或 CustomInput 使用
 */
export type {
  Types as GroupSearchTypes,
  Props as GroupSearchProps,
  Emits as GroupSearchEmits,
  Expose as GroupSearchExpose
} from './CustomSearch/CustomSearchInfo'
export const GroupSearch = useAsyncComponent<typeof import('./CustomSearch/GroupSearch.vue')['default']>(
  () => import('./CustomSearch/GroupSearch.vue'), 'p'
)

/**
 * @author Caleb
 * @description 切換鈕
 * @see https://element-plus.org/en-US/component/switch.html
 */
export type {
  Types as CustomSwitchTypes,
  Props as CustomSwitchProps,
  Emits as CustomSwitchEmits,
  Expose as CustomSwitchExpose
} from './CustomSwitch/CustomSwitchInfo'
export const CustomSwitch = useAsyncComponent<typeof import('./CustomSwitch/CustomSwitch.vue')['default']>(
  () => import('./CustomSwitch/CustomSwitch.vue'), 'button'
)

/**
 * @author Caleb
 * @description 檔案上傳
 */
export type {
  Types as CustomUploadTypes,
  Props as CustomUploadProps,
  Emits as CustomUploadEmits,
  Expose as CustomUploadExpose
} from './CustomUpload/CustomUploadInfo'
export const CustomUpload = useAsyncComponent<typeof import('./CustomUpload/CustomUpload.vue')['default']>(
  () => import('./CustomUpload/CustomUpload.vue'), 'rect'
)

/**
 * @author Caleb
 * @description 輸入框 推薦選項
 * @see https://element-plus.org/en-US/component/autocomplete.html
 */
export type {
  Types as FormAutocompleteTypes,
  Props as FormAutocompleteProps,
  Emits as FormAutocompleteEmits,
  Expose as FormAutocompleteExpose
} from './FormAutocomplete/FormAutocompleteInfo'
export { default as FormAutocomplete } from './FormAutocomplete/FormAutocomplete.vue'

/**
 * @author Caleb
 * @description 勾選框
 * @see https://element-plus.org/en-US/component/checkbox.html
 */
export type {
  Types as FormCheckboxTypes,
  Props as FormCheckboxProps,
  Emits as FormCheckboxEmits,
  Expose as FormCheckboxExpose
} from './FormCheckbox/FormCheckboxInfo'
export { default as FormCheckbox } from './FormCheckbox/FormCheckbox.vue'

/**
 * @author Caleb
 * @description 日期
 * @see https://element-plus.org/en-US/component/date-picker.html
 */
export type {
  Types as FormDatePickerTypes,
  Props as FormDatePickerProps,
  Emits as FormDatePickerEmits,
  Expose as FormDatePickerExpose
} from './FormDatePicker/FormDatePickerInfo'
export { default as FormDatePicker } from './FormDatePicker/FormDatePicker.vue'

/**
 * @author Caleb
 * @description 輸入框
 * @see https://element-plus.org/en-US/component/input.html
 */
export type {
  Types as FormInputTypes,
  Props as FormInputProps,
  Emits as FormInputEmits,
  Expose as FormInputExpose
} from './FormInput/FormInputInfo'
export { default as FormInput } from './FormInput/FormInput.vue'

/**
 * @author Caleb
 * @description 數字輸入框
 * @deprecated FormInput type='number' 代替
 */
// export type {
//   Types as FormNumberTypes,
//   Props as FormNumberProps,
//   Emits as FormNumberEmits,
//   Expose as FormNumberExpose
// } from './FormNumber/FormNumberInfo'
// export const FormNumber = useAsyncComponent<typeof import('./FormNumber/FormNumber.vue')['default']>(
//   () => import('./FormNumber/FormNumber.vue'), 'h1'
// )

/**
 * @author Caleb
 * @description 選擇框 + 輸入框
 */
export type {
  Types as FormOperatorTypes,
  Props as FormOperatorProps,
  Emits as FormOperatorEmits,
  Expose as FormOperatorExpose
} from './FormOperator/FormOperatorInfo'
export { default as FormOperator } from './FormOperator/FormOperator.vue'

/**
 * @author Caleb
 * @description 單選
 * @see https://element-plus.org/en-US/component/radio.html
 */
export type {
  Types as FormRadioTypes,
  Props as FormRadioProps,
  Emits as FormRadioEmits,
  Expose as FormRadioExpose
} from './FormRadio/FormRadioInfo'
export { default as FormRadio } from './FormRadio/FormRadio.vue'

/**
 * @author Caleb
 * @description 選擇框
 * @see https://element-plus.org/en-US/component/select.html
 */
export type {
  Types as FormSelectTypes,
  Props as FormSelectProps,
  Emits as FormSelectEmits,
  Expose as FormSelectExpose
} from './FormSelect/FormSelectInfo'
export { default as FormSelect } from './FormSelect/FormSelect.vue'

/**
 * @author Caleb
 * @description 樹狀選擇框
 * @see https://element-plus.org/en-US/component/tree-select.html
 */
export type {
  Types as FormSelectTreeTypes,
  Props as FormSelectTreeProps,
  Emits as FormSelectTreeEmits,
  Expose as FormSelectTreeExpose
} from './FormSelectTree/FormSelectTreeInfo'
export { default as FormSelectTree } from './FormSelectTree/FormSelectTree.vue'

/**
 * @author Caleb
 * @description 虛擬選擇框
 * @see https://element-plus.org/en-US/component/select-v2.html
 */
export type {
  Types as FormSelectV2Types,
  Props as FormSelectV2Props,
  Emits as FormSelectV2Emits,
  Expose as FormSelectV2Expose
} from './FormSelectV2/FormSelectV2Info'
export { default as FormSelectV2 } from './FormSelectV2/FormSelectV2.vue'

/**
 * @author Caleb
 * @description 時間
 * @see https://element-plus.org/en-US/component/time-picker.html
 */
export type {
  Types as FormTimePickerTypes,
  Props as FormTimePickerProps,
  Emits as FormTimePickerEmits,
  Expose as FormTimePickerExpose
} from './FormTimePicker/FormTimePickerInfo'
export { default as FormTimePicker } from './FormTimePicker/FormTimePicker.vue'


/**
 * @author Caleb
 * @description 彈跳視窗 選取特定資料(配合 CustomInput.vue 使用)
 * 1. ModalSelect 預設放大鏡樣式(可自訂)
 * 2. ModalSelectManagement 彈跳視窗 中 包含資料表格(選取資料)
 */
export type {
  Types as ModalSelectTypes,
  Props as ModalSelectProps,
  Emits as ModalSelectEmits,
  Expose as ModalSelectExpose
} from './ModalSelect/ModalSelectInfo'
export { default as ModalSelect } from './ModalSelect/ModalSelect.vue'
export { default as ModalSelectManagement } from './ModalSelectManagement/ModalSelectManagement.vue'

/**
 * @author Caleb
 * @contributors Howard
 * @description 表單列表
 */
export type {
  Types as FormListTypes,
  Props as FormListProps,
  Emits as FormListEmits,
  Expose as FormListExpose
} from './FormList/FormListInfo'
export const FormList = useAsyncComponent<typeof import('./FormList/FormList.vue')['default']>(
  () => import('./FormList/FormList.vue'), 'h1'
)

/**
 * @author Caleb
 * @deprecated 舊版甘特圖使用的過濾
 */
export type {
  Types as SimpleFilterTypes,
  Props as SimpleFilterProps,
  Emits as SimpleFilterEmits,
  Expose as SimpleFilterExpose
} from './SimpleFilter/SimpleFilterInfo'
export const SimpleFilter = useAsyncComponent<typeof import('./SimpleFilter/SimpleFilter.vue')['default']>(
  () => import('./SimpleFilter/SimpleFilter.vue'), 'p'
)

/**
 * @author Howard
 * @description 步驟紀錄
 */
export const StepRecorder = useAsyncComponent(() => import('./StepRecord/StepRecord.vue'), 'rect')

/**
 * @author Howard
 * @description 時間維度切換
 */
export type {
  Types as TimeLevelManagementTypes,
  Props as TimeLevelManagementProps,
  Emits as TimeLevelManagementEmits,
  Expose as TimeLevelManagementExpose
} from './TimeLevelManagement/TimeLevelManagementInfo'
export { default as TimeLevelManagement } from './TimeLevelManagement/TimeLevelManagement.vue'
