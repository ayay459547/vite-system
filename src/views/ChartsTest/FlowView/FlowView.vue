<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import HomeView from './Components/HomeView.vue'

const isLoading = ref(true)
onMounted(() => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'special',
    position: { x: 0, y: 0 },
    data: {
      label: 'Label'
    }
  },
  {
    id: '2',
    type: 'special',
    position: { x: 230, y: 80 },
    data: {
      label: 'Label2',
      links: []
    }
  },
  {
    id: '3',
    type: 'special',
    position: { x: 460, y: 160 },
    data: {
      label: 'Label3',
      links: []
    }
  },
  {
    id: '4',
    type: 'special',
    position: { x: 690, y: 240 },
    data: {
      label: 'Label4'
    }
  }
])

const edges = ref<Edge[]>([
  {
    id: 'e1->2',
    source: '1',
    target: '2',
    animated: true
  },
  {
    id: 'e2->3',
    type: 'special',
    source: '2',
    target: '3',
    animated: true
  },
  {
    id: 'e3->4',
    type: 'special',
    source: '3',
    target: '4',
    animated: true
  }
])


</script>

<template>
  <div v-loading="isLoading" class="flow-container">
    <HomeView
      v-if="!isLoading"
      :nodes="nodes"
      :edges="edges"
    ></HomeView>
  </div>
</template>

<style lang="scss" scoped>
.flow-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: var(--i-color-system-bg);
}
</style>
