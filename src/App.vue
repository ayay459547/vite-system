<script setup lang="ts">
import { ref } from 'vue'

import SideSection from '@/components/layout/SideSection.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import ViewSection from '@/components/layout/ViewSection.vue'

const navIsOpen = ref(true)

</script>

<template>
  <div class="layout-wrapper">
    <div class="layout-left layout-side" :class="navIsOpen ? 'is-open': 'is-close'">
      <SideSection />
    </div>

    <div class="layout-right">
      <div class="layout-header">
        <HeaderSection v-model:isOpen="navIsOpen"/>
      </div>
      <div class="layout-view">
        <ViewSection>
          <RouterView />
        </ViewSection>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  &-wrapper {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    display: flex;
  }

  &-left {
    width: fit-content;
    height: 100%;
    transition-duration: 0.3s;
    &.is-open {
      margin-left: 0;
    }
    &.is-close {
      margin-left: -$nav-width;
    }
  }

  &-right {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  &-header {
    width: 100%;
    height: fit-content;
  }
  &-view {
    width: 100%;
    height: 100%;
    flex: 1;
  }
}
</style>
