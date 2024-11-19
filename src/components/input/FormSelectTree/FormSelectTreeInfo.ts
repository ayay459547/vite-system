import type {
  Props as FormSelectProps,
  Emits as FormSelectEmits,
  Expose as FormSelectExpose
} from '@/components/input/FormSelect/FormSelectInfo'
import { props as formSelectProps } from '@/components/input/FormSelect/FormSelectInfo'

export const version = '__FormSelectTree_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  // custom
  type Options = FormSelectProps.Options
  // select
  type ModelValue = FormSelectProps.ModelValue
  type Multiple = FormSelectProps.Multiple
  type Disabled = FormSelectProps.Disabled
  type ValueKey = FormSelectProps.ValueKey
  type Size = FormSelectProps.Size
  type Clearable = FormSelectProps.Clearable
  type CollapseTags = FormSelectProps.CollapseTags
  type CollapseTagsTooltip = FormSelectProps.CollapseTagsTooltip
  type MultipleLimit = FormSelectProps.MultipleLimit
  type Name = FormSelectProps.Name
  type Effect = FormSelectProps.Effect
  type Autocomplete = FormSelectProps.Autocomplete
  type Placeholder = FormSelectProps.Placeholder
  type Filterable = FormSelectProps.Filterable
  type AllowCreate = FormSelectProps.AllowCreate
  type FilterMethod = FormSelectProps.FilterMethod
  type Remote = FormSelectProps.Remote
  type RemoteMethod = FormSelectProps.RemoteMethod
  type RemoteShowSuffix = FormSelectProps.RemoteShowSuffix
  type Loading = FormSelectProps.Loading
  type LoadingText = FormSelectProps.LoadingText
  type NoMatchText = FormSelectProps.NoMatchText
  type NoDataText = FormSelectProps.NoDataText
  type PopperClass = FormSelectProps.PopperClass
  type ReserveKeyword = FormSelectProps.ReserveKeyword
  type DefaultFirstOption = FormSelectProps.DefaultFirstOption
  type Teleported = FormSelectProps.Teleported
  type AppendTo = FormSelectProps.AppendTo
  type Persistent = FormSelectProps.Persistent
  type AutomaticDropdown = FormSelectProps.AutomaticDropdown
  type ClearIcon = FormSelectProps.ClearIcon
  type FitInputWidth = FormSelectProps.FitInputWidth
  type SuffixIcon = FormSelectProps.SuffixIcon
  type TagType = FormSelectProps.TagType
  type TagEffect = FormSelectProps.TagEffect
  type ValidateEvent = FormSelectProps.ValidateEvent
  type Placement = FormSelectProps.Placement
  type FallbackPlacements = FormSelectProps.FallbackPlacements
  type MaxCollapseTags = FormSelectProps.MaxCollapseTags
  type PopperOptions = FormSelectProps.PopperOptions
  type AriaLabel = FormSelectProps.AriaLabel
  type EmptyValues = FormSelectProps.EmptyValues
  type ValueOnClear = FormSelectProps.ValueOnClear
  // tree
}
export const props = {
  ...formSelectProps
}

export declare namespace Emits {
  type Focus = FormSelectEmits.Focus
  type Clear = FormSelectEmits.Clear
  type Blur = FormSelectEmits.Blur
  type Change = FormSelectEmits.Change
  type RemoveTag = FormSelectEmits.RemoveTag
  type VisibleChange = FormSelectEmits.VisibleChange
}

export declare namespace Expose {
  type Focus = FormSelectExpose.Focus
  type Blur = FormSelectExpose.Blur
}

