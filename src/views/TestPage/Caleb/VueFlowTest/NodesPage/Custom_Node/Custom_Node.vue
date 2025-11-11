<script setup lang="ts">
import { ref, toRef } from 'vue'
// import { MiniMap as FlowMiniMap } from '@vue-flow/minimap'
// import { Position, VueFlow } from '@vue-flow/core'

import { VueFlow, FlowMiniMap } from '@/components/chart'
import { Position } from '@/lib/lib_vueFlow'

import ColorSelectorNode from './ColorSelectorNode.vue'
import OutputNode from './OutputNode.vue'
import { presets } from './presets'

const nodes = ref<any[]>([
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

const edges = ref([
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

const colorSelectorData = toRef(() => nodes.value[0].data)

// minimap stroke color functions
function nodeStroke(n) {
  switch (n.type) {
    case 'input':
      return '#0041d0'
    case 'color-selector':
      return n.data.color
    case 'output':
      return '#ff0072'
    default:
      return '#eee'
  }
}

function nodeColor(n) {
  if (n.type === 'color-selector') {
    return n.data.color
  }

  return '#fff'
}
</script>

<template>
  <VueFlow
    v-model:nodes="nodes"
    :edges="edges"
    class="custom-node-flow"
    :class="[colorSelectorData?.isGradient ? 'animated-bg-gradient' : '']"
    :style="{ backgroundColor: colorSelectorData?.color }"
    fit-view-on-init
  >
    <template #node-color-selector="props">
      <ColorSelectorNode :id="props.id" :data="props.data" />
    </template>

    <template #node-output>
      <OutputNode />
    </template>

    <FlowMiniMap :node-stroke-color="nodeStroke" :node-color="nodeColor" />
  </VueFlow>
</template>

<style lang="scss">
.custom-node-flow {
  .vue-flow__edges {
    filter: invert(100%);
  }

  .vue-flow__handle {
    height: 24px;
    width: 8px;
    border-radius: 4px;
  }

  .vue-flow__node-color-selector {
    border: 1px solid #777;
    padding: 10px;
    border-radius: 10px;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    max-width: 250px;
  }

  .vue-flow__node-color-selector .color-selector {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90%;
    margin: auto;
    gap: 4px;
  }

  .vue-flow__node-color-selector .color-selector button {
    border: none;
    cursor: pointer;
    padding: 5px;
    width: 25px;
    height: 25px;
    border-radius: 8px;
    box-shadow: 0 0 10px #0000004d;
  }

  .vue-flow__node-color-selector .color-selector button:hover {
    box-shadow: 0 0 0 2px #2563eb;
    transition: box-shadow 0.2s;
  }

  .vue-flow__node-color-selector .color-selector button.selected {
    box-shadow: 0 0 0 2px #2563eb;
  }

  .vue-flow__node-color-selector .vue-flow__handle {
    background-color: #ec4899;
    height: 24px;
    width: 8px;
    border-radius: 4px;
  }

  &.animated-bg-gradient {
    background: linear-gradient(122deg, #6f3381, #81c7d4, #fedfe1, #fffffb);
    background-size: 800% 800%;
    -webkit-animation: gradient 4s ease infinite;
    -moz-animation: gradient 4s ease infinite;
    animation: gradient 4s ease infinite;
  }

  @-webkit-keyframes gradient {
    0% {
      background-position: 0% 22%;
    }

    50% {
      background-position: 100% 79%;
    }

    to {
      background-position: 0% 22%;
    }
  }

  @-moz-keyframes gradient {
    0% {
      background-position: 0% 22%;
    }

    50% {
      background-position: 100% 79%;
    }

    to {
      background-position: 0% 22%;
    }
  }

  @keyframes gradient {
    0% {
      background-position: 0% 22%;
    }

    50% {
      background-position: 100% 79%;
    }

    to {
      background-position: 0% 22%;
    }
  }
}
</style>
