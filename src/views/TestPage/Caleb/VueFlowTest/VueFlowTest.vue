<script setup lang="ts">
import { ref } from 'vue'

import { CustomEmpty, CustomButton, CustomIcon, CustomScrollbar, CustomDivider } from '@/components/feature'
import { GeneralPage, LayoutPage, NodesPage, EdgesPage } from './pageSetting'

const activeTest = ref('Test_Basic')
const testVueFlowMap = {
  General: {
    title: 'General',
    setting: GeneralPage
  },
  Layout: {
    title: 'Layout',
    setting: LayoutPage
  },
  Nodes: {
    title: 'Nodes',
    setting: NodesPage
  },
  Edges: {
    title: 'Edges',
    setting: EdgesPage
  }
}
</script>

<template>
  <div class="vue-flow-test">
    <CustomScrollbar>
      <div>
        <div v-for="(typeofInfo, type) in testVueFlowMap" :key="`type-${type}`">
          <CustomDivider content-position="left">{{ typeofInfo.title }}</CustomDivider>

          <div class="vue-flow-test-button">
            <div
              v-for="(pageInfo, key) in (typeofInfo.setting as typeof GeneralPage)"
              :key="`page-${key}`"
              class="flex-row-center i-ga-xs"
            >
              <CustomButton
                :label="pageInfo.label"
                type="success"
                plain
                @click="activeTest = pageInfo.value"
              />
              <a :href="pageInfo.link" target="_blank">
                <CustomIcon name="up-right-from-square" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </CustomScrollbar>
    <div class="vue-flow-test-view">
      <template v-for="(typeofInfo, type) in testVueFlowMap" :key="`component-${type}`">
        <template v-for="(pageInfo, key) in (typeofInfo.setting as typeof GeneralPage)" :key="`component-page-${key}`">
          <component v-if="key === activeTest" :is="pageInfo.component"></component>
        </template>
      </template>
      <CustomEmpty />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vue-flow-test {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 8px;

  &-button {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: auto;
    padding: 0 16px 0 8px;

    :deep(button) {
      width: 100% !important;
    }
  }

  &-view {
    flex: 1;
    overflow: hidden;
    border: 1px solid gray;
  }
}
</style>
