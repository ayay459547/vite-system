<script setup lang="ts">
import { useSlots } from 'vue'
import { ElCard } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import { version, props as cardProps } from './CustomCardInfo'

const scopedId = getUuid(version)

const props = defineProps(cardProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <ElCard
    :header="props.header"
    :footer="props.footer"
    :body-style="props.bodyStyle"
    :body-class="props.bodyClass"
    :shadow="props.shadow"
    :class="scopedId"
  >
    <template v-if="hasSlot('default')" #default>
      <slot name="default"></slot>
    </template>
    <template v-if="hasSlot('header')" #header>
      <slot name="header"></slot>
    </template>
    <template v-if="hasSlot('footer')" #footer>
      <slot name="footer"></slot>
    </template>
  </ElCard>
</template>

<style lang="scss" scoped></style>
