<script setup lang="ts">
import { ref, onMounted } from 'vue'

import markdown from '@/components/feature/CustomDraggable/CustomDraggable.md?raw'
import { CustomDivider, CustomMarkdown, CustomButton, CustomDraggable } from '@/components'
import { getUuid } from '@/lib/lib_utils'

const list1Default = [
  { id: '1', value: 'test-1' },
  { id: '2', value: 'test-2' },
  { id: '3', value: 'test-3' },
  { id: '4', value: 'test-4' },
  { id: '5', value: 'test-5' }
]
const list2Default = [
  { id: '11', value: 'test-11' },
  { id: '12', value: 'test-12' },
  { id: '13', value: 'test-13' },
  { id: '14', value: 'test-14' },
  { id: '15', value: 'test-15' }
]

const list1 = ref([])
const list2 = ref([])

const getData = (rowRandom: string): string => {
  return rowRandom.split('-')[0] ?? rowRandom
}

const addData = () => {
  const [ row1, row2 ] = [ getUuid(), getUuid() ]
  list1.value.push({
    id: getData(row1),
    value: getData(row1)
  })

  list2.value.push({
    id: getData(row2),
    value: getData(row2)
  })
}

const resetData = () => {
  list1.value = list1Default.map(item => item)
  list2.value = list2Default.map(item => item)
}

const randomData = () => {
  const [ row1, row2, row3, row4, row5 ] = [ getUuid(), getUuid(), getUuid(), getUuid(), getUuid() ]

  list1.value = [
    { id: getData(row1), value: getData(row1) },
    { id: getData(row2), value: getData(row2) },
    { id: getData(row3), value: getData(row3) }
  ]

  list2.value = [
    { id: getData(row4), value: getData(row4) },
    { id: getData(row5), value: getData(row5) }
  ]
}

const sortData = () => {
  list1.value.sort(() => {
    return Math.random() - 0.5
  })

  list2.value.sort(() => {
    return Math.random() - 0.5
  })
}

onMounted(() => {
  resetData()
})

</script>

<template>
  <div class="page">
    <div class="flex-row i-ga-xs">
      <CustomButton label="新增資料" class="i-mb-md" type="primary" @click="addData"/>
      <CustomButton label="重置資料" class="i-mb-md" type="success" @click="resetData"/>
      <CustomButton label="隨機資料" class="i-mb-md" type="info" @click="randomData"/>
      <CustomButton label="亂序資料" class="i-mb-md" type="warning" @click="sortData"/>
    </div>

    <div class="flex-row i-ga-xs">
      <CustomDraggable
        v-model="list1"
        class="border-info"
        ghost-class="bg-primary"
        group="test"
      >
        <template #header>
          <div class="i-pa-md">{{ 'header' }}</div>
        </template>
        <template #footer>
          <div class="i-pa-md">{{ 'footer' }}</div>
        </template>
        <template #item="{ element }">
          <div class="i-pa-md">
            {{ `slot item(必填插槽): ${element.value}` }}
          </div>
        </template>
      </CustomDraggable>

      <CustomDraggable
        v-model="list2"
        class="border-info"
        ghost-class="bg-primary"
        group="test"
      >
        <template #header>
          <div class="i-pa-md">{{ 'header' }}</div>
        </template>
        <template #footer>
          <div class="i-pa-md">{{ 'footer' }}</div>
        </template>
        <template #item="{ element }">
          <div class="i-pa-md">
            {{ `slot item(必填插槽): ${element.value}` }}
          </div>
        </template>
      </CustomDraggable>
    </div>

    <CustomDivider>markdown</CustomDivider>
    <CustomMarkdown :text="markdown" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px;
}
</style>
