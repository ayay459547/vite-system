<script setup lang="ts">
import { ref } from 'vue'
// import { VueFlow, useVueFlow } from '@vue-flow/core'
// import { Background as FlowBackground } from '@vue-flow/background'
// import {
//   Controls as FlowControls,
//   ControlButton as FlowControlButton
// } from '@vue-flow/controls'
// import { MiniMap as FlowMiniMap } from '@vue-flow/minimap'

import {
  VueFlow,
  FlowBackground,
  FlowControls,
  FlowControlButton,
  FlowMiniMap
} from '@/components/chart'
import { useVueFlow } from '@/lib/lib_vueFlow'

import { initialEdges, initialNodes } from './initial-elements'
import Test_Icon from './Test_Icon.vue'

const {
  onInit,
  onNodeDragStop,
  onConnect,
  addEdges,
  setViewport,
  toObject
} = useVueFlow()

const nodes = ref<any[]>(initialNodes)

const edges = ref<any[]>(initialEdges)

const dark = ref(false)

onInit((vueFlowInstance: any) => {
  vueFlowInstance.fitView()
})

onNodeDragStop(({ event, nodes, node }) => {
  console.log('Node Drag Stop', { event, nodes, node })
})

onConnect((connection: any) => {
  addEdges(connection)
})

function updatePos() {
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

function logToObject() {
  console.log(toObject())
}

function resetTransform() {
  setViewport({ x: 0, y: 0, zoom: 1 })
}

function toggleDarkMode() {
  dark.value = !dark.value
}
</script>

<template>
  <VueFlow
    :nodes="nodes"
    :edges="edges"
    :class="{ dark }"
    class="basic-flow"
    :default-viewport="{ zoom: 1.5 }"
    :min-zoom="0.2"
    :max-zoom="4"
  >
    <FlowBackground pattern-color="#aaa" :gap="8"></FlowBackground>

    <FlowMiniMap></FlowMiniMap>

    <FlowControls position="top-left">
      <FlowControlButton title="Reset Transform" @click="resetTransform">
        <Test_Icon name="reset" />
      </FlowControlButton>

      <FlowControlButton title="Shuffle Node Positions" @click="updatePos">
        <Test_Icon name="update" />
      </FlowControlButton>

      <FlowControlButton title="Toggle Dark Mode" @click="toggleDarkMode">
        <Test_Icon v-if="dark" name="sun" />
        <Test_Icon v-else name="moon" />
      </FlowControlButton>

      <FlowControlButton title="Log `toObject`" @click="logToObject">
        <Test_Icon name="log" />
      </FlowControlButton>
    </FlowControls>
  </VueFlow>
</template>

<style lang="scss" scoped>
.basic-flow {
  .vue-flow__controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    &-button {
      border: none;
      border-right: 1px solid #eee;

      svg {
        height: 100%;
        width: 100%;
      }
    }
  }

  &.dark {
    background: #2d3748;
    color: #fffffb;

    .vue-flow__node {
      background: #4a5568;
      color: #fffffb;

      &.selected {
        background: #333;
        box-shadow: 0 0 0 2px #2563eb;
      }
    }

    .vue-flow__controls {
      border: 1px solid #fffffb;

      &-button {
        background: #333;
        fill: #fffffb;
        border: none;

        :hover {
          background: #4d4d4d;
        }
      }
    }

    .vue-flow__edge-textbg {
      fill: #292524;
    }
    .vue-flow__edge-text {
      fill: #fffffb;
    }
  }
}
</style>
