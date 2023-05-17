<script setup lang="ts">
import type { WritableComputedRef } from 'vue'
import { computed } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()

const tempIsOpen: WritableComputedRef<boolean> = computed({
  get: () => props.isOpen,
  set: value => emit('update:isOpen', value)
})

const changeOpen = (): void => {
  tempIsOpen.value = !tempIsOpen.value
}
</script>

<template>
  <div
    class="hamburger-container"
    :class="[{ 'open': tempIsOpen }, { 'close': !tempIsOpen }]"
    @click="changeOpen"
  >
    <div class="item-bar"></div>
  </div>
</template>

<style lang="scss" scoped>
$bar-width: 40px;
$bar-height: 5px;

@mixin bar-style($height, $width, $top) {
  display: block;
  content: "";
  transition-duration: 0.5s;
  position: absolute;
  background-color: $side-bg-color;
  border-radius: 6px;
  left: 0;
  top: $top;
  width: $width;
  height: $height;
}
.hamburger {
  &-container {
    position: relative;
    cursor: pointer;
    width: $bar-width;
    height: $bar-width;
    .item-bar {
      transition-duration: 0.3s;
      @include bar-style($bar-height, $bar-width, 17px);
      &:before {
        @include bar-style($bar-height, $bar-width, -12px);
      }
      &:after {
        @include bar-style($bar-height, $bar-width, 12px);
      }
    }
    &:hover {
      &.open {
        .item-bar {
          transform: rotateZ(180deg);
          &:before {
            transform: rotateZ(45deg) scaleX(0.75) translate(13px, -6px);
          }
          &:after {
            transform: rotateZ(-45deg) scaleX(0.75) translate(13px, 6px);
          }
        }
      }
      &.close {
        .item-bar {
          transform: rotateZ(-180deg);
          &:before {
            transform: rotateZ(-45deg) scaleX(0.75) translate(-13px, -6px);
          }
          &:after {
            transform: rotateZ(45deg) scaleX(0.75) translate(-13px, 6px);
          }
        }
      }
    }
  }
}
</style>