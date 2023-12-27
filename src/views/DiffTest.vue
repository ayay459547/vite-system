<script setup lang="ts">
import { onMounted } from 'vue'

import { diff } from '@/lib/lib_diff'

const list1 = [
  { id: 1, no: 'no-1', name: 'name-1' },
  { id: 2, no: 'no-2', name: 'name-2' },
  { id: 3, no: 'no-3', name: 'name-3' },
  { id: 4, no: 'no-4', name: 'name-4' },
  { id: 5, no: 'no-5', name: 'name-5' }
]

const list2 = [
  { id: 2, no: 'no-2-u', name: 'name-2' },
  { id: 1, no: 'no-1', name: 'name-1' },
  { id: 3, no: 'no-3', name: 'name-3' },
  { id: 4, no: 'no-4-u', name: 'name-4' },
  { id: 6, no: 'no-6', name: 'name-6' },
  { id: 5, no: 'no-5', name: 'name-5' }
]

onMounted(() => {
  const diffList = diff(list1, list2, 'id')
  console.log(diffList)
})

</script>

<template>
  <div class="page">
    <h2>Diff 演算法測試</h2>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: gray;
}
</style>
