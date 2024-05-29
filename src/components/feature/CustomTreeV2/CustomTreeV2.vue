<script setup lang="ts">
import type { Ref } from 'vue'
import { useSlots, ref, reactive, effectScope, onMounted, onUnmounted } from 'vue'
import type { TreeNode } from 'element-plus'
import { ElTreeV2 } from 'element-plus'
// import type Node from 'element-plus/es/components/tree/src/model/node'

import { getUuid } from '@/lib/lib_utils'
import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'

import type { Custom, Emits, Expose } from './CustomTreeV2Info'
import { version, props as treeProps } from './CustomTreeV2Info'

const scopedName = '__i-tree-v2__'
const scopedId = getUuid(scopedName)

const props = defineProps(treeProps)

const emit = defineEmits(['node-click', 'check-change', 'check'])

const onNodeClick: Emits.NodeClick = (data: Custom.TreeNodeData, node: TreeNode, e: MouseEvent) => {
  emit('node-click', e, data, node)
}
const onCheckChange: Emits.CheckChange = (data: Custom.TreeNodeData, checked: boolean) => {
  emit('check-change', data, checked)
}
const onCheck: Emits.Check = (nodeDate: any, checkedData: any) => {
  emit('check', nodeDate, checkedData)
}

const elTreeV2Ref = ref<InstanceType<typeof ElTreeV2>>()

// 取得資料
const getCheckedNodes: Expose.GetCheckedNodes = (leafOnly?: boolean) => {
  return elTreeV2Ref.value!.getCheckedNodes(leafOnly ?? false)
}
const getCheckedKeys: Expose.GetCheckedKeys = (leafOnly?: boolean) => {
  return elTreeV2Ref.value!.getCheckedKeys(leafOnly ?? false)
}

// 設定勾選
const setCheckedKeys: Expose.SetCheckedKeys = (keyList: Array<Custom.TreeKey>) => {
  elTreeV2Ref.value!.setCheckedKeys(keyList)
}

const resetChecked: Expose.ResetChecked = () => {
  elTreeV2Ref.value!.setCheckedKeys([])
}

const setChecked: Expose.SetChecked = (key: Custom.TreeKey, checked: boolean) => {
  elTreeV2Ref.value!.setChecked(key, checked)
}

defineExpose({
  getCheckedNodes,
  getCheckedKeys,
  setCheckedKeys,
  resetChecked,
  setChecked
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

// 高度計算
const wrapRef: Ref<HTMLElement | null> = ref(null)
const treeSize = reactive({
  width: 240,
  height: 200
})
const wrapROcallback = throttle((entries: ResizeObserverEntry[]) => {
  entries.forEach(async entry => {
    const { width = 0, height = 0 } = entry.contentRect

    treeSize.width = width
    treeSize.height = height
  })
}, 100) as ResizeObserverCallback
const wrapRO = new ResizeObserver(wrapROcallback)

const scope = effectScope()

onMounted(() => {
  if (wrapRef.value !== null) {
    wrapRO.observe(wrapRef.value)
  }
})
onUnmounted(() => {
  scope.stop()

  if (wrapRO) {
    wrapRO.disconnect()
  }
})
</script>

<template>
  <div
    ref="wrapRef"
    class="__tree-container"
    :class="[
      `CustomTree_${version}`,
      scopedId,
      scopedName
    ]"
  >
    <ElTreeV2
      ref="elTreeV2Ref"
      :data="props.data"
      :props="props.props"
      :highlight-current="props.highlightCurrent"
      :default-expand-all="props.defaultExpandAll"
      :show-checkbox="props.showCheckbox"
      :style="`max-width: ${treeSize.width}px`"
      :height="treeSize.height"
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
.__i-tree-v2__.tree {
  &-container {
    width: 100%;
    height: 100%;
  }
}
</style>
