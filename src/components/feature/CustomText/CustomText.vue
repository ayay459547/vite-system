<script setup lang="ts">
import { ElText } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'
import { version, props as textProps } from './CustomTextInfo'

const scopedId = getUuid(version)

const props = defineProps(textProps)

</script>

<template>
  <ElText
    :type="props.type"
    :size="props.size"
    :truncated="props.truncated"
    :line-clamp="props.lineClamp"
    :tag="props.tag"
    :class="scopedId"
  >
    <slot></slot>
  </ElText>
</template>

<style lang="scss" scoped></style>
