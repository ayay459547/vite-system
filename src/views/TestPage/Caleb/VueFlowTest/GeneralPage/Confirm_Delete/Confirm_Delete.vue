<script setup lang="ts">
import { h, ref } from 'vue'
// import { VueFlow, useVueFlow } from '@vue-flow/core'
// import { Background as FlowBackground } from '@vue-flow/background'

import { VueFlow, FlowBackground } from '@/components/chart'
import { useVueFlow } from '@/lib/lib_vueFlow'

import { useDialog } from './useDialog'
import Test_Dialog from './Test_Dialog.vue'

const { onConnect, addEdges, onNodesChange, onEdgesChange, applyNodeChanges, applyEdgeChanges } = useVueFlow()

const dialog = useDialog()

const nodes = ref<any[]>([
  { id: '1', type: 'input', data: { label: 'Click me and (1)' }, position: { x: 0, y: 0 } },
  { id: '2', data: { label: 'press "Backspace" to delete (2)' }, position: { x: 0, y: 100 } },
  { id: '3', data: { label: 'press "Backspace" to delete (3)' }, position: { x: 200, y: 100 } },
  { id: '4', data: { label: 'press "Backspace" to delete (4)' }, position: { x: -200, y: 100 } },
  { id: '5', data: { label: 'press "Backspace" to delete (5)' }, position: { x: 0, y: 200 } }
])

const edges = ref([
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e1-4', source: '1', target: '4' }
])

function dialogMsg (id: string): any {
  return h(
    'span',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }
    },
    ['Are you sure?', h('br'), h('span', `[ELEMENT_ID: ${id}]`)]
  )
}

onConnect(addEdges)

onNodesChange(async (changes: any) => {
  const nextChanges = []

  for (const change of changes) {
    if (change.type === 'remove') {
      const isConfirmed = await dialog.confirm(dialogMsg(change.id))

      if (isConfirmed) {
        nextChanges.push(change)
      }
    } else {
      nextChanges.push(change)
    }
  }

  applyNodeChanges(nextChanges)
})

onEdgesChange(async (changes: any) => {
  const nextChanges = []

  for (const change of changes) {
    if (change.type === 'remove') {
      const isConfirmed = await dialog.confirm(dialogMsg(change.id))

      if (isConfirmed) {
        nextChanges.push(change)
      }
    } else {
      nextChanges.push(change)
    }
  }

  applyEdgeChanges(nextChanges)
})
</script>

<template>
  <VueFlow
    :nodes="nodes"
    :edges="edges"
    :apply-default="false"
    fit-view-on-init class="confirm-flow-test"
  >
    <FlowBackground />

    <Test_Dialog></Test_Dialog>
  </VueFlow>
</template>

<style lang="scss" scoped></style>
