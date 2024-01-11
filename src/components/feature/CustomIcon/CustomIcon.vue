<script setup lang="ts">
import { computed } from 'vue'

import {
  version,
  scopedId,
  props as iconProps
} from './CustomIconInfo'

const props = defineProps(iconProps)

const getIcon = computed(() => {
  if (props.icon.length > 0) return props.icon
  return [props.type, props.name]
})

</script>

<template>
  <div
    :class="[
      `CustomIcon_${version} ${scopedId}`,
      '__icon-container',
      `size-${props.size}`,
      `${props.iconClass}`
    ]"
  >
    <font-awesome-icon :icon="getIcon" />
  </div>
</template>

<style lang="scss" scoped>
.__icon-container {
  width: fit-content;
  height: fit-content;
  &.size-large {
    font-size: 1.5em;
  }
  &.size-default {
    font-size: 1.3em;
  }
  &.size-small {
    font-size: 1em;
  }
}
</style>
