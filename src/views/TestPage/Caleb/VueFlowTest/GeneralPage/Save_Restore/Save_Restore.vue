<script setup lang="ts">
import { ref } from 'vue'
// import { VueFlow } from '@vue-flow/core'
// import { Background as FlowBackground } from '@vue-flow/background'

import { VueFlow, FlowBackground } from '@/components/chart'
import SaveRestoreControls from './SaveRestoreControls.vue'

const nodes = ref([{ id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } }])

const edges = ref([])
</script>

<template>
  <VueFlow :nodes="nodes" :edges="edges">
    <SaveRestoreControls />

    <FlowBackground :size="1" />
  </VueFlow>
</template>

<style lang="scss" scoped>
.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.vue-flow__panel {
  background-color:#2d3748;
  padding:10px;
  border-radius:8px;
  box-shadow:0 0 10px #00000080
}
</style>
