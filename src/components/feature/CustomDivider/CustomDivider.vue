<script setup lang="ts">
import type { PropType } from 'vue'
import { useSlots } from 'vue'
import { ElDivider } from 'element-plus'

export type DividerDirection = 'horizontal' | 'vertical'

export type DividerBorderStyle = 'none'| 'hidden'| 'dotted'| 'dashed'| 'solid'| 'double'| 'groove'| 'ridge'| 'inset'| 'outset'

export type DividerContentPosition = 'left' | 'right' | 'center'

const props = defineProps({
  direction: {
    type: String as PropType<DividerDirection>,
    required: false,
    default: 'horizontal',
    description: `horizontal: 橫線
    vertical: 直線`
  },
  borderStyle: {
    type: String as PropType<DividerBorderStyle>,
    required: false,
    default: 'solid',
    description: `線的類型
      css border 的 style`
  },
  contentPosition: {
    type: String as PropType<DividerContentPosition>,
    required: false,
    default: 'center',
    description: '文字位置'
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

</script>

<template>
  <div class="divider-wrapper">
    <ElDivider
      :direction="props.direction"
      :border-style="props.borderStyle"
      :content-position="props.contentPosition"
    >
      <template v-if="hasSlot('default')" #default>
        <slot></slot>
      </template>
    </ElDivider>
  </div>
</template>

<style lang="scss" scoped>
.divider {
  &-wrapper {
    width: 100%;
    height: fit-content;
  }
}
</style>
