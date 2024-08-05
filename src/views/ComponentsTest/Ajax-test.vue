<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { ajax } from '@/lib/lib_ajax'
import { CustomTable } from '@/components'

interface Todos {
  completed: boolean
  id: number
  title: string
  userId: number
}

const todos = ref<Todos[]>([])
const todos2 = ref<Todos[]>([])

/**
 * 測試真實 api
 * post + get
 */

const getTodosData = async () => {
  const res = await ajax<Todos[]>(
    {
      url: '/todos',
      method: 'get',
      data: {}
    },
    {
      isFakeData: false,
      fakeData: [
        {
          userId: 1,
          id: 1,
          title: 'delectus aut autem',
          completed: false
        },
        {
          userId: 2,
          id: 2,
          title: 'quis ut nam facilis et officia qui',
          completed: false
        }
      ],
      delay: 300
    }
  )

  todos.value = res
  console.log('get todos => ', todos.value)
}

const getTodosData2 = todos => {
  ajax<Todos[]>(
    {
      url: '/posts',
      method: 'post',
      data: { todos }
    },
    {
      isFakeData: false,
      fakeData: [
        {
          userId: 1,
          id: 1,
          title: 'delectus aut autem',
          completed: false
        },
        {
          userId: 2,
          id: 2,
          title: 'quis ut nam facilis et officia qui',
          completed: false
        }
      ],
      delay: 300
    }
  ).then(res => {
    todos2.value = res
    console.log('post todos2 => ', todos2.value)
  })
}

onMounted(async () => {
  await getTodosData()
  getTodosData2(todos.value)
})

const tableData = [
  { name: '小名', age: 13, address: '台北市大安區' },
  { name: '小華', age: 22, address: '桃園市中壢區' },
  { name: '小安', age: 34, address: '桃園市楊梅區' }
]

const tableColumns = [
  { key: 'name', label: '名稱', prop: 'name', width: 150 },
  { key: 'age', label: '年齡', prop: 'age', width: 120 },
  { key: 'address', label: '地址', prop: 'address', minWidth: 200 }
]
</script>

<template>
  <div class="page">
    api test
    <div style="width: 800px; height: 500px">
      <CustomTable
        title="表單組件測試"
        version="1.0.0"
        setting-key="test-table-1"
        :table-data="tableData"
        :table-columns="tableColumns"
      />
    </div>

    <div style="width: 800px; height: 500px">
      <CustomTable
        title="表單組件測試"
        version="1.0.0"
        setting-key="test-table-2"
        :table-data="tableData"
        :table-columns="tableColumns"
      >
        <template #header-all="{ column }">
          {{ column.label + '-header' }}
        </template>
        <template #column-all="{ data }">
          {{ data + '-column' }}
        </template>
      </CustomTable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
