<script setup lang="ts">
import { computed } from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { useAsyncComponent } from '@/lib/lib_hook' // 自訂Composition API
import { getUuid, isEmpty } from '@/lib/lib_utils' // 工具

import { version, props as iconProps } from './CustomIconInfo'

const XIcon = useAsyncComponent(() => import('./Components/XIcon.vue'), 'rect')

const scopedId = getUuid(version)

const props = defineProps(iconProps)

const getIcon = computed(() => {
  if (
    Array.isArray(props.icon) &&
    props.icon.filter(item => !['', undefined, null].includes(item)).length === 2
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
    <slot>
      <FontAwesomeIcon v-if="isEmpty(props.xType)" :icon="getIcon" />
      <XIcon
        v-else
        class="x-icon"
        :type="props.xType"
        :name="props.name"
      />
    </slot>
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
      font-size: 1.3em;
      .x-icon {
        font-size: 1.4em;
      }
    }
    &-default {
      font-size: 1.2em;
      .x-icon {
        font-size: 1.3em;
      }
    }
    &-small {
      font-size: 1.1em;
      .x-icon {
        font-size: 1.2em;
      }
    }
  }
}
</style>
