<script setup lang="ts">
import { useSlots, ref } from 'vue'
import { ElTree } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具

import type { Types, Emits, Expose } from './CustomTreeInfo'
import { version, props as treeProps } from './CustomTreeInfo'

const scopedId = getUuid(version)

const props = defineProps(treeProps)

const emit = defineEmits(['node-click', 'check-change', 'check'])

const onNodeClick: Emits['nodeClick'] = ($data1: any, $data2: any, $data3: any, $data4: any) => {
  emit('node-click', $data1, $data2, $data3, $data4)
}
const onCheckChange: Emits['nodeClick'] = ($data1: any, $data2: any, $data3: any) => {
  emit('check-change', $data1, $data2, $data3)
}
const onCheck: Emits['check'] = (nodeDate: any, checkedData: any) => {
  emit('check', nodeDate, checkedData)
}

const ElTreeRef = ref<InstanceType<typeof ElTree>>()

// 取得資料
const getCheckedNodes: Expose['getCheckedNodes'] = (leafOnly?: boolean, includeHalfChecked?: boolean) => {
  return ElTreeRef.value!.getCheckedNodes(leafOnly ?? false, includeHalfChecked ?? false)
}
const getCheckedKeys: Expose['getCheckedKeys'] = (leafOnly?: boolean) => {
  return ElTreeRef.value!.getCheckedKeys(leafOnly ?? false)
}

// 設定勾選
const setCheckedNodes: Expose['setCheckedNodes'] = (nodeList: Node[], leafOnly?: boolean) => {
  ElTreeRef.value!.setCheckedNodes(nodeList, leafOnly ?? false)
}
const setCheckedKeys: Expose['setCheckedKeys'] = (keyList: Array<string | number>, leafOnly?: boolean) => {
  ElTreeRef.value!.setCheckedKeys(keyList, leafOnly ?? false)
}
const resetChecked: Expose['resetChecked'] = () => {
  ElTreeRef.value!.setCheckedKeys([], false)
}
const setChecked: Expose['setChecked'] = (checkNode: Types['checkNode'], checked: boolean, deep: boolean) => {
  ElTreeRef.value!.setChecked(checkNode, checked ?? false, deep ?? false)
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
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElTree
    ref="ElTreeRef"
    :data="props.data"
    :props="props.props"
    :node-key="props.nodeKey"
    :highlight-current="props.highlightCurrent"
    :default-expand-all="props.defaultExpandAll"
    :show-checkbox="props.showCheckbox"
    class="tree-container"
    :class="scopedId"
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
</template>

<style lang="scss" scoped>
div[class*="__CustomTree"].tree {
  &-container {
    width: 100%;
    height: fit-content;
  }
}
</style>
