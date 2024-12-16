<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { MiniMap } from '@vue-flow/minimap'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'
import ColorSelectorNode from './ColorSelectorNode.vue'
import OutputNode from './OutputNode.vue'
// import { presets } from './presets'

const props = defineProps({
  nodes: Array as PropType<Node[]>,
  edges: Array as PropType<Edge[]>
})

// minimap stroke color functions
function nodeStroke(n: any) {
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

function nodeColor(n: any) {
  if (n.type === 'color-selector') {
    return n.data.color
  }

  return '#fff'
}

const emit = defineEmits(['update:nodes'])

const nodesValue = computed({
  get() {
    return props.nodes
  },
  set(v: any) {
    emit('update:nodes', v)
  }
})


const colorSelectorData = computed<any>(() => {
  return nodesValue.value[0].data
})

</script>

<template>
  <div class="color-selector fill">
    <VueFlow
      v-model:nodes="nodesValue"
      :edges="edges"
      class="custom-node-flow"
      :class="[colorSelectorData?.isGradient ? 'animated-bg-gradient' : '']"
      :style="{ backgroundColor: colorSelectorData?.color }"
      fit-view-on-init
    >
      <template #node-color-selector="selectorProps">
        <ColorSelectorNode :id="selectorProps.id" :data="selectorProps.data" />
      </template>

      <template #node-output>
        <OutputNode />
      </template>

      <MiniMap :node-stroke-color="nodeStroke" :node-color="nodeColor" />
    </VueFlow>
  </div>
</template>

<style lang="scss">
.color-selector {
  .vue-flow {
    &__minimap {
      transform: scale(75%);
      transform-origin: bottom right;
    }

    &__edges {
      filter:invert(100%)
    }

    &__handle {
      height:24px;
      width:8px;
      border-radius:4px
    }

    &__node-color-selector {
      border:1px solid #777;
      padding:10px;
      border-radius:10px;
      background:#f5f5f5;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      align-items:center;
      gap:10px;
      max-width:250px;

      .color-selector {
        display:flex;
        flex-direction:row;
        flex-wrap:wrap;
        justify-content:center;
        max-width:90%;
        margin:auto;
        gap:4px;

        button {
          border:none;
          cursor:pointer;
          padding:5px;
          width:25px;
          height:25px;
          border-radius:8px;
          box-shadow:0 0 10px #0000004d;
          &:hover {
            box-shadow:0 0 0 2px #2563eb;
            transition:box-shadow .2s
          }
          &.selected {
            box-shadow:0 0 0 2px #2563eb
          }
        }

        .vue-flow__handle {
          background-color:#ec4899;
          height:24px;
          width:8px;
          border-radius:4px
        }
      }
    }
  }

  .animated-bg-gradient {
    background:linear-gradient(122deg,#6f3381,#81c7d4,#fedfe1,#fffffb);
    background-size:800% 800%;
    -webkit-animation:gradient 4s ease infinite;
    -moz-animation:gradient 4s ease infinite;
    animation:gradient 4s ease infinite
  }

  @keyframes gradient {
    0% { background-position:0% 22% }
    50% { background-position:100% 79% }
    to { background-position:0% 22% }
  }
}
</style>
