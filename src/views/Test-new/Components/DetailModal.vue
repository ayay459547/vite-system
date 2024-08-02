<script setup lang="ts">
import { type PropType, onMounted } from 'vue'
import { swal } from '@/lib/lib_utils.ts'

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    required: false
  }
})

const openSwal = () => {
  swal({
    icon: 'success',
    title: '測試',
    showCancelButton: false
  })
}

onMounted(() => {
  console.log(props.data)

  setTimeout(() => {
    openSwal()
  }, 1000)
})
</script>

<template>
  <div class="modal">詳細資料</div>
</template>

<style lang="scss" scoped>
.modal {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
