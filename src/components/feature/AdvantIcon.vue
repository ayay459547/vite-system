<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
    type: {
        type: String,
        default: 'fas',
        description: `類型:
            fas: solid
            far: regular
            fab: brands `
    },
    icon: {
        type: String,
        default: 'user'
    }
})

</script>

<template>
  <div class="icon-container">
    <font-awesome-icon :icon="[props.type, props.icon]" />
  </div>
</template>

<style lang="scss" scoped>
.icon-container {
  width: fit-content;
  height: fit-content;
}
</style>