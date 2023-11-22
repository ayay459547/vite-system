<script setup lang="ts">
import { ElTree } from 'element-plus'
import { type PropType, useSlots, ref } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'

export interface TreeNodeData {
  [key: string]: any
}

export interface TreeOptionProps {
  children?: string
  label?: string | ((data: TreeNodeData, node: Node) => string)
  disabled?: string | ((data: TreeNodeData, node: Node) => string)
  isLeaf?: string | ((data: TreeNodeData, node: Node) => boolean)
  class?: (data: TreeNodeData, node: Node) => string | {
      [key: string]: boolean
  } | string
}

const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '樹結構資料'
  },
  props: {
    type: Object as PropType<TreeOptionProps | any>,
    required: false,
    default: () => {
      return {}
    },
    description: '參數'
  },
  nodeKey: {
    type: String as PropType<string>,
    required: false,
    description: '節點資料唯一值'
  },
  highlightCurrent: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否有背景顏色 在節點被選中'
  },
  defaultExpandAll: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否展開所有節點'
  },
  showCheckbox: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否使用checkbox'
  }
})

const emit = defineEmits([
  'node-click',
  'check-change',
  'check'
])

const onNodeClick = ($data1, $data2, $data3, $data4) => {
  emit('node-click', $data1, $data2, $data3, $data4)
}
const onCheckChange = ($data1, $data2, $data3) => {
  emit('check-change', $data1, $data2, $data3)
}
const onCheck = ($data1, $data2) => {
  emit('check', $data1, $data2)
}

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const elTreeRef = ref<InstanceType<typeof ElTree>>()

// 取得資料
const getCheckedNodes = (leafOnly?: boolean, includeHalfChecked?: boolean) => {
  return elTreeRef.value!.getCheckedNodes(leafOnly ?? false, includeHalfChecked ?? false)
}
const getCheckedKeys = (leafOnly?: boolean) => {
  return elTreeRef.value!.getCheckedKeys(leafOnly ?? false)
}

// 設定勾選
const setCheckedNodes = (nodeList: Node[], leafOnly?: boolean) => {
  elTreeRef.value!.setCheckedNodes(nodeList, leafOnly ?? false)
}

const setCheckedKeys = (keyList: Array<string | number>, leafOnly?: boolean) => {
  elTreeRef.value!.setCheckedKeys(keyList, leafOnly ?? false)
}

const resetChecked = () => {
  elTreeRef.value!.setCheckedKeys([], false)
}

defineExpose({
  getCheckedNodes,
  getCheckedKeys,
  setCheckedNodes,
  setCheckedKeys,
  resetChecked
})

</script>

<template>
  <div class="tree-wrapper">
    <ElTree
      ref="elTreeRef"
      :data="props.data"
      :props="props.props"
      :node-key="props.nodeKey"
      :highlight-current="props.highlightCurrent"
      :default-expand-all="props.defaultExpandAll"
      :show-checkbox="props.showCheckbox"
      @node-click="onNodeClick"
      @check-change="onCheckChange"
      @check="onCheck"
    >
      <!-- 資料為空 顯示內容 -->
      <template v-if="hasSlot('empty')" #empty>
        <slot name="empty"></slot>
      </template>
      <!-- 節點顯示自訂 -->
      <template v-if="hasSlot('default')" #default="{ node, data }">
        <slot name="default" :node="node" :data="data"></slot>
      </template>
    </ElTree>
  </div>
</template>

<style lang="scss" scoped>
.tree {
  &-wrapper {
    width: 100%;
    height: fit-content;
  }
}
</style>
