<script setup lang="ts">
import { ref } from 'vue'

import { CustomAnchor, CustomScrollbar } from '@/components/feature' // 系統組件

import { chartLinks, featureLinks, inputLinks, tableLinks } from './links'

const markdownRef = ref<HTMLDivElement>()

const links = [
  ...chartLinks,
  ...featureLinks,
  ...inputLinks,
  ...tableLinks
]

const handleClick = (e: MouseEvent) => {
  e.preventDefault()
}
</script>

<template>
  <div class="des-components">
    <div ref="markdownRef" class="des-components-components">
      <div
        v-for="link in links"
        :key="link.title"
        :id="link.title"
        class="des-components-des"
      >
        <component :is="link.component" />
      </div>
    </div>

    <CustomScrollbar class="des-components-anchor">
      <CustomAnchor
        :container="markdownRef"
        direction="vertical"
        type="default"
        :offset="30"
        :links="links"
        @click="handleClick"
      >
        <template #default="{ title }">
          {{ `${title}`.replace(/^Des_/, '') }}
        </template>
      </CustomAnchor>
    </CustomScrollbar>
  </div>
</template>

<style lang="scss" scoped>
.des-components {
  width: 100%;
  height: 100%;
  padding: 8px 0;
  position: relative;
  overflow: hidden;
  display: flex;
  gap: 8px;

  &-components {
    flex: 5;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 64px;
    padding: 8px 64px 8px 12px;
  }
  &-des {
    border-top: 1px solid #dddddd;
    border-radius: 6px;
    padding: 8px 12px;
    transition-duration: 0.2s;
    &:hover {
      background: var(--el-color-primary-light-8);
      box-shadow: 2px 2px 8px 1px #778eb6;
    }
  }
  &-anchor {
    flex: 1;
    overflow: auto;
  }
}
</style>
