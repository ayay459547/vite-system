<script setup lang="ts">
import { type PropType, useSlots } from 'vue'
import { ElBadge } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

export type BadgeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

const props = defineProps({
  value: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    default: '',
    description: '顯示的值'
  },
  max: {
    type: Number as PropType<number>,
    required: false,
    default: 99,
    description: '最大值'
  },
  isDot: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否顯示小圓點'
  },
  hidden: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否隱藏標記'
  },
  type: {
    type: String as PropType<BadgeType>,
    required: false,
    default: 'primary',
    description: '類型'
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const scopedId = getUuid('__i-badge__')

</script>

<template>
  <div class="badge-wrapper" :class="scopedId">
    <ElBadge
      :value="props.value"
      :max="props.max"
      :is-dot="props.isDot"
      :hidden="props.hidden"
      :type="props.type"
    >
      <template v-if="hasSlot('default')" #default>
        <slot></slot>
      </template>
    </ElBadge>
  </div>
</template>

<style lang="scss" scoped>
.badge {
  &-wrapper {
    width: 100%;
    height: fit-content;
  }
}
</style>
