<script setup lang="ts">
import GlobalView from '@/components/GlobalView.vue'

const system = (import.meta as any).env.VITE_API_SYSTEM_TYPE
const version = (import.meta as any).env.VITE_API_VERSION

</script>

<template>
  <div class="app-container">
    <GlobalView>
      <template #logo>
        <div>LOGO-TEST</div>
      </template>

      <template #footer>
        {{ `${system} version ${version}` }}
      </template>
    </GlobalView>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
