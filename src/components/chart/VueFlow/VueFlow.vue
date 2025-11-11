<script setup lang="ts">
import { useSlots, computed } from 'vue'
import { VueFlow } from '@vue-flow/core'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具
import type { Props } from './VueFlowInfo'
import { version, props as vueFlowProps } from './VueFlowInfo'

const scopedId = getUuid(version)

const props = defineProps(vueFlowProps)
const emit = defineEmits([
  'nodesChange', 'edgesChange', 'nodeDoubleClick', 'nodeClick',
  'nodeMouseEnter', 'nodeMouseMove', 'nodeMouseLeave',
  'nodeContextMenu', 'nodeDragStart', 'nodeDrag', 'nodeDragStop',
  'nodesInitialized', 'updateNodeInternals',
  'miniMapNodeClick', 'miniMapNodeDoubleClick', 'miniMapNodeMouseEnter', 'miniMapNodeMouseMove', 'miniMapNodeMouseLeave',
  'connect', 'connectStart', 'connectEnd',
  'clickConnectStart', 'clickConnectEnd',
  'paneReady', 'init', 'move', 'moveStart', 'moveEnd',
  'selectionDragStart', 'selectionDrag', 'selectionDragStop', 'selectionContextMenu', 'selectionStart', 'selectionEnd',
  'viewportChangeStart', 'viewportChange', 'viewportChangeEnd',
  'paneScroll', 'paneClick', 'paneContextMenu', 'paneMouseEnter', 'paneMouseMove', 'paneMouseLeave',
  'edgeContextMenu', 'edgeMouseEnter', 'edgeMouseMove', 'edgeMouseLeave',
  'edgeDoubleClick', 'edgeClick', 'edgeUpdateStart', 'edgeUpdate', 'edgeUpdateEnd',
  'error',
  'update:nodes', 'update:edges'
])

const tempNodes = computed({
  get: () => props.nodes,
  set: (v: Props['nodes']) => {
    emit('update:nodes', v)
  }
})
const tempEdges = computed({
  get: () => props.edges,
  set: (v: Props['edges']) => {
    emit('update:edges', v)
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

</script>

<template>
  <VueFlow
    :class="`${scopedId}`"
    :id="props.id"
    v-model:nodes="tempNodes"
    v-model:edges="tempEdges"
    :edgeTypes="props.edgeTypes"
    :nodeTypes="props.nodeTypes"
    :connectionMode="props.connectionMode"
    :connectionLineOptions="props.connectionLineOptions"
    :connectionRadius="props.connectionRadius"
    :isValidConnection="props.isValidConnection"
    :deleteKeyCode="props.deleteKeyCode"
    :selectionKeyCode="props.selectionKeyCode"
    :multiSelectionKeyCode="props.multiSelectionKeyCode"
    :zoomActivationKeyCode="props.zoomActivationKeyCode"
    :panActivationKeyCode="props.panActivationKeyCode"
    :snapToGrid="props.snapToGrid"
    :snapGrid="props.snapGrid"
    :onlyRenderVisibleElements="props.onlyRenderVisibleElements"
    :edgesUpdatable="props.edgesUpdatable"
    :nodesDraggable="props.nodesDraggable"
    :nodesConnectable="props.nodesConnectable"
    :nodeDragThreshold="props.nodeDragThreshold"
    :elementsSelectable="props.elementsSelectable"
    :selectNodesOnDrag="props.selectNodesOnDrag"
    :panOnDrag="props.panOnDrag"
    :minZoom="props.minZoom"
    :maxZoom="props.maxZoom"
    :defaultViewport="props.defaultViewport"
    :translateExtent="props.translateExtent"
    :nodeExtent="props.nodeExtent"
    :defaultMarkerColor="props.defaultMarkerColor"
    :zoomOnScroll="props.zoomOnScroll"
    :zoomOnPinch="props.zoomOnPinch"
    :panOnScroll="props.panOnScroll"
    :panOnScrollSpeed="props.panOnScrollSpeed"
    :panOnScrollMode="props.panOnScrollMode"
    :paneClickDistance="props.paneClickDistance"
    :zoomOnDoubleClick="props.zoomOnDoubleClick"
    :preventScrolling="props.preventScrolling"
    :selectionMode="props.selectionMode"
    :edgeUpdaterRadius="props.edgeUpdaterRadius"
    :fitViewOnInit="props.fitViewOnInit"
    :connectOnClick="props.connectOnClick"
    :noDragClassName="props.noDragClassName"
    :noWheelClassName="props.noWheelClassName"
    :noPanClassName="props.noPanClassName"
    :defaultEdgeOptions="props.defaultEdgeOptions"
    :elevateEdgesOnSelect="props.elevateEdgesOnSelect"
    :elevateNodesOnSelect="props.elevateNodesOnSelect"
    :disableKeyboardA11y="props.disableKeyboardA11y"
    :edgesFocusable="props.edgesFocusable"
    :nodesFocusable="props.nodesFocusable"
    :autoPanOnConnect="props.autoPanOnConnect"
    :autoPanOnNodeDrag="props.autoPanOnNodeDrag"
    :autoPanSpeed="props.autoPanSpeed"
    @nodesChange="($event) => emit('nodesChange', $event)"
    @edgesChange="($event) => emit('edgesChange', $event)"
    @nodeDoubleClick="($event) => emit('nodeDoubleClick', $event)"
    @nodeClick="($event) => emit('nodeClick', $event)"
    @nodeMouseEnter="($event) => emit('nodeMouseEnter', $event)"
    @nodeMouseMove="($event) => emit('nodeMouseMove', $event)"
    @nodeMouseLeave="($event) => emit('nodeMouseLeave', $event)"
    @nodeContextMenu="($event) => emit('nodeContextMenu', $event)"
    @nodeDragStart="($event) => emit('nodeDragStart', $event)"
    @nodeDrag="($event) => emit('nodeDrag', $event)"
    @nodeDragStop="($event) => emit('nodeDragStop', $event)"
    @nodesInitialized="() => emit('nodesInitialized')"
    @updateNodeInternals="() => emit('updateNodeInternals')"
    @miniMapNodeClick="($event) => emit('miniMapNodeClick', $event)"
    @miniMapNodeDoubleClick="($event) => emit('miniMapNodeDoubleClick', $event)"
    @miniMapNodeMouseEnter="($event) => emit('miniMapNodeMouseEnter', $event)"
    @miniMapNodeMouseMove="($event) => emit('miniMapNodeMouseMove', $event)"
    @miniMapNodeMouseLeave="($event) => emit('miniMapNodeMouseLeave', $event)"
    @connect="($event) => emit('connect', $event)"
    @connectStart="($event) => emit('connectStart', $event)"
    @connectEnd="($event) => emit('connectEnd', $event)"
    @clickConnectStart="($event) => emit('clickConnectStart', $event)"
    @clickConnectEnd="($event) => emit('clickConnectEnd', $event)"
    @paneReady="($event) => emit('paneReady', $event)"
    @init="($event) => emit('init', $event)"
    @move="($event) => emit('move', $event)"
    @moveStart="($event) => emit('moveStart', $event)"
    @moveEnd="($event) => emit('moveEnd', $event)"
    @selectionDragStart="($event) => emit('selectionDragStart', $event)"
    @selectionDrag="($event) => emit('selectionDrag', $event)"
    @selectionDragStop="($event) => emit('selectionDragStop', $event)"
    @selectionContextMenu="($event) => emit('selectionContextMenu', $event)"
    @selectionStart="($event) => emit('selectionStart', $event)"
    @selectionEnd="($event) => emit('selectionEnd', $event)"
    @viewportChangeStart="($event) => emit('viewportChangeStart', $event)"
    @viewportChange="($event) => emit('viewportChange', $event)"
    @viewportChangeEnd="($event) => emit('viewportChangeEnd', $event)"
    @paneScroll="($event) => emit('paneScroll', $event)"
    @paneClick="($event) => emit('paneClick', $event)"
    @paneContextMenu="($event) => emit('paneContextMenu', $event)"
    @paneMouseEnter="($event) => emit('paneMouseEnter', $event)"
    @paneMouseMove="($event) => emit('paneMouseMove', $event)"
    @paneMouseLeave="($event) => emit('paneMouseLeave', $event)"
    @edgeContextMenu="($event) => emit('edgeContextMenu', $event)"
    @edgeMouseEnter="($event) => emit('edgeMouseEnter', $event)"
    @edgeMouseMove="($event) => emit('edgeMouseMove', $event)"
    @edgeMouseLeave="($event) => emit('edgeMouseLeave', $event)"
    @edgeDoubleClick="($event) => emit('edgeDoubleClick', $event)"
    @edgeClick="($event) => emit('edgeClick', $event)"
    @edgeUpdateStart="($event) => emit('edgeUpdateStart', $event)"
    @edgeUpdate="($event) => emit('edgeUpdate', $event)"
    @edgeUpdateEnd="($event) => emit('edgeUpdateEnd', $event)"
    @error="($event) => emit('error', $event)"
  >
    <!-- #node-{key} / #edge-{key} -->
    <template
      v-for="slotName in Object.keys(slots)"
      :key="slotName"
      #[slotName]="scope"
    >
      <slot :name="slotName" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('default')" #default>
      <slot name="default"></slot>
    </template>
    <template v-if="hasSlot('connection-line')" #connection-line="scope">
      <slot name="connection-line" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('zoom-pane')" #zoom-pane>
      <slot name="zoom-pane"></slot>
    </template>
  </VueFlow>
</template>

<style lang="scss" scoped></style>
