<script setup lang="ts">
import { onMounted } from 'vue'
import { ajax } from '@/lib/utils'


onMounted(() => {
  ajax({
    url: '/test',
    method: 'post',
    data: {}
  }, {
    getFakeData: true,
    fakeData: 'hello',
    status: 'success',
    delay: 300
  })
})

</script>

<template>
  <div class="page">
    api
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