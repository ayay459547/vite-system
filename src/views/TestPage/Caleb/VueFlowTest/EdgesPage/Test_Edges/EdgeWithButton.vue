<script setup lang="ts">
// import {
//   BaseEdge as FlowBaseEdge,
//   EdgeLabelRenderer as FlowEdgeLabelRenderer,
//   getBezierPath,
//   useVueFlow
// } from '@vue-flow/core'

import { FlowBaseEdge, FlowEdgeLabelRenderer } from '@/components/chart'
import { useVueFlow, getBezierPath } from '@/lib/lib_vueFlow'

import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  sourceX: {
    type: Number,
    required: true
  },
  sourceY: {
    type: Number,
    required: true
  },
  targetX: {
    type: Number,
    required: true
  },
  targetY: {
    type: Number,
    required: true
  },
  sourcePosition: {
    type: String,
    required: true
  },
  targetPosition: {
    type: String,
    required: true
  },
  markerEnd: {
    type: String,
    required: false
  },
  style: {
    type: Object,
    required: false
  }
})

const { removeEdges } = useVueFlow()

const path = computed(() => getBezierPath(props as any))
</script>

<template>
  <!-- You can use the `BaseEdge` component to create your own custom edge more easily -->
  <FlowBaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" />

  <!-- Use the `FlowEdgeLabelRenderer` to escape the SVG world of edges and render your own custom label in a `<div>` ctx -->
  <FlowEdgeLabelRenderer>
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`
      }"
      class="nodrag nopan"
    >
      <button class="edgebutton" @click="removeEdges(id)">×</button>
    </div>
  </FlowEdgeLabelRenderer>
</template>

<style lang="scss" scoped></style>
