<script setup lang="ts">
import { ref, computed, provide } from 'vue'
// layout
import SideSection from '@/components/layout/SideSection.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import ViewSection from '@/components/layout/ViewSection.vue'

// element ui plus config
import { ElConfigProvider } from 'element-plus'

// locale
import { useLocaleStore } from '@/stores/locale'

// hook
import type { Hook } from '@/declare/hook'
import CustomPopover from '@/components/hook/CustomPopover.vue'

const navIsOpen = ref(true)

const localeStore = useLocaleStore()
const locale = computed(() => {
  return localeStore.locale
})

const customPopover = ref(null)
provide<() => Hook>('hook', () => {
  return {
    openEventList: (click, eventList) => {
      if (customPopover.value) {
        customPopover.value.openPopover(click, eventList)
      }
    }
  }
})

</script>

<template>
  <ElConfigProvider :locale="locale.el">
    <div class="layout-wrapper">
      <div class="layout-left layout-side" :class="navIsOpen ? 'is-open': 'is-close'">
        <SideSection>
          <template #logo>
            <slot name="logo">
              <div>LOGO</div>
            </slot>
          </template>
          <template #footer>
            <slot name="footer">
              <div>FOOTER</div>
            </slot>
          </template>
        </SideSection>
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

      <!-- hook -->
      <CustomPopover ref="customPopover"/>
    </div>
  </ElConfigProvider>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
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
    overflow: auto;
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
