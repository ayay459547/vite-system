<script setup lang="ts">
// import { Handle as FlowHandle, Position } from '@vue-flow/core'

import { FlowHandle } from '@/components/chart'
import { Position } from '@/lib/lib_vueFlow'

const props = defineProps({
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
  <div>Only connectable with {{ data.validTarget }}</div>
  <FlowHandle
    type="source"
    :position="Position.Right"
    :is-valid-connection="isValidConnection"
  />
</template>

<style lang="scss" scoped></style>
