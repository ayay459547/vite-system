<script setup lang="ts">
import { useSlots, ref } from 'vue'
import type { TreeNode } from 'element-plus'
import { ElTreeV2 } from 'element-plus'
// import type Node from 'element-plus/es/components/tree/src/model/node'

import { getUuid } from '@/lib/lib_utils'

// import type { CheckNode } from './CustomTreeV2Info'
import { version, props as treeProps } from './CustomTreeV2Info'

const scopedId = getUuid('__i-tree__')

const props = defineProps(treeProps)

const emit = defineEmits(['node-click', 'check-change', 'check'])

type TreeNodeData = any

const onNodeClick = (data: TreeNodeData, node: TreeNode, e: MouseEvent) => {
  emit('node-click', e, data, node)
}
const onCheckChange = (data: TreeNodeData, checked: boolean) => {
  emit('check-change', data, checked)
}
const onCheck = (nodeDate: any, checkedData: any) => {
  emit('check', nodeDate, checkedData)
}

const elTreeV2Ref = ref<InstanceType<typeof ElTreeV2>>()

// 取得資料
// const getCheckedNodes = (leafOnly?: boolean, includeHalfChecked?: boolean) => {
//   return elTreeV2Ref.value!.getCheckedNodes(leafOnly ?? false, includeHalfChecked ?? false)
// }
// const getCheckedKeys = (leafOnly?: boolean) => {
//   return elTreeV2Ref.value!.getCheckedKeys(leafOnly ?? false)
// }

// 設定勾選
// const setCheckedNodes = (nodeList: Node[], leafOnly?: boolean) => {
//   elTreeV2Ref.value!.setCheckedNodes(nodeList, leafOnly ?? false)
// }

// const setCheckedKeys = (keyList: Array<string | number>, leafOnly?: boolean) => {
//   elTreeV2Ref.value!.setCheckedKeys(keyList, leafOnly ?? false)
// }

// const resetChecked = () => {
//   elTreeV2Ref.value!.setCheckedKeys([], false)
// }

// const setChecked = (checkNode: CheckNode, checked: boolean, deep: boolean) => {
//   elTreeV2Ref.value!.setChecked(checkNode, checked ?? false, deep ?? false)
// }

defineExpose({
  // getCheckedNodes,
  // getCheckedKeys,
  // setCheckedNodes,
  // setCheckedKeys,
  // resetChecked,
  // setChecked
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <div :class="`CustomTree_${version} ${scopedId}`" class="__tree-wrapper">
    <ElTreeV2
      ref="elTreeV2Ref"
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
    </ElTreeV2>
  </div>
</template>

<style lang="scss" scoped>
.__tree {
  &-wrapper {
    width: 100%;
    height: fit-content;
  }
}
</style>
