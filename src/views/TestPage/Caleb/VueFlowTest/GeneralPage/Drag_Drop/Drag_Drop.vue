<script setup lang="ts">
import { ref } from 'vue'
// import { VueFlow, useVueFlow } from '@vue-flow/core'

import { VueFlow } from '@/components/chart'
import { useVueFlow } from '@/lib/lib_vueFlow'

import DropzoneBackground from './DropzoneBackground.vue'
import Sidebar from './Test_Sidebar.vue'
import useDragAndDrop from './useDnD'

const { onConnect, addEdges } = useVueFlow()

const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()

const nodes = ref([])

onConnect(addEdges)
</script>

<template>
  <div class="dnd-flow" @drop="onDrop">
    <VueFlow :nodes="nodes" @dragover="onDragOver" @dragleave="onDragLeave">
      <DropzoneBackground
        :style="{
          backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
          transition: 'background-color 0.2s ease'
        }"
      >
        <p v-if="isDragOver">Drop here</p>
      </DropzoneBackground>
    </VueFlow>

    <Sidebar />
  </div>
</template>

<style lang="scss" scoped>
.dnd-flow {
  flex-direction: column;
  display: flex;
  height: 100%;
}

.dnd-flow .vue-flow-wrapper {
  flex-grow: 1;
  height: 100%;
}

@media screen and (min-width: 640px) {
  .dnd-flow {
    flex-direction: row;
  }
}
</style>
