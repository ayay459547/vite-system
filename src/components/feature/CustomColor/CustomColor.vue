<script setup lang="ts">
// import { useSlots } from 'vue'
import { computed } from 'vue'
import { ElColorPicker } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import type { Props } from './CustomColorInfo'
import { version, props as CustomColorInfo } from './CustomColorInfo'

const scopedId = getUuid('__i-watermark__')

const props = defineProps(CustomColorInfo)

// const slots = useSlots()
// const hasSlot = (prop: string): boolean => {
//   return !!slots[prop]
// }

const tempValue = computed<Props.ModelValue>({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => emit('update:modelValue', value)
})

const emit = defineEmits(['update:modelValue', 'change'])

</script>

<template>
  <div
    :class="`CustomColorInfo_${version} ${scopedId}`"
    class="__cololr-wrapper"
  >
    <ElColorPicker
      v-model="tempValue"
      :size="props.size"
    />
  </div>
</template>

<style lang="scss" scoped>
.__color {
  &-wrapper {
    display: block;
  }
}
</style>
