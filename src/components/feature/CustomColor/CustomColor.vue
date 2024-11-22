<script setup lang="ts">
// import { useSlots } from 'vue'
import { computed } from 'vue'
import { ElColorPicker } from 'element-plus'

import { getUuid } from '@/lib/lib_utils' // 工具

import type { Props } from './CustomColorInfo'
import { version, props as CustomColorInfo } from './CustomColorInfo'

const scopedId = getUuid(version)

const props = defineProps(CustomColorInfo)

// const slots = useSlots()
// const hasSlot = (prop: string): boolean => {
//   return !!slots[prop]
// }

const tempValue = computed<Props.ModelValue>({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => emit('update:model-value', value)
})

const emit = defineEmits(['update:model-value', 'change'])

</script>

<template>
  <div class="color-wrapper" :class="scopedId">
    <ElColorPicker
      v-model="tempValue"
      :size="props.size"
      @change="(value) => emit('change', value)"
    />
  </div>
</template>

<style lang="scss" scoped>
div[class*="__CustomColor"].color {
  &-wrapper {
    display: block;
  }
}
</style>
