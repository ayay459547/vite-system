<script setup lang="ts">
import { computed, ref } from 'vue'
// import { Panel as FlowPanel, VueFlow, useVueFlow } from '@vue-flow/core'

import { VueFlow, FlowPanel } from '@/components/chart'
import { useVueFlow } from '@/lib/lib_vueFlow'

/**
 * You can either use `getIntersectingNodes` to check if a given node intersects with others
 * or `isNodeIntersecting` to check if a node is intersecting with a given area
 */
const {
  onNodeDrag,
  getIntersectingNodes,
  isNodeIntersecting,
  updateNode,
  screenToFlowCoordinate
} = useVueFlow()

const nodes = ref<any[]>([
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 }
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 300, y: 300 }
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 300, y: 0 }
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 0, y: 300 }
  },
  {
    id: '5',
    style: { borderColor: 'red' },
    data: { label: 'Drag me  over another node' },
    position: { x: 150, y: 150 }
  }
])

const panelEl = ref()

const isIntersectingWithPanel = ref(false)

const panelPosition = computed(() => {
  if (!panelEl.value) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  }

  const { left, top, width, height } = panelEl.value.$el.getBoundingClientRect()

  return {
    ...screenToFlowCoordinate({ x: left, y: top }),
    width,
    height
  }
})

onNodeDrag(({ node: draggedNode }) => {
  const intersections = getIntersectingNodes(draggedNode)
  const intersectionIds = intersections.map(intersection => intersection.id)

  isIntersectingWithPanel.value = isNodeIntersecting(
    draggedNode,
    panelPosition.value
  )

  for (const node of nodes.value) {
    const isIntersecting = intersectionIds.includes(node.id)

    updateNode(node.id, { class: isIntersecting ? 'intersecting' : '' })
  }
})
</script>

<template>
  <div class="fill node-intersections-test">
    <VueFlow :nodes="nodes" fit-view-on-init>
      <FlowPanel
        ref="panelEl"
        position="bottom-right"
        :class="{ intersecting: isIntersectingWithPanel }"
      >
      </FlowPanel>
    </VueFlow>
  </div>
</template>

<style lang="scss">
.node-intersections-test {
  .vue-flow__node.intersecting {
    background-color: #f15a16;
  }

  .vue-flow__panel {
    height: 250px;
    width: 250px;
    border: 1px dashed #ccc;
    pointer-events: none !important;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .vue-flow__panel.intersecting {
    border-color: #f15a16;
    background-color: #f15a1608;
  }
}
</style>
