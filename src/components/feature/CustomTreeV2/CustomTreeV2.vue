<script setup lang="ts">
import type { Ref } from 'vue'
import { useSlots, ref, reactive, effectScope, onMounted, onUnmounted } from 'vue'
import type { TreeNode } from 'element-plus'
import { ElTreeV2 } from 'element-plus'
// import type Node from 'element-plus/es/components/tree/src/model/node'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具
import { throttle } from '@/lib/lib_lodash'

import type { Types, Emits, Expose } from './CustomTreeV2Info'
import { version, props as treeProps } from './CustomTreeV2Info'

const scopedId = getUuid(version)

const props = defineProps(treeProps)

const emit = defineEmits(['node-click', 'check-change', 'check'])

const onNodeClick: Emits['nodeClick'] = (data: Types['treeNodeData'], node: TreeNode, e: MouseEvent) => {
  emit('node-click', e, data, node)
}
const onCheckChange: Emits['checkChange'] = (data: Types['treeNodeData'], checked: boolean) => {
  emit('check-change', data, checked)
}
const onCheck: Emits['check'] = (nodeDate: any, checkedData: any) => {
  emit('check', nodeDate, checkedData)
}

const ElTreeV2Ref = ref<InstanceType<typeof ElTreeV2>>()

// 取得資料
const getCheckedNodes: Expose['getCheckedNodes'] = (leafOnly?: boolean) => {
  return ElTreeV2Ref.value!.getCheckedNodes(leafOnly ?? false)
}
const getCheckedKeys: Expose['getCheckedKeys'] = (leafOnly?: boolean) => {
  return ElTreeV2Ref.value!.getCheckedKeys(leafOnly ?? false)
}

// 設定勾選
const setCheckedKeys: Expose['setCheckedKeys'] = (keyList: Array<Types['treeKey']>) => {
  ElTreeV2Ref.value!.setCheckedKeys(keyList)
}

const resetChecked: Expose['resetChecked'] = () => {
  ElTreeV2Ref.value!.setCheckedKeys([])
}

const setChecked: Expose['setChecked'] = (key: Types['treeKey'], checked: boolean) => {
  ElTreeV2Ref.value!.setChecked(key, checked)
}

const filter: Expose['filter'] = (query: string) => {
  ElTreeV2Ref.value!.filter(query)
}

defineExpose({
  getCheckedNodes,
  getCheckedKeys,
  setCheckedKeys,
  resetChecked,
  setChecked,
  filter
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

// 高度計算
const wrapRef: Ref<HTMLElement | null> = ref(null)
const treeSize = reactive({
  width: 240,
  height: 200
})
const wrapROcallback = throttle<ResizeObserverCallback>((entries: ResizeObserverEntry[]) => {
  entries.forEach(async entry => {
    const { width = 0, height = 0 } = entry.contentRect

    treeSize.width = width
    treeSize.height = height
  })
}, 100)
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
  <div ref="wrapRef" class="tree-container" :class="scopedId">
    <ElTreeV2
      ref="ElTreeV2Ref"
      :data="props.data"
      :props="props.props"
      :highlight-current="props.highlightCurrent"
      :default-expand-all="props.defaultExpandAll"
      :show-checkbox="props.showCheckbox"
      :style="`max-width: ${treeSize.width}px`"
      :height="treeSize.height"
      :filter-method="props.filterMethod"
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
div[class*="__CustomTreeV2"].tree {
  &-container {
    width: 100%;
    height: 100%;
  }
}
</style>
