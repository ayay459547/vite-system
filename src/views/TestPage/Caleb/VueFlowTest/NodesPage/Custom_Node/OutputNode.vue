<script setup lang="ts">
// import {
//   Handle as FlowHandle,
//   Position,
//   useNodeConnections,
//   useNodesData
// } from '@vue-flow/core'

import { FlowHandle } from '@/components/chart'
import {
  Position,
  useNodeConnections,
  useNodesData
 } from '@/lib/lib_vueFlow'

const connections = useNodeConnections({
  handleType: 'target'
})

const nodesData = useNodesData(() => connections.value[0]?.source)
</script>

<template>
  <FlowHandle
    type="target"
    :position="Position.Left"
    :style="{
      height: '16px',
      width: '6px',
      backgroundColor: nodesData.data?.color,
      filter: 'invert(100%)'
    }"
  />
  {{ nodesData.data?.isGradient ? 'GRADIENT' : nodesData.data?.color }}
</template>

<style lang="scss" scoped></style>
