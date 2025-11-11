<script setup lang="ts">
import { ref } from 'vue'
// import { VueFlow } from '@vue-flow/core'
import { VueFlow } from '@/components/chart'

import ResizableNode from './ResizableNode.vue'

const nodes = ref([
  {
    id: '1',
    type: 'resizable',
    data: { label: 'NodeResizer' },
    position: { x: 0, y: 0 },
    style: {
      background: '#fff',
      border: '3px solid black',
      textAlign: 'center'
    }
  }
])
</script>

<template>
  <VueFlow :nodes="nodes" fit-view-on-init>
    <template #node-resizable="resizableNodeProps">
      <ResizableNode :data="resizableNodeProps.data" />
    </template>
  </VueFlow>
</template>

<style lang="scss" scoped></style>
