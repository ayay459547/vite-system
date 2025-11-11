import type { PropType } from 'vue'

import type {
  FlowProps, FlowEmits, VueFlowStore, VueFlowError, ErrorCode,
  NodeChange, EdgeChange, GraphNode, Connection,
  EdgeMouseEvent, EdgeUpdateEvent, NodeDragEvent, NodeMouseEvent,
  OnConnectStartParams, ViewportTransform
} from '@vue-flow/core'
import type { EventHookTrigger } from '@vueuse/shared'

export const version = '__VueFlow_1.0.0__'

export interface Types {}

export interface Props {
  id: FlowProps['id']
  nodes: FlowProps['nodes']
  edges: FlowProps['edges']
  edgeTypes: FlowProps['edgeTypes']
  nodeTypes: FlowProps['nodeTypes']
  connectionMode: FlowProps['connectionMode']
  connectionLineOptions: FlowProps['connectionLineOptions']
  connectionRadius: FlowProps['connectionRadius']
  isValidConnection: FlowProps['isValidConnection']
  deleteKeyCode: FlowProps['deleteKeyCode']
  selectionKeyCode: FlowProps['selectionKeyCode']
  multiSelectionKeyCode: FlowProps['multiSelectionKeyCode']
  zoomActivationKeyCode: FlowProps['zoomActivationKeyCode']
  panActivationKeyCode: FlowProps['panActivationKeyCode']
  snapToGrid: FlowProps['snapToGrid']
  snapGrid: FlowProps['snapGrid']
  onlyRenderVisibleElements: FlowProps['onlyRenderVisibleElements']
  edgesUpdatable: FlowProps['edgesUpdatable']
  nodesDraggable: FlowProps['nodesDraggable']
  nodesConnectable: FlowProps['nodesConnectable']
  nodeDragThreshold: FlowProps['nodeDragThreshold']
  elementsSelectable: FlowProps['elementsSelectable']
  selectNodesOnDrag: FlowProps['selectNodesOnDrag']
  panOnDrag: FlowProps['panOnDrag']
  minZoom: FlowProps['minZoom']
  maxZoom: FlowProps['maxZoom']
  defaultViewport: FlowProps['defaultViewport']
  translateExtent: FlowProps['translateExtent']
  nodeExtent: FlowProps['nodeExtent']
  defaultMarkerColor: FlowProps['defaultMarkerColor']
  zoomOnScroll: FlowProps['zoomOnScroll']
  zoomOnPinch: FlowProps['zoomOnPinch']
  panOnScroll: FlowProps['panOnScroll']
  panOnScrollSpeed: FlowProps['panOnScrollSpeed']
  panOnScrollMode: FlowProps['panOnScrollMode']
  paneClickDistance: FlowProps['paneClickDistance']
  zoomOnDoubleClick: FlowProps['zoomOnDoubleClick']
  preventScrolling: FlowProps['preventScrolling']
  selectionMode: FlowProps['selectionMode']
  edgeUpdaterRadius: FlowProps['edgeUpdaterRadius']
  fitViewOnInit: FlowProps['fitViewOnInit']
  connectOnClick: FlowProps['connectOnClick']
  noDragClassName: FlowProps['noDragClassName']
  noWheelClassName: FlowProps['noWheelClassName']
  noPanClassName: FlowProps['noPanClassName']
  defaultEdgeOptions: FlowProps['defaultEdgeOptions']
  elevateEdgesOnSelect: FlowProps['elevateEdgesOnSelect']
  elevateNodesOnSelect: FlowProps['elevateNodesOnSelect']
  disableKeyboardA11y: FlowProps['disableKeyboardA11y']
  edgesFocusable: FlowProps['edgesFocusable']
  nodesFocusable: FlowProps['nodesFocusable']
  autoPanOnConnect: FlowProps['autoPanOnConnect']
  autoPanOnNodeDrag: FlowProps['autoPanOnNodeDrag']
  autoPanSpeed: FlowProps['autoPanSpeed']
}

/**
 * https://vueflow.dev/guide/vue-flow/config.html
 */
export const props = {
  id: {
    type: String as PropType<Props['id']>,
    required: false,
    default: undefined,
    description: '唯一值'
  },
  nodes: {
    type: Array as PropType<Props['nodes']>,
    required: false,
    default: undefined,
    description: '節點'
  },
  edges: {
    type: Array as PropType<Props['edges']>,
    required: false,
    default: undefined,
    description: 'edges'
  },
  edgeTypes: {
    type: Object as PropType<Props['edgeTypes']>,
    required: false,
    default: undefined,
    description: 'edgeTypes'
  },
  nodeTypes: {
    type: Object as PropType<Props['nodeTypes']>,
    required: false,
    default: undefined,
    description: 'nodeTypes'
  },
  connectionMode: {
    type: Object as PropType<Props['connectionMode']>,
    required: false,
    default: undefined,
    description: 'connectionMode'
  },
  connectionLineOptions: {
    type: Object as PropType<Props['connectionLineOptions']>,
    required: false,
    default: undefined,
    description: 'connectionLineOptions'
  },
  connectionRadius: {
    type: Number as PropType<Props['connectionRadius']>,
    required: false,
    default: undefined,
    description: 'connectionRadius'
  },
  isValidConnection: {
    type: Object as PropType<Props['isValidConnection']>,
    required: false,
    default: undefined,
    description: 'isValidConnection'
  },
  deleteKeyCode: {
    type: [Boolean, String, Array, Object] as PropType<Props['deleteKeyCode']>,
    required: false,
    default: undefined,
    description: 'deleteKeyCode'
  },
  selectionKeyCode: {
    type: [Boolean, String, Array, Object] as PropType<Props['selectionKeyCode']>,
    required: false,
    default: undefined,
    description: 'selectionKeyCode'
  },
  multiSelectionKeyCode: {
    type: [Boolean, String, Array, Object] as PropType<Props['multiSelectionKeyCode']>,
    required: false,
    default: undefined,
    description: 'multiSelectionKeyCode'
  },
  zoomActivationKeyCode: {
    type: [Boolean, String, Array, Object] as PropType<Props['zoomActivationKeyCode']>,
    required: false,
    default: undefined,
    description: 'zoomActivationKeyCode'
  },
  panActivationKeyCode: {
    type: [Boolean, String, Array, Object] as PropType<Props['panActivationKeyCode']>,
    required: false,
    default: undefined,
    description: 'panActivationKeyCode'
  },
  snapToGrid: {
    type: Boolean as PropType<Props['snapToGrid']>,
    required: false,
    default: undefined,
    description: 'snapToGrid'
  },
  snapGrid: {
    type: Object as PropType<Props['snapGrid']>,
    required: false,
    default: undefined,
    description: 'snapGrid'
  },
  onlyRenderVisibleElements: {
    type: Boolean as PropType<Props['onlyRenderVisibleElements']>,
    required: false,
    default: undefined,
    description: 'onlyRenderVisibleElements'
  },
  edgesUpdatable: {
    type: [Boolean, String] as PropType<Props['edgesUpdatable']>,
    required: false,
    default: undefined,
    description: 'edgesUpdatable'
  },
  nodesDraggable: {
    type: Boolean as PropType<Props['nodesDraggable']>,
    required: false,
    default: undefined,
    description: 'nodesDraggable'
  },
  nodesConnectable: {
    type: Boolean as PropType<Props['nodesConnectable']>,
    required: false,
    default: undefined,
    description: 'nodesConnectable'
  },
  nodeDragThreshold: {
    type: Number as PropType<Props['nodeDragThreshold']>,
    required: false,
    default: undefined,
    description: 'nodeDragThreshold'
  },
  elementsSelectable: {
    type: Boolean as PropType<Props['elementsSelectable']>,
    required: false,
    default: undefined,
    description: 'elementsSelectable'
  },
  selectNodesOnDrag: {
    type: Boolean as PropType<Props['selectNodesOnDrag']>,
    required: false,
    default: undefined,
    description: 'selectNodesOnDrag'
  },
  panOnDrag: {
    type: [Boolean, Array] as PropType<Props['panOnDrag']>,
    required: false,
    default: undefined,
    description: 'panOnDrag'
  },
  minZoom: {
    type: Number as PropType<Props['minZoom']>,
    required: false,
    default: undefined,
    description: 'minZoom'
  },
  maxZoom: {
    type: Number as PropType<Props['maxZoom']>,
    required: false,
    default: undefined,
    description: 'maxZoom'
  },
  defaultViewport: {
    type: [Object, Array] as PropType<Props['defaultViewport']>,
    required: false,
    default: undefined,
    description: 'defaultViewport'
  },
  translateExtent: {
    type: [Object, Array] as PropType<Props['translateExtent']>,
    required: false,
    default: undefined,
    description: 'translateExtent'
  },
  nodeExtent: {
    type: [Object, Array] as PropType<Props['nodeExtent']>,
    required: false,
    default: undefined,
    description: 'nodeExtent'
  },
  defaultMarkerColor: {
    type: String as PropType<Props['defaultMarkerColor']>,
    required: false,
    default: undefined,
    description: 'defaultMarkerColor'
  },
  zoomOnScroll: {
    type: Boolean as PropType<Props['zoomOnScroll']>,
    required: false,
    default: undefined,
    description: 'zoomOnScroll'
  },
  zoomOnPinch: {
    type: Boolean as PropType<Props['zoomOnPinch']>,
    required: false,
    default: undefined,
    description: 'zoomOnPinch'
  },
  panOnScroll: {
    type: Boolean as PropType<Props['panOnScroll']>,
    required: false,
    default: undefined,
    description: 'panOnScroll'
  },
  panOnScrollSpeed: {
    type: Number as PropType<Props['panOnScrollSpeed']>,
    required: false,
    default: undefined,
    description: 'panOnScrollSpeed'
  },
  panOnScrollMode: {
    type: Object as PropType<Props['panOnScrollMode']>,
    required: false,
    default: undefined,
    description: 'panOnScrollMode'
  },
  paneClickDistance: {
    type: Number as PropType<Props['paneClickDistance']>,
    required: false,
    default: undefined,
    description: 'paneClickDistance'
  },
  zoomOnDoubleClick: {
    type: Boolean as PropType<Props['zoomOnDoubleClick']>,
    required: false,
    default: undefined,
    description: 'zoomOnDoubleClick'
  },
  preventScrolling: {
    type: Boolean as PropType<Props['preventScrolling']>,
    required: false,
    default: undefined,
    description: 'preventScrolling'
  },
  selectionMode: {
    type: String as PropType<Props['selectionMode']>,
    required: false,
    default: undefined,
    description: 'selectionMode'
  },
  edgeUpdaterRadius: {
    type: Number as PropType<Props['edgeUpdaterRadius']>,
    required: false,
    default: undefined,
    description: 'edgeUpdaterRadius'
  },
  fitViewOnInit: {
    type: Boolean as PropType<Props['fitViewOnInit']>,
    required: false,
    default: undefined,
    description: 'fitViewOnInit'
  },
  connectOnClick: {
    type: Boolean as PropType<Props['connectOnClick']>,
    required: false,
    default: undefined,
    description: 'connectOnClick'
  },
  noDragClassName: {
    type: String as PropType<Props['noDragClassName']>,
    required: false,
    default: undefined,
    description: 'noDragClassName'
  },
  noWheelClassName: {
    type: String as PropType<Props['noWheelClassName']>,
    required: false,
    default: undefined,
    description: 'noWheelClassName'
  },
  noPanClassName: {
    type: String as PropType<Props['noPanClassName']>,
    required: false,
    default: undefined,
    description: 'noPanClassName'
  },
  defaultEdgeOptions: {
    type: Object as PropType<Props['defaultEdgeOptions']>,
    required: false,
    default: undefined,
    description: 'defaultEdgeOptions'
  },
  elevateEdgesOnSelect: {
    type: Boolean as PropType<Props['elevateEdgesOnSelect']>,
    required: false,
    default: undefined,
    description: 'elevateEdgesOnSelect'
  },
  elevateNodesOnSelect: {
    type: Boolean as PropType<Props['elevateNodesOnSelect']>,
    required: false,
    default: undefined,
    description: 'elevateNodesOnSelect'
  },
  disableKeyboardA11y: {
    type: Boolean as PropType<Props['disableKeyboardA11y']>,
    required: false,
    default: undefined,
    description: 'disableKeyboardA11y'
  },
  edgesFocusable: {
    type: Boolean as PropType<Props['edgesFocusable']>,
    required: false,
    default: undefined,
    description: 'edgesFocusable'
  },
  nodesFocusable: {
    type: Boolean as PropType<Props['nodesFocusable']>,
    required: false,
    default: undefined,
    description: 'nodesFocusable'
  },
  autoPanOnConnect: {
    type: Boolean as PropType<Props['autoPanOnConnect']>,
    required: false,
    default: undefined,
    description: 'autoPanOnConnect'
  },
  autoPanOnNodeDrag: {
    type: Boolean as PropType<Props['autoPanOnNodeDrag']>,
    required: false,
    default: undefined,
    description: 'autoPanOnNodeDrag'
  },
  autoPanSpeed: {
    type: Number as PropType<Props['autoPanSpeed']>,
    required: false,
    default: undefined,
    description: 'autoPanSpeed'
  }
}

export interface Emits extends FlowEmits {
  nodesChange: EventHookTrigger<NodeChange[]>
  edgesChange: EventHookTrigger<EdgeChange[]>
  nodeDoubleClick: EventHookTrigger<NodeMouseEvent>
  nodeClick: EventHookTrigger<NodeMouseEvent>
  nodeMouseEnter: EventHookTrigger<NodeMouseEvent>
  nodeMouseMove: EventHookTrigger<NodeMouseEvent>
  nodeMouseLeave: EventHookTrigger<NodeMouseEvent>
  nodeContextMenu: EventHookTrigger<NodeMouseEvent>
  nodeDragStart: EventHookTrigger<NodeDragEvent>
  nodeDrag: EventHookTrigger<NodeDragEvent>
  nodeDragStop: EventHookTrigger<NodeDragEvent>
  nodesInitialized: EventHookTrigger<GraphNode<any, any, string>[]>
  updateNodeInternals: EventHookTrigger<string[]>
  miniMapNodeClick: EventHookTrigger<string[]>
  miniMapNodeDoubleClick: EventHookTrigger<NodeMouseEvent>
  miniMapNodeMouseEnter: EventHookTrigger<NodeMouseEvent>
  miniMapNodeMouseMove: EventHookTrigger<NodeMouseEvent>
  miniMapNodeMouseLeave: EventHookTrigger<NodeMouseEvent>
  connect: EventHookTrigger<Connection>
  connectStart:EventHookTrigger<{
    event?: MouseEvent | TouchEvent | undefined
  } & OnConnectStartParams>
  connectEnd: EventHookTrigger<MouseEvent | TouchEvent>
  clickConnectStart: EventHookTrigger<{
    event?: MouseEvent | TouchEvent | undefined
  } & OnConnectStartParams>
  clickConnectEnd: EventHookTrigger<MouseEvent | TouchEvent>
  paneReady: EventHookTrigger<VueFlowStore>
  init: EventHookTrigger<VueFlowStore>
  move: EventHookTrigger<{
    event: WheelEvent | any
    flowTransform: ViewportTransform
  }>
  moveStart: EventHookTrigger<{
    event: WheelEvent | any
    flowTransform: ViewportTransform
  }>
  moveEnd: EventHookTrigger<{
    event: WheelEvent | any
    flowTransform: ViewportTransform
  }>
  selectionDragStart: EventHookTrigger<NodeDragEvent>
  selectionDrag: EventHookTrigger<NodeDragEvent>
  selectionDragStop: EventHookTrigger<NodeDragEvent>
  selectionContextMenu: EventHookTrigger<{
    event: MouseEvent
    nodes: GraphNode<any, any, string>[]
  }>
  selectionStart: EventHookTrigger<MouseEvent>
  selectionEnd: EventHookTrigger<MouseEvent>
  viewportChangeStart: EventHookTrigger<ViewportTransform>
  viewportChange: EventHookTrigger<ViewportTransform>
  viewportChangeEnd: EventHookTrigger<ViewportTransform>
  paneScroll: EventHookTrigger<WheelEvent>
  paneClick: EventHookTrigger<MouseEvent>
  paneContextMenu: EventHookTrigger<MouseEvent>
  paneMouseEnter: EventHookTrigger<PointerEvent>
  paneMouseMove: EventHookTrigger<PointerEvent>
  paneMouseLeave: EventHookTrigger<PointerEvent>
  edgeContextMenu: EventHookTrigger<EdgeMouseEvent>
  edgeMouseEnter: EventHookTrigger<EdgeMouseEvent>
  edgeMouseMove: EventHookTrigger<EdgeMouseEvent>
  edgeMouseLeave: EventHookTrigger<EdgeMouseEvent>
  edgeDoubleClick: EventHookTrigger<EdgeMouseEvent>
  edgeClick: EventHookTrigger<EdgeMouseEvent>
  edgeUpdateStart: EventHookTrigger<EdgeMouseEvent>
  edgeUpdate: EventHookTrigger<EdgeUpdateEvent>
  edgeUpdateEnd: EventHookTrigger<EdgeMouseEvent>
  error: EventHookTrigger<VueFlowError<ErrorCode, any>>
}

export interface Expose {}
