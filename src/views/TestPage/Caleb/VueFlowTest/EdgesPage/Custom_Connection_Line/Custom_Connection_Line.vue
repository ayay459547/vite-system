<script setup lang="ts">
import { ref } from 'vue'
// import { VueFlow } from '@vue-flow/core'

import { VueFlow } from '@/components/chart'
import { useVueFlow } from '@/lib/lib_vueFlow'
import CustomConnectionLine from './CustomConnectionLine.vue'

const nodes = ref([
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 100, y: 5 }
  },
  {
    id: '2',
    type: 'input',
    data: { label: 'Node 2' },
    position: { x: 300, y: 5 }
  }
])

const { onInit } = useVueFlow()

onInit((vueFlowInstance: any) => {
  vueFlowInstance.fitView()
})

</script>

<template>
  <VueFlow :nodes="nodes">
    <template #connection-line="{ sourceX, sourceY, targetX, targetY }">
      <CustomConnectionLine
        :source-x="sourceX"
        :source-y="sourceY"
        :target-x="targetX"
        :target-y="targetY"
      />
    </template>
  </VueFlow>
</template>

<style lang="scss" scoped></style>
