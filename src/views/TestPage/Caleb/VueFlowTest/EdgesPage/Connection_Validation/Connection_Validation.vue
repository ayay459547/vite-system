<script setup lang="ts">
import { ref } from 'vue'
// import { VueFlow, useVueFlow } from '@vue-flow/core'
import { VueFlow } from '@/components/chart'
import { useVueFlow } from '@/lib/lib_vueFlow'

import Test_CustomInput from './Test_CustomInput.vue'
import Test_CustomNode from './Test_CustomNode.vue'

const { addEdges } = useVueFlow()

const nodes = ref([
  {
    id: '0',
    type: 'input',
    position: { x: 0, y: 150 },
    // only target `B` is valid for this node
    data: { validTarget: 'B', validSource: '0' }
  },
  {
    id: 'A',
    type: 'custom',
    position: { x: 250, y: 0 },
    // no valid connections can be made for this node
    data: {}
  },
  {
    id: 'B',
    type: 'custom',
    position: { x: 250, y: 150 },
    // only source `0` is valid for this node
    data: { validTarget: 'B', validSource: '0' }
  },
  {
    id: 'C',
    type: 'custom',
    position: { x: 250, y: 300 },
    // no valid connections can be made for this node
    data: {}
  }
])

const edges = ref([])

function onConnectStart(event) {
  const { nodeId, handleType } = event
  console.log('on connect start', event, { nodeId, handleType })
}

function onConnectEnd(event) {
  console.log('on connect end', event)
}

function onConnect(params) {
  console.log('on connect', params)
  addEdges(params)
}
</script>

<template>
  <div class="fill validation-flow-test">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      fit-view-on-init
      class="validationflow"
      @connect="onConnect"
      @connect-start="onConnectStart"
      @connect-end="onConnectEnd"
    >
      <template #node-input="props">
        <Test_CustomInput :data="props.data" />
      </template>

      <template #node-custom="props">
        <Test_CustomNode :id="props.id" :data="props.data" />
      </template>
    </VueFlow>
  </div>
</template>

<style lang="scss">
.validation-flow-test {
  .validationflow .vue-flow__node {
    width: 150px;
    border-radius: 5px;
    padding: 10px;
    color: #555;
    border: 1px solid #ddd;
    text-align: center;
    font-size: 12px;
  }

  .validationflow .vue-flow__node-customnode {
    background: #e6e6e9;
    border: 1px solid #ddd;
  }

  .validationflow .vue-flow__node-custominput .vue-flow__handle {
    background: #e6e6e9;
  }

  .validationflow .vue-flow__node-custominput {
    background: #fff;
  }

  .validationflow .vue-flow__handle-connecting {
    background: #ff6060;
  }

  .validationflow .vue-flow__handle-valid {
    background: #5d9;
  }
}
</style>
