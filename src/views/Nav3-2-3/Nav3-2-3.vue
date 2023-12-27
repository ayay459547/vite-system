<script setup lang="ts">
import { ref } from 'vue'

import { CustomDraggable } from '@/components'

const options = [
  { id: 1, name: 'test1' },
  { id: 2, name: 'test2' },
  { id: 3, name: 'test3' },
  { id: 4, name: 'test4' },
  { id: 5, name: 'test5' }
]

const options2 = [
  { id: 6, name: 'test6' },
  { id: 7, name: 'test7' },
  { id: 8, name: 'test8' },
  { id: 9, name: 'test9' },
  { id: 10, name: 'test10' }
]

const options3 = [
  { id: 6, name: 'test6' },
  { id: 7, name: 'test7' },
  { id: 8, name: 'test8' },
  { id: 9, name: 'test9' },
  { id: 10, name: 'test10' }
]

const list = ref(options)
const list2 = ref(options2)
const list3 = ref(options3)

const clone = (original: any) => {
  const findIndex = list2.value.findIndex(item => {
    return item.name === original.name
  })

  if (findIndex === -1) {
    return original
  }
}

</script>

<template>
  <div class="page">
    <CustomDraggable
      v-model="list"
      :group="{ name: 'option', pull: 'clone', put: false }"
      :clone="clone"
    >
      <template #item="{ element }">
        <div class="border-info i-pa-md fill-x">{{ element.name }}</div>
      </template>
    </CustomDraggable>

    <CustomDraggable
      v-model="list2"
      group="option"
    >
      <template #item="{ element }">
        <div class="border-info i-pa-md fill-x">{{ element.name }}</div>
      </template>
    </CustomDraggable>

    <CustomDraggable
      v-model="list3"
    >
      <template #item="{ element }">
        <div class="border-info i-pa-md fill-x">{{ element.name }}</div>
      </template>
    </CustomDraggable>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  gap: 16px;
}
</style>
