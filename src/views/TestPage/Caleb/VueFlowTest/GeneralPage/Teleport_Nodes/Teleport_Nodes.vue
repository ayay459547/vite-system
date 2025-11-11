<script setup lang="ts">
import { ref } from 'vue'
// import { VueFlow } from '@vue-flow/core'

import { VueFlow } from '@/components/chart'

import Test_Sidebar from './Test_Sidebar.vue'
import TeleportableNode from './TeleportableNode.vue'

const nodes = ref([
  {
    id: '1',
    type: 'teleportable',
    position: { x: 125, y: 0 },
    data: { label: 'Click to teleport' }
  },
  {
    id: '2',
    type: 'teleportable',
    position: { x: 350, y: 200 },
    data: { label: 'Click to teleport' }
  },
  {
    id: '3',
    type: 'teleportable',
    position: { x: 0, y: 200 },
    data: { label: 'Click to teleport' }
  }
])

const edges = ref([
  {
    id: 'e1-2',
    source: '1',
    target: '2'
  }
])
</script>

<template>
  <div class="teleportflow-test">
    <VueFlow :nodes="nodes" :edges="edges" fit-view-on-init>
      <template #node-teleportable="{ id }">
        <TeleportableNode :id="id" />
      </template>
    </VueFlow>

    <Test_Sidebar />
  </div>
</template>

<style lang="scss">
.teleportflow-test {
  flex-direction: column;
  display: flex;
  height: 100%;

  aside {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: #fff;
    font-weight: 700;
    border-right: 1px solid #eee;
    padding: 10px;
    font-size: 12px;
    background: #10b981bf;
    -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
    box-shadow: 0 5px 10px #0000004d;

    .port > * {
      position: relative;
      margin-bottom: 10px;
      cursor: grab;
      font-weight: 500;
      -webkit-box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.25);
      box-shadow: 5px 5px 10px 2px #00000040;
    }

    .description {
      margin-bottom: 10px;
    }
  }

  .vue-flow-wrapper {
    flex-grow: 1;
    height: 100%;
  }

  .teleportable {
    padding: 10px;
    background: #fff;
    border: 1px solid black;
    border-radius: 10px;
    color: #000;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    gap: 5px;

    .button {
      background-color: #f5f5f5;
      cursor: pointer;
      padding: 5px 10px;
      border: 1px solid black;
      border-radius: 10px;
      color: #000;
      font-weight: 700;
      box-shadow:
        0 4px 6px -1px #0000001a,
        0 2px 4px -2px #0000001a;

      &:hover {
        background: #000;
        color: #fff;
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .shrink-leave-active {
    animation: shrink 0.5s;
  }

  .shrink-enter-active {
    animation: grow 0.5s;
  }

  @keyframes grow {
    0% {
      transform: scale(0.1);
    }

    to {
      transform: scale(1);
    }
  }

  @keyframes shrink {
    0% {
      transform: scale(1);
    }

    to {
      transform: scale(0.1);
    }
  }
}

@media screen and (min-width: 640px) {
  .teleportflow-test {
    flex-direction: row;
  }

  .teleportflow-test aside {
    min-width: 25%;
  }
}

@media screen and (max-width: 639px) {
  .teleportflow-test aside .port {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 5px;
  }
}

</style>
