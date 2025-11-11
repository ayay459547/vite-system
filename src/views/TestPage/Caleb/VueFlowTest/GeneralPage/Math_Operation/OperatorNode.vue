<script setup lang="ts">
// import {
//   Position,
//   useVueFlow,
//   Handle as FlowHandle
// } from '@vue-flow/core'

import { Position, useVueFlow } from '@/lib/lib_vueFlow'
import { FlowHandle } from '@/components/chart'

import Test_Icon from './Test_Icon.vue'

const props = defineProps(['id', 'data'])

const operators = ['+', '-', '*', '/']

const { updateNodeData } = useVueFlow()
</script>

<template>
  <div class="buttons nodrag">
    <button
      v-for="operator of operators"
      :key="`${id}-${operator}-operator`"
      :class="{ selected: data.operator === operator }"
      @click="updateNodeData(props.id, { operator })"
    >
      <Test_Icon :name="operator" />
    </button>
  </div>

  <FlowHandle type="source" :position="Position.Right" :connectable="false" />
  <FlowHandle id="target-a" type="target" :position="Position.Left" :connectable="false" />
  <FlowHandle id="target-b" type="target" :position="Position.Left" :connectable="false" />
</template>

<style lang="scss" scoped></style>
