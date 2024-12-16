<script setup lang="ts">
import type { PropType } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { Node, Edge } from '@vue-flow/core'
import { CustomIcon } from '@/components'
// 背景 網格點
// import { Background } from '@vue-flow/background'
// 右下總覽圖
// import { MiniMap } from '@vue-flow/minimap'
// 控制
import { Controls, ControlButton } from '@vue-flow/controls'

import homeProcess from '@/assets/images/common/homeProcess.svg'
import homeReport from '@/assets/images/common/homeReport.svg'

// these components are only shown as examples of how to use a custom node or edge
// you can find many examples of how to create these custom components in the examples page of the docs
import SpecialNode from './SpecialNode.vue'
import SpecialEdge from './SpecialEdge.vue'

const {
  // onInit, onNodeDragStop, onConnect, addEdges, updateNode,
  setViewport, toObject
} = useVueFlow()

const props = defineProps({
  nodes: Array as PropType<Node[]>,
  edges: Array as PropType<Edge[]>
})

function resetTransform() {
  setViewport({ x: 0, y: 0, zoom: 1 })
}

function logToObject() {
  console.log(toObject())
}

</script>

<template>
  <div class="home-container">
    <img class="home-process" :src="homeProcess" alt="process" />
    <img class="home-report" :src="homeReport" alt="report" />
    <div class="home-flow">
      <VueFlow
        :nodes="props.nodes"
        :edges="props.edges"
        fit-view-on-init
      >
        <Controls position="top-right">
          <ControlButton title="Reset Transform" @click="resetTransform">
            <CustomIcon name="arrow-rotate-left" />
          </ControlButton>

          <ControlButton title="Log `toObject`" @click="logToObject">
            <CustomIcon name="terminal" />
          </ControlButton>
        </Controls>

        <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
        <template #node-special="specialNodeProps">
          <SpecialNode v-bind="specialNodeProps" />
        </template>

        <!-- <template #node-custom="nodeCustomProps">
          <SpecialNode v-bind="nodeCustomProps" />
        </template> -->

        <!-- bind your custom edge type to a component by using slots, slot names are always `edge-<type>` -->
        <template #edge-special="specialEdgeProps">
          <SpecialEdge v-bind="specialEdgeProps" />
        </template>

        <!-- <template #connection-line="connectionLineProps">
          <div class="i-hiddne">{{ $log(connectionLineProps) }}</div>
        </template> -->

        <!-- <template #zoom-pane>
          <div>Some element inside the zoom pane</div>
        </template> -->
      </VueFlow>
    </div>
  </div>
</template>

<style lang="scss">
.home {
  &-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  &-process {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30%;
  }
  &-report {
    position: absolute;
    top: 0;
    right: 0;
    width: 30%;
  }

  &-flow {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    .vue-flow {
      &__node-default {
        background-color: transparent;
      }
      &__node-special {
        border: 1px solid #79bbff;
        padding: 10px;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      }
    }
  }

}
</style>
