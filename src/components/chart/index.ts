// import { defineAsyncComponent } from 'vue'
import { VueFlow as __VueFlow__ } from '@vue-flow/core'

import { useAsyncComponent } from '@/lib/lib_hook' // 自訂Composition API

export { NodeResizer as FlowNodeResizer } from '@vue-flow/node-resizer'
export { NodeToolbar as FlowNodeToolbar } from '@vue-flow/node-toolbar'

/**
 * @author Caleb
 * @description echarts 應用
 * @see https://echarts.apache.org/zh/index.html
 */
export type {
  Types as CustomChartsTypes,
  Props as CustomChartsProps,
  Emits as CustomChartsEmits,
  Expose as CustomChartsExpose
} from './CustomCharts/CustomChartsInfo'
export const CustomCharts = useAsyncComponent<typeof import('./CustomCharts/CustomCharts.vue')['default']>(
  () => import('./CustomCharts/CustomCharts.vue'), 'rect'
)

/**
 * @author Howard
 * @description 甘特圖使用 詳細時間資訊
 */
export const DetailTime = useAsyncComponent<typeof import('./DetailTime/DetailTime.vue')['default']>(
  () => import('./DetailTime/DetailTime.vue'), 'rect'
)

/**
 * @author Caleb
 * @description 使用 echarts 呈現甘特圖
 */
export type {
  Types as GanttChartTypes,
  Props as GanttChartProps,
  Emits as GanttChartEmits,
  Expose as GanttChartExpose
} from './GanttChart/GanttChartInfo'
export const GanttChart = useAsyncComponent<typeof import('./GanttChart/GanttChart.vue')['default']>(
  () => import('./GanttChart/GanttChart.vue'), 'rect'
)

/**
 * @author Caleb
 * @description 分配一周時間
 */
export type {
  Types as WeekScheduleTypes,
  Props as WeekScheduleProps,
  Emits as WeekScheduleEmits,
  Expose as WeekScheduleExpose
} from './WeekSchedule/WeekScheduleInfo'
export const WeekSchedule = useAsyncComponent<typeof import('./WeekSchedule/WeekSchedule.vue')['default']>(
  () => import('./WeekSchedule/WeekSchedule.vue'), 'rect'
)

/**
 * @description VueFlow
 * @vue-flow/core
 */
export type {
  Types as VueFlowTypes,
  Props as VueFlowProps,
  Emits as VueFlowEmits,
  Expose as VueFlowExpose
} from './VueFlow/VueFlowInfo'
export const VueFlow = useAsyncComponent<InstanceType<typeof __VueFlow__>>(
  () => import('./VueFlow/VueFlow.vue'), 'rect'
)
export {
  Handle as FlowHandle,
  Panel as FlowPanel,
  StraightEdge as FlowStraightEdge,
  StepEdge as FlowStepEdge,
  BezierEdge as FlowBezierEdge,
  SimpleBezierEdge as FlowSimpleBezierEdge,
  SmoothStepEdge as FlowSmoothStepEdge,
  BaseEdge as FlowBaseEdge,
  EdgeText as FlowEdgeText,
  EdgeLabelRenderer as FlowEdgeLabelRenderer
} from '@vue-flow/core'

/**
 * @description VueFlow 背景
 * @vue-flow/background
 */
export type {
  Types as FlowBackgroundTypes,
  Props as FlowBackgroundProps,
  Emits as FlowBackgroundEmits,
  Expose as FlowBackgroundExpose
} from './VueFlow/FlowBackground/FlowBackgroundInfo'
export { default as FlowBackground } from './VueFlow/FlowBackground/FlowBackground.vue'

/**
 * @description VueFlow 小地圖(總覽)
 * @vue-flow/minimap
 */
export type {
  Types as FlowMiniMapTypes,
  Props as FlowMiniMapProps,
  Emits as FlowMiniMapEmits,
  Expose as FlowMiniMapExpose
} from './VueFlow/FlowMiniMap/FlowMiniMapInfo'
export { default as FlowMiniMap } from './VueFlow/FlowMiniMap/FlowMiniMap.vue'
export { MiniMapNode as FlowMiniMapNode } from '@vue-flow/minimap'

/**
 * @description VueFlow 控制區
 * @vue-flow/controls
 */
export type {
  Types as FlowControlsTypes,
  Props as FlowControlsProps,
  Emits as FlowControlsEmits,
  Expose as FlowControlsExpose
} from './VueFlow/FlowControls/FlowControlsInfo'
export const FlowControls = useAsyncComponent<typeof import('./VueFlow/FlowControls/FlowControls.vue')['default']>(
  () => import('./VueFlow/FlowControls/FlowControls.vue'), 'rect'
)
export { ControlButton as FlowControlButton } from '@vue-flow/controls'
