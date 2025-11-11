// import { defineAsyncComponent } from 'vue'
import { useAsyncComponent } from '@/lib/lib_hook' // 自訂Composition API

/**
 * @author Caleb
 * @description 表格
 * @see https://element-plus.org/en-US/component/table.html
 */
export type {
  Types as BasicTableTypes,
  Props as ElTableProps,
  Emits as ElTableEmits,
  Expose as ElTableExpose
} from './BasicTable/BasicTableInfo'
export { default as BasicTable } from './BasicTable/BasicTable.vue'

/**
 * @contributors Howard, Caleb
 * @description 專案用表格
 * 功能: 紀錄欄位設定, 提供分頁
 */
export type {
  Types as CustomTableTypes,
  Props as CustomTableProps,
  Emits as CustomTableEmits,
  Expose as CustomTableExpose
} from './CustomTable/CustomTableInfo'
export { default as CustomTable } from './CustomTable/CustomTable.vue'

/**
 * @author Howard
 * @description 下載 Excel / PDF
 * 應用於 WebViewTable.vue 中
 * @see https://github.com/parallax/jsPDF
 */
// export type {
//   Types as DownloadModal,
//   Props as DownloadModal,
//   Emits as DownloadModal,
//   Expose as DownloadModalExpose
// } from './DownloadModal/DownloadModal'
export { default as DownloadModal } from './DownloadModal/DownloadModal.vue'

/**
 * @author Caleb
 * @description 簡易表格
 */
export type {
  Types as SimpleCustomTableTypes,
  Props as SimpleCustomTableProps,
  Emits as SimpleTableEmits,
  Expose as SimpleTableExpose
} from './SimpleTable/SimpleTableInfo'
export const SimpleTable = useAsyncComponent<typeof import('./SimpleTable/SimpleTable.vue')['default']>(
  () => import('./SimpleTable/SimpleTable.vue'), 'rect'
)

/**
 * @author Howard
 * @description 子表格
 * 應用於 WebViewTable.vue 中
 */
export { default as SubTable } from './SubTable/SubTable.vue'

/**
 * @author Caleb
 * @coauthor Howard
 * @description 時間線表格
 */
export type {
  Types as TimeLineCustomTableTypes,
  Props as TimeLineCustomTableProps,
  Emits as TimeLineTableEmits,
  Expose as TimeLineTableExpose
} from './TimeLineTable/TimeLineTableInfo'
export const TimeLineTable = useAsyncComponent<(typeof import('./TimeLineTable/TimeLineTable.vue'))['default']>(
  () => import('./TimeLineTable/TimeLineTable.vue'), 'rect'
)

/**
 * @author Caleb
 * @description VxeTable
 * 更加高效的表格渲染
 * 支援虛擬渲染
 * @see https://vxetable.cn/#/table/api
 */
export type {
  Types as VxeTableTypes,
  Props as VxeTableProps,
  Emits as VxeTableEmits,
  Expose as VxeTableExpose
} from './VxeTable/VxeTableInfo'
export { default as VxeTable } from './VxeTable/VxeTable.vue'
export { default as VxeColgroup } from './VxeTable/VxeColgroup/VxeColgroup.vue'
export { default as VxeColumn } from './VxeTable/VxeColumn/VxeColumn.vue'

/**
 * @contributors Howard, Caleb
 * @description 專案用特殊表格(SQLView) 需配合後端
 * 功能: 多欄位排序, 多欄位搜尋, 進階搜尋
 * @see https://vxetable.cn/#/table/api
 */
export type {
  Types as WebViewCustomTableTypes,
  Props as WebViewCustomTableProps,
  Emits as WebViewTableEmits,
  Expose as WebViewTableExpose
} from './WebViewTable/WebViewTableInfo'
export const WebViewTable = useAsyncComponent<(typeof import('./WebViewTable/WebViewTable.vue'))['default']>(
  () => import('./WebViewTable/WebViewTable.vue'), 'rect'
)
