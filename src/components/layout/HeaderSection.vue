<script setup lang="ts">
import type { WritableComputedRef } from 'vue'
import { defineProps, computed } from 'vue'

import HamburgerIcon from './HamburgerIcon.vue'

const props = defineProps<{
  isOpen: Boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: Boolean): void
}>()

const tempIsOpen: WritableComputedRef<Boolean> = computed({
  get: () => props.isOpen,
  set: value => emit('update:isOpen', value)
})

const currPath = '選單1 / 選單1-1 / 選單1-1-1'

</script>

<template>
  <div class="header-container">
    <div class="header-left">
      <HamburgerIcon v-model:isOpen="tempIsOpen"></HamburgerIcon>
      <span>{{ currPath }}</span>
    </div>
    <div class="header-right">
      <AdvantIcon></AdvantIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  &-container {
    width: 100%;
    height: 80px;
    background-color: #e6e6e6;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    font-size: 1.2em;
  }

  &-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &-right {
    width: 30px;
    height: 30px;
    border: 1px solid #e6e6e6;
    border-radius: 6px;
  }
}
</style>