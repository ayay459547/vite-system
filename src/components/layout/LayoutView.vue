<script setup lang="ts">
import { ref, provide, onBeforeMount } from 'vue'
import SideSection from '@/components/layout/SideSection.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'
import ViewSection from '@/components/layout/ViewSection.vue'

import { ElConfigProvider } from 'element-plus'
import ElzhTw from 'element-plus/dist/locale/zh-tw.min.js'
import ElzhCn from 'element-plus/dist/locale/zh-cn.min.js'
import Elen from 'element-plus/dist/locale/en.min.js'

const navIsOpen = ref(true)

enum LangType {
  zhTw = ElzhTw,
  zhCn = ElzhCn,
  en = Elen,
}

const locale = ref('zhTw')

onBeforeMount(() => {
  locale.value = 'zhTw'
})

provide('locale', locale.value)

</script>

<template>
  <ElConfigProvider :locale="LangType[locale]">
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
    </div>
  </ElConfigProvider>
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
