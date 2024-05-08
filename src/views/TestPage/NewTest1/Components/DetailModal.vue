<script setup lang="ts">
import { type PropType, onMounted } from 'vue'

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    required: false
  }
})

onMounted(() => {
  console.log(props.data)
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
