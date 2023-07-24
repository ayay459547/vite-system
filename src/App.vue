<script lang="ts">
import GlobalView from '@/components/GlobalView.vue'
import { useEnvStore } from '@/stores/stores_env'
import { defineComponent } from 'vue'
import { CustomIcon } from '@/components'

export default defineComponent({
  name: 'AppView',
  components: { GlobalView, CustomIcon },
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
      <template #menu-header="{ isShow }">
        <RouterLink to="/home" v-slot="{ navigate }">
          <div class="menu-header" @click="navigate">
            <CustomIcon name="home" size="large"/>
            <h2 v-if="isShow">HOME</h2>
          </div>
        </RouterLink>
      </template>

      <template #menu-footer="{ isShow }">
        <div v-if="isShow" class="menu-footer">
          {{ `${system} version ${version}` }}
        </div>
      </template>

      <!-- <template #header-left></template> -->
      <!-- <template #header-right></template> -->
    </GlobalView>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.menu {
  &-header {
    font-size: 1.2em;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 16px;
    color: #fff;
    transition-duration: 0.3s;

    &:hover {
      color: $warning;
    }
  }

  &-footer {
    background-color: #e6e6e6;
    color: #324157;
    padding: 8px 16px;
    border-radius: 6px;
    transition-duration: 0.3s;
    margin: 0 auto;
    width: fit-content;

    &:hover {
      color: #4d6488;
    }
  }
}
</style>
@/stores/stores_env