<script setup lang="ts">
// import { Handle as FlowHandle, Position } from '@vue-flow/core'

import { FlowHandle } from '@/components/chart'
import { Position } from '@/lib/lib_vueFlow'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
})

function isValidConnection(connection) {
  return (
    connection.target === props.data.validTarget &&
    connection.source === props.data.validSource
  )
}
</script>

<template>
  <FlowHandle
    type="target"
    :position="Position.Left"
    :is-valid-connection="isValidConnection"
  />
  <div>{{ props.id }}</div>
</template>

<style lang="scss" scoped></style>
