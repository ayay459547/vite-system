<script setup lang="ts">
import { ref } from 'vue'
import { ElTree } from 'element-plus'

import { CustomTree, CustomDivider, CustomButton } from '@/components' // 系統組件

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree, param, test, hello) => {
  console.log(data)
  console.log(param)
  console.log(test)
  console.log(hello)
}

const data: Tree[] = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1'
          },
          {
            id: 10,
            label: 'Level three 1-1-2'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1'
      },
      {
        id: 6,
        label: 'Level two 2-2'
      }
    ]
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1'
      },
      {
        id: 8,
        label: 'Level two 3-2'
      }
    ]
  }
]

const defaultProps = {
  children: 'children',
  label: 'label'
}

const treeRef = ref()

const getCheckedNodes = () => {
  console.log(treeRef.value!.getCheckedNodes(false, false))
}
const getCheckedKeys = () => {
  console.log(treeRef.value!.getCheckedKeys(false))
}

const setCheckedNodes = () => {
  const nodeList = [
    {
      id: 5,
      label: 'Level two 2-1'
    },
    {
      id: 9,
      label: 'Level three 1-1-1'
    }
  ]
  treeRef.value!.setCheckedNodes(nodeList, false)
}

const setCheckedKeys = () => {
  const keyList = [3]
  treeRef.value!.setCheckedKeys(keyList, false)
}

const resetChecked = () => {
  treeRef.value!.setCheckedKeys([], false)
}
</script>

<template>
  <div class="page">
    <ElTree :data="data" :props="defaultProps" />
    <CustomDivider />

    <CustomTree
      ref="treeRef"
      :data="data"
      :props="defaultProps"
      show-checkbox
      node-key="id"
      default-expand-all
      @node-click="handleNodeClick"
    />

    <div class="flex-row i-ga-sm">
      <CustomButton type="info" plain label="get by node" @click="getCheckedNodes" />
      <CustomButton type="primary" plain label="get by key" @click="getCheckedKeys" />
      <CustomButton type="danger" plain label="set by node" @click="setCheckedNodes" />
      <CustomButton type="warning" plain label="set by key" @click="setCheckedKeys" />
      <CustomButton type="success" plain label="reset" @click="resetChecked" />
    </div>
    <CustomDivider />
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
