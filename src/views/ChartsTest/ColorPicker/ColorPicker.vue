<script setup lang="ts">
import { ref } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import { Position } from '@vue-flow/core'
import VueFlow from './components/VueFlow.vue'
import { presets } from './components/presets'

// these are our nodes
const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'color-selector',
    data: { color: presets.ayame },
    position: { x: 0, y: 50 }
  },
  {
    id: '2',
    type: 'output',
    position: { x: 350, y: 114 },
    targetPosition: Position.Left
  }
])

// these are our edges
const edges = ref<Edge[]>([
  {
    id: 'e1a-2',
    source: '1',
    sourceHandle: 'a',
    target: '2',
    animated: true,
    style: {
      stroke: presets.ayame
    }
  }
])


</script>

<template>
  <div class="flow-container">
    <VueFlow
      v-model:nodes="nodes"
      :edges="edges"
    ></VueFlow>
  </div>
</template>

<style lang="scss" scoped>
.flow-container {
  width: 100%;
  height: 100%;
  padding: 16px 64px;
}
</style>
