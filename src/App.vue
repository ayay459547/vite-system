<script setup lang="ts">
import LayoutViewVue from '@/components/LayoutView.vue'

const system = (import.meta as any).env.VITE_API_SYSTEM_TYPE
const version = (import.meta as any).env.VITE_API_VERSION

</script>

<template>
  <div class="app-container">
    <LayoutViewVue>
      <template #logo>
        <div>LOGO-TEST</div>
      </template>

      <template #footer>
        {{ `${system} version ${version}` }}
      </template>
    </LayoutViewVue>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
