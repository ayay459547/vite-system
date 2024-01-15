<script setup lang="ts">
import { useSlots, ref } from 'vue'
import { ElTree } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'

import type { CheckNode } from './CustomTreeInfo'
import {
  version,
  scopedId,
  props as treeProps
} from './CustomTreeInfo'

const props = defineProps(treeProps)

const emit = defineEmits([
  'node-click',
  'check-change',
  'check'
])

const onNodeClick = ($data1: any, $data2: any, $data3: any, $data4: any) => {
  emit('node-click', $data1, $data2, $data3, $data4)
}
const onCheckChange = ($data1: any, $data2: any, $data3: any) => {
  emit('check-change', $data1, $data2, $data3)
}
const onCheck = (nodeDate: any, checkedData: any) => {
  emit('check', nodeDate, checkedData)
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

const setChecked = (checkNode: CheckNode, checked: boolean, deep: boolean) => {
  elTreeRef.value!.setChecked(checkNode, checked ?? false, deep ?? false)
}

defineExpose({
  getCheckedNodes,
  getCheckedKeys,
  setCheckedNodes,
  setCheckedKeys,
  resetChecked,
  setChecked
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

</script>

<template>
  <div :class="`CustomTree_${version} ${scopedId}`" class="__tree-wrapper">
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
.__tree {
  &-wrapper {
    width: 100%;
    height: fit-content;
  }
}
</style>
