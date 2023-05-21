<script setup lang="ts">
import { computed } from 'vue'
import { ElTooltip } from 'element-plus'

type IconType = 'fas' | 'far' | 'fab'

type IconSize = 'large' | 'default' | 'small'

type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'

/**
 * icon 和 type, name 選一種給
 */
interface Props {
  icon?: [IconType, String] | []
  type?: IconType
  name?: String
  size?: IconSize

  tooltip?: boolean
  placement?: Placement
  popover?: boolean
  width?: number
  iconClass?: string
}
const props = withDefaults(defineProps<Props>(), {
  icon: () => [],
  type: () => 'fas',
  name: () => 'circle-question',
  size: () => 'default',
  iconClass: () => '',

  tooltip: () => false,
  width: () => 150,
  placement: () => 'bottom'
})

const getIcon = computed(() => {
  if (props.icon.length > 0) return props.icon
  return [props.type, props.name]
})
</script>

<template>
  <ElTooltip
    v-if="props.tooltip"
    :placement="props.placement"
  >
    <template #default>
      <div class="icon-container" :class="`size-${props.size} ${props.iconClass}`">
        <font-awesome-icon :icon="getIcon" />
      </div>
    </template>
    <template #content>
      <slot>Empty</slot>
    </template>
  </ElTooltip>

  <div v-else class="icon-container" :class="`size-${props.size} ${props.iconClass}`">
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