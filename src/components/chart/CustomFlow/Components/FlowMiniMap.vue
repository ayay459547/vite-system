<script setup lang="ts">
import type { PropType } from 'vue'
import type { MiniMapNodeFunc } from '@vue-flow/minimap'
import { MiniMap } from '@vue-flow/minimap'

const props = defineProps({
  nodeColor: {
    type: [String, Function] as PropType<string | MiniMapNodeFunc>,
    required: false,
    default: '#fff',
    description: '節點背景顏色'
  },
  nodeStrokeColor: {
    type: [String, Function] as PropType<string | MiniMapNodeFunc>,
    required: false,
    default: '#555',
    description: '邊框顏色'
  },
  nodeClassName: {
    type: [String, Function] as PropType<string | MiniMapNodeFunc>,
    required: false,
    default: undefined,
    description: '額外課程'
  },
  nodeBorderRadius: {
    type: Number as PropType<number>,
    required: false,
    default: 5,
    description: '邊界半徑'
  },
  nodeStrokeWidth: {
    type: Number as PropType<number>,
    required: false,
    default: 2,
    description: '筆畫寬度'
  },
  maskColor: {
    type: String as PropType<string>,
    required: false,
    default: undefined,
    description: '小地圖背景顏色'
  },
  pannable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '使用小地圖在拖曳時平移'
  },
  zoomable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '使用小地圖在滾輪上進行縮放'
  }
})

</script>

<template>
  <MiniMap
    :nodeColor="props.nodeColor"
    :nodeStrokeColor="props.nodeStrokeColor"
    :nodeClassName="props.nodeClassName"
    :nodeBorderRadius="props.nodeBorderRadius"
    :nodeStrokeWidth="props.nodeStrokeWidth"
    :maskColor="props.maskColor"
    :pannable="props.pannable"
    :zoomable="props.zoomable"
  >
    <slot></slot>
  </MiniMap>
</template>

<style lang="scss" scoped></style>
