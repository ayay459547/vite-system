import type {
  Props as FormSelectProps,
  Emits as FormSelectEmits,
  Expose as FormSelectExpose
} from '@/components/input/FormSelect/FormSelectInfo'
import { props as formSelectProps } from '@/components/input/FormSelect/FormSelectInfo'

export const version = '__FormSelectTree_1.0.0__'

export interface Types {}

export interface Props {
  // custom
  options: FormSelectProps['options']
  // select
  modelValue: FormSelectProps['modelValue']
  multiple: FormSelectProps['multiple']
  disabled: FormSelectProps['disabled']
  valueKey: FormSelectProps['valueKey']
  size: FormSelectProps['size']
  clearable: FormSelectProps['clearable']
  collapseTags: FormSelectProps['collapseTags']
  collapseTagsTooltip: FormSelectProps['collapseTagsTooltip']
  multipleLimit: FormSelectProps['multipleLimit']
  name: FormSelectProps['name']
  effect: FormSelectProps['effect']
  autocomplete: FormSelectProps['autocomplete']
  placeholder: FormSelectProps['placeholder']
  filterable: FormSelectProps['filterable']
  allowCreate: FormSelectProps['allowCreate']
  filterMethod: FormSelectProps['filterMethod']
  remote: FormSelectProps['remote']
  remoteMethod: FormSelectProps['remoteMethod']
  remoteShowSuffix: FormSelectProps['remoteShowSuffix']
  loading: FormSelectProps['loading']
  loadingText: FormSelectProps['loadingText']
  noMatchText: FormSelectProps['noMatchText']
  noDataText: FormSelectProps['noDataText']
  popperClass: FormSelectProps['popperClass']
  reserveKeyword: FormSelectProps['reserveKeyword']
  defaultFirstOption: FormSelectProps['defaultFirstOption']
  teleported: FormSelectProps['teleported']
  appendTo: FormSelectProps['appendTo']
  persistent: FormSelectProps['persistent']
  automaticDropdown: FormSelectProps['automaticDropdown']
  clearIcon: FormSelectProps['clearIcon']
  fitInputWidth: FormSelectProps['fitInputWidth']
  suffixIcon: FormSelectProps['suffixIcon']
  tagType: FormSelectProps['tagType']
  tagEffect: FormSelectProps['tagEffect']
  validateEvent: FormSelectProps['validateEvent']
  placement: FormSelectProps['placement']
  fallbackPlacements: FormSelectProps['fallbackPlacements']
  maxCollapseTags: FormSelectProps['maxCollapseTags']
  popperOptions: FormSelectProps['popperOptions']
  ariaLabel: FormSelectProps['ariaLabel']
  emptyValues: FormSelectProps['emptyValues']
  valueOnClear: FormSelectProps['valueOnClear']
  // tree
}
export const props = {
  ...formSelectProps
}

export interface Emits {
  focus: FormSelectEmits['focus']
  clear: FormSelectEmits['clear']
  blur: FormSelectEmits['blur']
  change: FormSelectEmits['change']
  removeTag: FormSelectEmits['removeTag']
  visibleChange: FormSelectEmits['visibleChange']
}

export interface Expose {
  focus: FormSelectExpose['focus']
  blur: FormSelectExpose['blur']
}

