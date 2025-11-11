<script setup lang="ts">
// import { Handle as FlowHandle, Position } from '@vue-flow/core'
// import { NodeResizer as FlowNodeResizer } from '@vue-flow/node-resizer'

import { FlowNodeResizer, FlowHandle } from '@/components/chart'
import { Position } from '@/lib/lib_vueFlow'

defineProps(['data'])
</script>

<template>
  <FlowNodeResizer :min-width="100" :min-height="30" />

  <FlowHandle type="target" :position="Position.Left" />
  <div style="padding: 10px">{{ data.label }}</div>
  <FlowHandle type="source" :position="Position.Right" />
</template>

<style lang="scss" scoped></style>
