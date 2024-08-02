<script setup lang="ts">
import { computed } from 'vue'

import { getUuid, isEmpty } from '@/lib/lib_utils.ts'
import XIcon from './Components/XIcon.vue'

import { version, props as iconProps } from './CustomIconInfo.ts'

const scopedName = '__i-icon__'
const scopedId = getUuid(scopedName)

const props = defineProps(iconProps)

const getIcon = computed(() => {
  if (Array.isArray(props.icon) && props.icon.length > 0) return props.icon
  return [props.type, props.name]
})
</script>

<template>
  <div
    class="icon-container"
    :class="[
      `CustomIcon_${version}`,
      scopedId,
      scopedName,
      `icon-size-${props.size}`,
      `${props.iconClass}`
    ]"
  >
    <FontAwesomeIcon v-if="isEmpty(props.xType)" :icon="getIcon" />
    <XIcon v-else :type="props.xType" :name="props.name" />
  </div>
</template>

<style lang="scss" scoped>
.__i-icon__.icon {
  &-container {
    width: fit-content;
    height: fit-content;
  }

  &-size {
    &-large {
      font-size: 1.5em;
    }
    &-default {
      font-size: 1.3em;
    }
    &-small {
      font-size: 1em;
    }
  }
}
</style>
