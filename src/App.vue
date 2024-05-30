<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import GlobalView from '@/components/GlobalView.vue'

export default defineComponent({
  name: 'AppView',
  components: { GlobalView },
  setup() {
    const router = useRouter()
    const toHome = () => {
      router.push({ name: 'locatehome' })
    }

    return {
      router,
      toHome
    }
  }
})
</script>

<template>
  <div class="app-container">
    <GlobalView>
      <template #logo="{ env }">
        <div class="menu-logo" @click="toHome">
          <img class="vue-img" src="@/assets/images/Vue-logo.png" alt="vue" />
          <h2 class="vue-text">{{ env.system }}</h2>
        </div>
      </template>

      <template #menu-footer="{ isShow, env }">
        <div class="menu-footer">
          <span v-if="isShow">{{ `${env.system} ${env.version}` }}</span>
          <span v-else>{{ `${env.version.split('-')[0]}` }}</span>
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
  &-logo {
    width: fit-content;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    padding: 0 8px;
    cursor: pointer;

    .vue {
      &-img {
        width: 46px;
      }
      &-text {
        font-size: 1.6em;
        font-weight: 600;
      }
    }
  }

  &-footer {
    color: #ddd;
    padding: 8px 12px;
    border-radius: 6px;
    transition-duration: 0.3s;
    margin: 0 auto;
    width: fit-content;
  }
}

.header {
  &-right {
    color: #535353;
    transition-duration: 0.3s;

    &:hover {
      color: #409eff;
    }
  }
}
</style>
