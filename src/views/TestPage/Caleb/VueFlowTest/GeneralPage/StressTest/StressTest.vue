<script setup lang="ts">
import { nextTick, ref } from 'vue'

// import { Panel as FlowPanel, VueFlow, useVueFlow } from '@vue-flow/core'
// import { Background as FlowBackground } from '@vue-flow/background'
// import { MiniMap as FlowMiniMap } from '@vue-flow/minimap'

import {
  VueFlow,
  FlowBackground,
  FlowPanel,
  FlowMiniMap
} from '@/components/chart'
import { CustomButton } from '@/components/feature'
import { useVueFlow } from '@/lib/lib_vueFlow'

import { getElements } from './utils'

const { nodes: initialNodes, edges: initialEdges } = getElements(15, 15)

const nodes = ref(initialNodes)

const edges = ref(initialEdges)

const { dimensions, fitView } = useVueFlow()

function updatePos() {
  nodes.value = nodes.value.map((node: any) => {
    return {
      ...node,
      position: {
        x: Math.random() * dimensions.value.width,
        y: Math.random() * dimensions.value.height
      }
    }
  })

  nextTick(() => {
    fitView({ padding: 0.5 })
  })
}
</script>

<template>
  <VueFlow :nodes="nodes" :edges="edges" :min-zoom="0.1" fit-view-on-init>
    <FlowMiniMap />

    <FlowBackground />

    <FlowPanel position="top-right">
      <CustomButton
        type="primary"
        plain
        class="i-mr-md"
        icon-name="random"
        @click="updatePos"
      >
        update positions
      </CustomButton>
    </FlowPanel>
  </VueFlow>
</template>

<style lang="scss" scoped></style>
