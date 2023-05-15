<script setup lang="ts">
type IconType = 'fas' | 'far' | 'fab'

type IconSize = 'large' | 'default' | 'small'

/**
 * icon 和 type, name 選一種給
 */
interface Props {
  icon?: [IconType, String] | []
  type?: IconType
  name?: String
  size?: IconSize
}
const props = withDefaults(defineProps<Props>(), {
  icon: () => [],
  type: () => 'fas',
  name: () => 'circle-question',
  size: () => 'default'
})
</script>

<template>
  <div class="icon-container" :class="`size-${props.size}`">
    <font-awesome-icon v-if="props.icon.length > 0" :icon="props.icon" />
    <font-awesome-icon v-else :icon="[props.type, props.name]" />
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
    font-size: 1.2em;
  }
  &.size-small {
    font-size: 1em;
  }
}
</style>