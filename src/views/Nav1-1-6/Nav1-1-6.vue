<script setup lang="ts">
import { CustomScrollbar, CustomButton } from '@/components'
import { useResize } from '@/lib/lib_utils'
import { ref, onMounted } from 'vue'

const resizeRef = ref()

const testSize = useResize(resizeRef)

const list = ref([1, 2, 3, 4, 5])
const add = () => {
  const newValue = list.value.length + 1
  list.value.push(newValue)
}

onMounted(() => {
  if (resizeRef.value) {
    console.log(resizeRef.value)
  }
})

</script>

<template>
  <div class="page">
    <h2>scrollbar</h2>
    <div>
      <CustomScrollbar height="400px">
        <p v-for="item in list" :key="item" class="page-demo-item">{{ item }}</p>
      </CustomScrollbar>
    </div>

    <CustomButton label="增加" @click="add"/>

    <div ref="resizeRef" class="page-resize">
      <h3>hook 計算大小變化</h3>
      <div>{{ testSize.width }}</div>
      <div>{{ testSize.height }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

  &-resize {
    flex: 1;
    height: 100%;
    border: 1px solid gray;
  }
}
</style>
