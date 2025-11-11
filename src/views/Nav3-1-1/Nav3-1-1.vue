<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  CustomBadge,
  CustomButtonGroup,
  CustomButton,
  CustomIcon,
  CustomDivider
} from '@/components/feature' // 系統組件
import { vInfiniteScroll } from '@vueuse/components'

const count = ref(10)
const load = () => {
  console.log('load')
  count.value += 2
}

onMounted(() => {
  for (let i = 0 ;i < 10; i++) {
    load()
  }
})
</script>

<template>
  <div class="i-page flex-column i-ga-md">
    <CustomBadge
      :value="0"
      type="primary"
      :max="50"
      :badge-style="{ backgroundColor: 'red' }"
      badge-clss="text-primary"
    >
      <div class="card-info i-pa-xs">slot</div>
    </CustomBadge>

    <CustomButtonGroup type="success">
      <CustomButton label="Button1">
        <template #icon>
          <CustomIcon name="user"></CustomIcon>
        </template>
      </CustomButton>
      <CustomButton label="Button2" :icon="CustomIcon"></CustomButton>
    </CustomButtonGroup>

    <CustomDivider />

    <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
      <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
    </ul>
  </div>
</template>

<style>
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
  overflow: auto;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
