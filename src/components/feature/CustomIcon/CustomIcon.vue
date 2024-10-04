<script setup lang="ts">
import { computed } from 'vue'

import { useAsyncComponent } from '@/lib/lib_hook'
import { getUuid, isEmpty } from '@/lib/lib_utils'

import { version, props as iconProps } from './CustomIconInfo'

const XIcon = useAsyncComponent(() => import('./Components/XIcon.vue'), 'rect')

const scopedId = getUuid(version)

const props = defineProps(iconProps)

const getIcon = computed(() => {
  if (
    Array.isArray(props.icon) &&
    props.icon.filter(
      item => !['', undefined, null].includes(item)
    ).length === 2
  ) return props.icon

  return [props.type, props.name]
})
</script>

<template>
  <div
    class="icon-container"
    :class="[
      scopedId,
      `icon-size-${props.size}`,
      `${props.iconClass}`,
    ]"
  >
    <FontAwesomeIcon v-if="isEmpty(props.xType)" :icon="getIcon" />
    <XIcon
      v-else
      class="x-icon"
      :type="props.xType"
      :name="props.name"
    />
  </div>
</template>

<style lang="scss" scoped>
div[class*="__CustomIcon"].icon {
  &-container {
    width: fit-content;
    height: fit-content;
  }

  &-size {
    &-large {
      font-size: 1.5em;
      .x-icon {
        font-size: 1.6em;
      }
    }
    &-default {
      font-size: 1.3em;
      .x-icon {
        font-size: 1.4em;
      }
    }
    &-small {
      font-size: 1em;
      .x-icon {
        font-size: 1.2em;
      }
    }
  }
}
</style>
