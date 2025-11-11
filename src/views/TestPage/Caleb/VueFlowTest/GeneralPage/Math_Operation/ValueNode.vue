<script setup lang="ts">
import { computed } from 'vue'

// import {
//   useVueFlow,
//   Position,
//   Handle as FlowHandle
// } from '@vue-flow/core'

import { FlowHandle } from '@/components/chart'
import { useVueFlow, Position } from '@/lib/lib_vueFlow'

const props = defineProps(['id', 'data'])

const { updateNodeData } = useVueFlow()

const value = computed({
  get: () => props.data.value,
  set: (value: any) => updateNodeData(props.id, { value })
})
</script>

<template>
  <input :id="`${id}-input`" v-model="value" type="number" class="nodrag" />

  <FlowHandle type="source" :position="Position.Right" :connectable="false" />
</template>

<style lang="scss" scoped></style>
