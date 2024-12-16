<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'
import { ElLink } from 'element-plus'

import { CustomIcon } from '@/components'

const props = defineProps<NodeProps>()

const x = computed(() => `${Math.round(props.position.x)}px`)
const y = computed(() => `${Math.round(props.position.y)}px`)
</script>

<template>
  <div class="vue-flow__node-default">
    <div>{{ data.label }}</div>

    <div v-if="Array.isArray(data.links)" class="links">
      <ElLink
        v-for="link in data.links"
        :key="link.toPage"
        :href="link.toPage"
        target="_blank"
        type="primary"
      >
        <div class="link flex-row i-ga-xs">
          <CustomIcon
            class="tooltip-default-icon"
            name="link"
            size="small"
          />
          {{ link.description }}
        </div>
      </ElLink>
    </div>

    <div class="i-hidden">{{x}} {{y}}</div>

    <!-- <Handle id="source-b" type="source" :position="Position.Bottom" /> -->
    <!-- <Handle id="source-t" type="source" :position="Position.Top" /> -->
    <Handle id="source-r" type="source" :position="Position.Right" />
    <!-- <Handle id="source-l" type="source" :position="Position.Left" /> -->

    <!-- <Handle id="target-b" type="target" :position="Position.Bottom" /> -->
    <!-- <Handle id="target-t" type="target" :position="Position.Top" /> -->
    <!-- <Handle id="target-r" type="target" :position="Position.Right" /> -->
    <Handle id="target-l" type="target" :position="Position.Left" />
  </div>
</template>

<style lang="scss" scoped>
.vue-flow__node-default {
  border: none;
  min-width: fit-content;

  .links {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .link {
    font-size: 0.8em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>