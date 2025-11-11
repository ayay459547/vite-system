<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CustomIcon, CustomCarousel } from '@/components/feature'

const isLoading = ref(true)
onMounted(() => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

const routeList = [
  { title: 'Title-1' },
  { title: 'Title-2' },
  { title: 'Title-3' },
  { title: 'Title-4' },
  { title: 'Title-5' }
]

</script>

<template>
  <div v-loading="isLoading" class="module-container">
    <div class="module-carousel">
      <CustomCarousel :items="routeList" class="border-info">
        <template #item-all="{ title }">
          <div class="module-carousel-item">
            <CustomIcon name="feather-pointed" class="home-icon" />
            <span class="home-list-text">{{ title }}</span>
          </div>
        </template>
      </CustomCarousel>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.module {
  &-container {
    width: 100%;
    height: 100%;
    padding: 16px;
  }
  &-carousel {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: hidden;

    &-item {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      width: 100%;
      height: 100%;
      padding: 16px;
      font-size: 2rem;
    }
  }
}
</style>
