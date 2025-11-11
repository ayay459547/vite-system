<script setup lang="ts">
import { computed } from 'vue'
// import { BaseEdge as FlowBaseEdge, getBezierPath, useVueFlow } from '@vue-flow/core'

import { FlowBaseEdge } from '@/components/chart'
import { useVueFlow, getBezierPath } from '@/lib/lib_vueFlow'

import Test_CustomMarker from './Test_CustomMarker.vue'

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
  source: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: false
  }
})

const { findNode } = useVueFlow()

const path = computed(() => getBezierPath(props as any))

const markerId = computed(() => `${props.id}-marker`)

const markerColor = computed(() => {
  const sourceNode = findNode(props.source)
  const targetNode = findNode(props.target)

  if (sourceNode.selected) {
    return '#ff0072'
  }

  if (targetNode.selected) {
    return '#2563eb'
  }

  return '#4a5568'
})

const markerType = computed(() => {
  const sourceNode = findNode(props.source)
  const targetNode = findNode(props.target)

  if (sourceNode.selected) {
    return 'diamond'
  }

  if (targetNode.selected) {
    return 'circle'
  }

  return 'square'
})
</script>

<template>
  <FlowBaseEdge
    :id="id"
    :path="path[0]"
    :marker-end="`url(#${markerId})`"
    :marker-start="`url(#${markerId})`"
    :label="`${markerType} marker`"
    :label-x="path[1]"
    :label-y="path[2]"
    :label-bg-style="{ fill: 'whitesmoke' }"
  />
  <Test_CustomMarker
    :id="markerId"
    :type="markerType"
    :stroke="markerColor"
    :stroke-width="2"
    :width="20"
    :height="20"
  />
</template>

<style lang="scss" scoped></style>
