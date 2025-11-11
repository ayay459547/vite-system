<script setup lang="ts">
// import { Handle as FlowHandle, Position, useVueFlow } from '@vue-flow/core'
// import { NodeToolbar as FlowNodeToolbar } from '@vue-flow/node-toolbar'

import { FlowHandle, FlowNodeToolbar } from '@/components/chart'
import { Position, useVueFlow } from '@/lib/lib_vueFlow'

const props = defineProps(['id', 'data'])

const actions = ['👎', '✋', '👍', '🚘']

const { updateNodeData } = useVueFlow()
</script>

<template>
  <FlowNodeToolbar
    :is-visible="data.toolbarVisible"
    :position="data.toolbarPosition"
  >
    <button
      v-for="action of actions"
      :key="action"
      type="button"
      :class="{ selected: action === data.action }"
      @click="updateNodeData(props.id, { action })"
    >
      {{ action }}
    </button>
  </FlowNodeToolbar>

  <div>
    {{ data.label }}
  </div>

  <FlowHandle type="target" :position="Position.Left" />
  <FlowHandle type="source" :position="Position.Right" />
</template>

<style lang="scss" scoped></style>
