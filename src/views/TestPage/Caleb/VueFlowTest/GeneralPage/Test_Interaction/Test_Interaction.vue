<script setup lang="ts">
import { ref } from 'vue'
// import { VueFlow } from '@vue-flow/core'

import { VueFlow } from '@/components/chart'
import InteractionControls from './InteractionControls.vue'

const nodes = ref<any[]>([
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 }
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 }
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 }
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 }
  }
])

const edges = ref<any[]>([
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4' }
])
</script>

<template>
  <VueFlow
    :nodes="nodes"
    :edges="edges"
    class="interaction-flow"
    fit-view-on-init
  >
    <InteractionControls />
  </VueFlow>
</template>

<style lang="scss" scoped>
.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.vue-flow__panel {
  background-color: #2d3748;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px #00000080;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  font-weight: 600;
}

.vue-flow__panel .label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.vue-flow__panel .label input {
  cursor: pointer;
}
</style>
