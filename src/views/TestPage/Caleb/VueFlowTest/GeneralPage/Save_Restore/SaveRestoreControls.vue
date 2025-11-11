<script setup lang="ts">
// import { Panel as FlowPanel, useVueFlow } from '@vue-flow/core'

import { FlowPanel } from '@/components/chart'
import { useVueFlow } from '@/lib/lib_vueFlow'
import Test_Icon from './Test_Icon.vue'

const flowKey = 'vue-flow--save-restore'

const { nodes, addNodes, dimensions, toObject, fromObject } = useVueFlow()

function onSave() {
  localStorage.setItem(flowKey, JSON.stringify(toObject()))
}

function onRestore() {
  const flow = JSON.parse(localStorage.getItem(flowKey))

  if (flow) {
    fromObject(flow)
  }
}

function onAdd() {
  const id = nodes.value.length + 1

  const newNode = {
    id: `random_node-${id}`,
    label: `Node ${id}`,
    position: { x: Math.random() * dimensions.value.width, y: Math.random() * dimensions.value.height }
  }

  addNodes([newNode])
}
</script>

<template>
  <FlowPanel position="top-right">
    <div class="buttons">
      <button title="save graph" @click="onSave">
        <Test_Icon name="save" />
      </button>
      <button title="restore graph" @click="onRestore">
        <Test_Icon name="restore" />
      </button>
      <button title="add random node" @click="onAdd">
        <Test_Icon name="add" />
      </button>
    </div>
  </FlowPanel>
</template>

<style lang="scss" scoped>
.buttons {
  display:flex;
  gap:8px
}

button {
  border:none;
  cursor:pointer;
  background-color:#4a5568;
  border-radius:8px;
  color:#fff;
  box-shadow:0 0 10px #0000004d;
  width:40px;
  height:40px;
  font-size:16px;
  display:flex;
  align-items:center;
  justify-content:center;

  svg {
    width:100%;
    height:100%
  }

  &:hover {
    background-color:#2563eb;
    transition:background-color .2s
  }
}
</style>
