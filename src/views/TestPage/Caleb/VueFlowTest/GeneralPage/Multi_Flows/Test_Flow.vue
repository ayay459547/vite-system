<script setup lang="ts">
import { ref } from 'vue'
// import { Background as FlowBackground } from '@vue-flow/background'
// import { Panel as FlowPanel, VueFlow } from '@vue-flow/core'

import { VueFlow, FlowPanel, FlowBackground } from '@/components/chart'
import { CustomButton } from '@/components/feature'

const nodes = ref<any[]>([
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    class: 'light'
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    class: 'light'
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    class: 'light'
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    class: 'light'
  }
])

const edges = ref([
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4' }
])

function toggleClass () {
  nodes.value = nodes.value.map((node: any) => {
    return {
      ...node,
      class: node.class === 'light' ? 'dark' : 'light'
    }
  })
}

function updatePos () {
  nodes.value = nodes.value.map((node: any) => {
    return {
      ...node,
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400
      }
    }
  })
}
</script>

<template>
  <VueFlow :nodes="nodes" :edges="edges" fit-view-on-init>
    <FlowBackground />

    <FlowPanel position="top-right">
      <CustomButton
        type="primary"
        label="update positions"
        style="margin-right: 12px"
        @click="updatePos"
      />
      <CustomButton
        type="primary"
        label="toggle class"
        @click="toggleClass"
      />
    </FlowPanel>
  </VueFlow>
</template>

<style lang="scss" scoped></style>
