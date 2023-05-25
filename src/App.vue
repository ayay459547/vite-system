<script lang="ts">
import GlobalView from '@/components/GlobalView.vue'
import { useEnvStore } from '@/stores/env'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppView',
  components: { GlobalView },
  setup () {
    const envStore = useEnvStore()
    const { system, version } = envStore

    return {
      system,
      version
    }
  }
})

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
