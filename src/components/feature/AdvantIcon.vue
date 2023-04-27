<script setup lang="ts">
import { defineProps } from 'vue'

type IconType = 'fas' | 'far' | 'fab'
/**
 * icon 和 type, name 選一種給
 */
interface Props {
  icon?: [IconType, String] | []
  type?: IconType
  name?: String
}
const props = withDefaults(defineProps<Props>(), {
  icon: () => [],
  type: () => 'fas',
  name: () => 'user'
})


</script>

<template>
  <div class="icon-container">
    <font-awesome-icon v-if="props.icon.length > 0" :icon="props.icon" />
    <font-awesome-icon v-else :icon="[props.type, props.name]" />
  </div>
</template>

<style lang="scss" scoped>
.icon-container {
  width: fit-content;
  height: fit-content;
}
</style>