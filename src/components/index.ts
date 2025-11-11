// import { defineAsyncComponent } from 'vue'
import { useAsyncComponent } from '@/lib/lib_hook' // 自訂Composition API

export type CustomSize = 'large' | 'default' | 'small'
export type CustomEffect = string | 'dark' | 'light'
export type CustomElType = string
  | ''
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
export type { Option, Options } from '@/types/types_columnSetting'


/**
 * @deprecated 使用 '@/components/feature' 代替
 */
export type {
  Types as CustomButtonTypes,
  Props as CustomButtonProps,
  Emits as CustomButtonEmits,
  Expose as CustomButtonExpose
} from './feature/CustomButton/CustomButtonInfo'
export { default as CustomButton } from './feature/CustomButton/CustomButton.vue'

export type {
  Types as CustomDraggableTypes,
  Props as CustomDraggableProps,
  Emits as CustomDraggableEmits,
  Expose as CustomDraggableExpose
} from './feature/CustomDraggable/CustomDraggableInfo'
export const CustomDraggable = useAsyncComponent<typeof import('./feature/CustomDraggable/CustomDraggable.vue')['default']>(
  () => import('./feature/CustomDraggable/CustomDraggable.vue'), 'rect'
)
export type {
  Types as CustomEmptyTypes,
  Props as CustomEmptyProps,
  Emits as CustomEmptyEmits,
  Expose as CustomEmptyExpose
} from './feature/CustomEmpty/CustomEmptyInfo'
export { default as CustomEmpty } from './feature/CustomEmpty/CustomEmpty.vue'
export type {
  Types as CustomIconTypes,
  Props as CustomIconProps,
  Emits as CustomIconEmits,
  Expose as CustomIconExpose
} from './feature/CustomIcon/CustomIconInfo'
export { default as CustomIcon } from './feature/CustomIcon/CustomIcon.vue'

export type {
  Types as CustomLinkTypes,
  Props as CustomLinkProps,
  Emits as CustomLinkEmits,
  Expose as CustomLinkExpose
} from './feature/CustomLink/CustomLinkInfo'
export { default as CustomLink } from './feature/CustomLink/CustomLink.vue'

export type {
  Types as CustomMarkdownTypes,
  Props as CustomMarkdownProps,
  Emits as CustomMarkdownEmits,
  Expose as CustomMarkdownExpose
} from './feature/CustomMarkdown/CustomMarkdownInfo'
export const CustomMarkdown = useAsyncComponent<typeof import('./feature/CustomMarkdown/CustomMarkdown.vue')['default']>(
  () => import('./feature/CustomMarkdown/CustomMarkdown.vue'), 'rect'
)
export type {
  Types as CustomModalTypes,
  Props as CustomModalProps,
  Emits as CustomModalEmits,
  Expose as CustomModalExpose
} from './feature/CustomModal/CustomModalInfo'
export { default as CustomModal } from './feature/CustomModal/CustomModal.vue'
export type {
  Types as CustomPopoverTypes,
  Props as CustomPopoverProps,
  Emits as CustomPopoverEmits,
  Expose as CustomPopoverExpose
} from './feature/CustomPopover/CustomPopoverInfo'
export const CustomPopover = useAsyncComponent<typeof import('./feature/CustomPopover/CustomPopover.vue')['default']>(
  () => import('./feature/CustomPopover/CustomPopover.vue'), 'p'
)

export type {
  Types as CustomScrollbarTypes,
  Props as CustomScrollbarProps,
  Emits as CustomScrollbarEmits,
  Expose as CustomScrollbarExpose
} from './feature/CustomScrollbar/CustomScrollbarInfo'
export { default as CustomScrollbar } from './feature/CustomScrollbar/CustomScrollbar.vue'

export type {
  Types as CustomTabsTypes,
  Props as CustomTabsProps,
  Emits as CustomTabsEmits,
  Expose as CustomTabsExpose
} from './feature/CustomTabs/CustomTabsInfo'
export const CustomTabs = useAsyncComponent<typeof import('./feature/CustomTabs/CustomTabs.vue')['default']>(
  () => import('./feature/CustomTabs/CustomTabs.vue'), 'h1'
)

export type {
  Types as CustomTooltipTypes,
  Props as CustomTooltipProps,
  Emits as CustomTooltipEmits,
  Expose as CustomTooltipExpose
} from './feature/CustomTooltip/CustomTooltipInfo'
export const CustomTooltip = useAsyncComponent<typeof import('./feature/CustomTooltip/CustomTooltip.vue')['default']>(
  () => import('./feature/CustomTooltip/CustomTooltip.vue'), 'p'
)

// input

/**
 * @deprecated 使用 '@/components/input' 代替
 */
export type {
  Types as CustomInputTypes,
  Props as CustomInputProps,
  Emits as CustomInputEmits,
  Expose as CustomInputExpose
} from './input/CustomInput/CustomInputInfo'
export { default as CustomInput } from './input/CustomInput/CustomInput.vue'
export type {
  Types as CustomSearchTypes,
  Props as CustomSearchProps,
  Emits as CustomSearchEmits,
  Expose as CustomSearchExpose
} from './input/CustomSearch/CustomSearchInfo'
export { default as CustomSearch } from './input/CustomSearch/CustomSearch.vue'
export type {
  Types as GroupSearchTypes,
  Props as GroupSearchProps,
  Emits as GroupSearchEmits,
  Expose as GroupSearchExpose
} from './input/CustomSearch/CustomSearchInfo'
export const GroupSearch = useAsyncComponent<typeof import('./input/CustomSearch/GroupSearch.vue')['default']>(
  () => import('./input/CustomSearch/GroupSearch.vue'), 'p'
)

export type {
  Types as FormListTypes,
  Props as FormListProps,
  Emits as FormListEmits,
  Expose as FormListExpose
} from './input/FormList/FormListInfo'
export const FormList = useAsyncComponent<typeof import('./input/FormList/FormList.vue')['default']>(
  () => import('./input/FormList/FormList.vue'), 'h1'
)

// table

/**
 * @deprecated 使用 '@/components/table' 代替
 */
export type {
  Types as CustomTableTypes,
  Props as CustomTableProps,
  Emits as CustomTableEmits,
  Expose as CustomTableExpose
} from './table/CustomTable/CustomTableInfo'
export { default as CustomTable } from './table/CustomTable/CustomTable.vue'
export type {
  Types as SimpleCustomTableTypes,
  Props as SimpleCustomTableProps,
  Emits as SimpleTableEmits,
  Expose as SimpleTableExpose
} from './table/SimpleTable/SimpleTableInfo'
export const SimpleTable = useAsyncComponent<typeof import('./table/SimpleTable/SimpleTable.vue')['default']>(
  () => import('./table/SimpleTable/SimpleTable.vue'), 'rect'
)
export type {
  Types as WebViewCustomTableTypes,
  Props as WebViewCustomTableProps,
  Emits as WebViewTableEmits,
  Expose as WebViewTableExpose
} from './table/WebViewTable/WebViewTableInfo'
export const WebViewTable = useAsyncComponent<(typeof import('./table/WebViewTable/WebViewTable.vue'))['default']>(
  () => import('./table/WebViewTable/WebViewTable.vue'), 'rect'
)
