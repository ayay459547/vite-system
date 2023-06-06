<script setup lang="ts">
import { computed } from 'vue'

export type IconType = 'fas' | 'far' | 'fab'

type IconSize = 'large' | 'default' | 'small'

/**
 * icon 和 type, name 選一種給
 */
interface Props {
  icon?: [IconType, string] | []
  type?: IconType
  name?: string
  size?: IconSize
  iconClass?: string
}
const props = withDefaults(defineProps<Props>(), {
  icon: () => [],
  type: 'fas',
  name: 'circle-question',
  size: 'default',
  iconClass: ''
})

const getIcon = computed(() => {
  if (props.icon.length > 0) return props.icon
  return [props.type, props.name]
})
</script>

<template>
  <div class="icon-container" :class="`size-${props.size} ${props.iconClass}`">
    <font-awesome-icon :icon="getIcon" />
  </div>
</template>

<style lang="scss" scoped>
.icon-container {
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