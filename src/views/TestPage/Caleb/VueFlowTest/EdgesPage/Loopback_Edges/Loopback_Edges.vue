<script setup lang="ts">
import { ref } from 'vue'
// import { Background as FlowBackground } from '@vue-flow/background'
// import { Panel as FlowPanel, Position, VueFlow, useVueFlow } from '@vue-flow/core'

import { VueFlow, FlowPanel, FlowBackground } from '@/components/chart'
import { useVueFlow, Position } from '@/lib/lib_vueFlow'

import LoopbackEdge from './LoopbackEdge.vue'

const { updateEdgeData, updateNode } = useVueFlow()

const nodes = ref([
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'I connect to myself' }
  }
])

const pathType = ref('bezier')

const isHorizontal = ref(false)

const edges = ref([
  {
    id: 'e1-1',
    type: 'loopback',
    source: '1',
    target: '1',
    data: { pathType: pathType.value }
  }
])
</script>

<template>
  <div class="fill loopback-edges-test">
    <VueFlow :nodes="nodes" :edges="edges" fit-view-on-init>
      <template #edge-loopback="customEdgeProps">
        <LoopbackEdge
          :id="customEdgeProps.id"
          :source-x="customEdgeProps.sourceX"
          :source-y="customEdgeProps.sourceY"
          :target-x="customEdgeProps.targetX"
          :target-y="customEdgeProps.targetY"
          :source-position="customEdgeProps.sourcePosition"
          :target-position="customEdgeProps.targetPosition"
          :source-node="customEdgeProps.sourceNode"
          :target-node="customEdgeProps.targetNode"
          :data="customEdgeProps.data"
        />
      </template>

      <FlowBackground />

      <FlowPanel position="top-center">
        <select
          v-model="pathType"
          @change="updateEdgeData('e1-1', { pathType })"
        >
          <option value="bezier">Bezier</option>
          <option value="smoothstep">Smoothstep</option>
        </select>

        <label for="is-horizontal"
          >{{ isHorizontal ? 'Vertical' : 'Horizontal' }}
          <input
            id="is-horizontal"
            v-model="isHorizontal"
            type="checkbox"
            @change="
              updateNode('1', {
                sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
                targetPosition: isHorizontal ? Position.Left : Position.Top
              })
            "
          />
        </label>
      </FlowPanel>
    </VueFlow>
  </div>
</template>

<style lang="scss">
.loopback-edges-test {
  .vue-flow__panel {
    background-color: #2d3748;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 0 10px #00000080;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 12px;
    font-weight: 600;
    width: 300px;
  }

  .vue-flow__panel label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }

  .vue-flow__panel label input {
    cursor: pointer;
  }
}
</style>
