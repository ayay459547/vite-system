<script setup lang="ts">
import { ElButtonGroup } from 'element-plus'

import { getUuid } from '@/lib/lib_utils' // 工具

import { version, props as buttonGroupProps } from './CustomButtonGroupInfo'

const scopedId = getUuid(version)

const props = defineProps(buttonGroupProps)

</script>

<template>
  <ElButtonGroup
    :size="props.size"
    :type="props.type"
    :class="scopedId"
  >
    <slot></slot>
  </ElButtonGroup>
</template>

<style lang="scss" scoped>

</style>
