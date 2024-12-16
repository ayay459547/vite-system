<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'

import { getUuid } from '@/lib/lib_utils' // 工具
import { version, props as buttonProps } from './CustomFlowInfo'

const scopedId = getUuid(version)

const props = defineProps(buttonProps)

const {
  onInit,
  onNodeDragStop,
  onConnect,
  addEdges,
  updateNode,
  setViewport,
  toObject
} = useVueFlow({ id: scopedId })

defineExpose({
  onInit,
  onNodeDragStop,
  onConnect,
  addEdges,
  updateNode,
  setViewport,
  toObject
})

</script>

<template>
  <VueFlow
    :nodes="props.nodes"
    :edges="props.edges"
    fit-view-on-init
    :class="scopedId"
  >
    <slot></slot>
    <template #connection-line="connectionLineProps">
      <slot name="connection-line" v-bind="connectionLineProps"></slot>
    </template>
    <template #zoom-pane>
      <slot name="zoom-pane"></slot>
    </template>
  </VueFlow>
</template>

<style lang="scss">
html.dark {
  .vue-flow {
    background: #2d3748;
    color: #fffffb;

    &__node {
      background: #4a5568;
      color: #fffffb;
      &.selected {
        background: #333;
        box-shadow: 0 0 0 2px #2563eb
      }
    }

    &__controls {
      border: 1px solid #fffffb;
      &-button {
        background: #333;
        fill: #fffffb;
        &:hover {
          background:#4d4d4d;
        }
      }
    }

    &__edge-textbg {
      fill:#292524;
    }
    &__edge-text {
      fill:#fffffb;
    }
  }
}
</style>
