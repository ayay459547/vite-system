<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ajax } from '@/lib/ajax'

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
  const res = await ajax<Todos[]>({
    url: '/todos',
    method: 'get',
    data: {}
  }, {
    getFakeData: false,
    fakeData: [
      {
        'userId': 1,
        'id': 1,
        'title': 'delectus aut autem',
        'completed': false
      },
      {
        'userId': 2,
        'id': 2,
        'title': 'quis ut nam facilis et officia qui',
        'completed': false
      }
    ],
    delay: 300
  })

  todos.value = res
  console.log('get todos => ', todos.value)
}

const getTodosData2 = (todos) => {
  ajax<Todos[]>({
    url: '/posts',
    method: 'post',
    data: { todos }
  }, {
    getFakeData: false,
    fakeData: [
      {
        'userId': 1,
        'id': 1,
        'title': 'delectus aut autem',
        'completed': false
      },
      {
        'userId': 2,
        'id': 2,
        'title': 'quis ut nam facilis et officia qui',
        'completed': false
      }
    ],
    delay: 300
  }).then(res => {
    todos2.value = res
    console.log('post todos2 => ', todos2.value)
  })

}

onMounted(async () => {
  await getTodosData()
  getTodosData2(todos.value)
})

</script>

<template>
  <div class="page">
    api test
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