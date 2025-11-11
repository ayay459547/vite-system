<script setup lang="ts">
import { ref } from 'vue'
// import { Panel as FlowPanel, VueFlow, useVueFlow } from '@vue-flow/core'

import { VueFlow, FlowPanel } from '@/components/chart'
import { useVueFlow } from '@/lib/lib_vueFlow'

const { updateNode } = useVueFlow()

const bgColor = ref('#eeeeee')

const label = ref('Node 1')

const nodes = ref<any[]>([
  {
    id: '1',
    data: { label: label.value },
    style: { backgroundColor: bgColor.value },
    position: { x: 100, y: 100 }
  },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } }
])

const edges = ref([{ id: 'e1-2', source: '1', target: '2' }])

function handleUpdate() {
  updateNode('1', {
    data: { label: label.value },
    style: { backgroundColor: bgColor.value }
  })
}
</script>

<template>
  <div class="fill update-node-test">
    <VueFlow :nodes="nodes" :edges="edges" fit-view-on-init>
      <FlowPanel position="top-right">
        <div class="field">
          <label for="label">Label:</label>
          <input id="label" v-model="label" @input="handleUpdate" />
        </div>

        <div class="field">
          <label for="bgColor">Background color:</label>
          <input
            id="bgColor"
            v-model="bgColor"
            type="color"
            @input="handleUpdate"
          />
        </div>
      </FlowPanel>
    </VueFlow>
  </div>
</template>

<style lang="scss">
.update-node-test {
  .vue-flow__panel {
    background-color: #2d3748;
    color: #fff;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .vue-flow__panel .field {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .vue-flow__panel label {
    display: blocK;
  }

  .vue-flow__panel input {
    padding: 2px;
    border-radius: 5px;
  }
}
</style>
