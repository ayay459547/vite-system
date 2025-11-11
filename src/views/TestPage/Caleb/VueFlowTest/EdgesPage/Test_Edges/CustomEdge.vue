<script setup lang="ts">
// import { BaseEdge as FlowBaseEdge, getBezierPath } from '@vue-flow/core'

import { FlowBaseEdge } from '@/components/chart'
import { getBezierPath } from '@/lib/lib_vueFlow'

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
  data: {
    type: Object,
    required: false
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

const path = computed(() => getBezierPath(props as any))
</script>

<template>
  <FlowBaseEdge
    :id="id"
    :style="style"
    :path="path[0]"
    :marker-end="markerEnd"
    :label="data.text"
    :label-x="path[1]"
    :label-y="path[2]"
    :label-style="{ fill: 'white' }"
    :label-show-bg="true"
    :label-bg-style="{ fill: 'red' }"
    :label-bg-padding="[2, 4]"
    :label-bg-border-radius="2"
  />
</template>

<style lang="scss" scoped></style>
