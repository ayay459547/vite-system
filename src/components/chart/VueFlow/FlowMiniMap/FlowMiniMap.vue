<script setup lang="ts">
import { MiniMap } from '@vue-flow/minimap'

import { getUuid } from '@/lib/lib_utils' // 工具
import { version, props as flowMiniMapProps } from './FlowMiniMapInfo'

const scopedId = getUuid(version)

const props = defineProps(flowMiniMapProps)

</script>

<template>
  <MiniMap
    :class="`${scopedId}`"
    :nodeColor="props.nodeColor"
    :nodeStrokeColor="props.nodeStrokeColor"
    :nodeClassName="props.nodeClassName"
    :nodeBorderRadius="props.nodeBorderRadius"
    :nodeStrokeWidth="props.nodeStrokeWidth"
    :maskColor="props.maskColor"
    :pannable="props.pannable"
    :zoomable="props.zoomable"
  ></MiniMap>
</template>

<style lang="scss" scoped></style>
