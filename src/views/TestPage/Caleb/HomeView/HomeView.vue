<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CustomButton } from '@/components/feature'

import HomeDashboard from './HomeDashboard/HomeDashboard.vue'
import HomeMap from './HomeMap/HomeMap.vue'
import HomeModule from './HomeModule/HomeModule.vue'

const isLoading = ref(true)
onMounted(() => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

const viewType = ref('HomeMap')

</script>

<template>
  <div v-loading="isLoading" class="home-container">
    <KeepAlive>
      <HomeMap v-if="viewType === 'HomeMap'" />
      <HomeDashboard v-else-if="viewType === 'HomeDashboard'" />
      <HomeModule v-else-if="viewType === 'HomeModule'" />
    </KeepAlive>

    <div class="home-btn">
      <CustomButton
        icon-x-type="tabler"
        icon-name="Sitemap"
        size="large"
        @click="viewType = 'HomeMap'"
      />
      <CustomButton
        icon-x-type="antd"
        icon-name="DashboardOutlined"
        size="large"
        @click="viewType = 'HomeDashboard'"
      />
      <CustomButton
        icon-x-type="tabler"
        icon-name="Bulb"
        size="large"
        @click="viewType = 'HomeModule'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  &-container {
    width: 100%;
    height: 100%;
    background-color: var(--i-color-system-bg);
    position: relative;
    overflow: hidden;
  }

  &-btn {
    bottom: 8px;
    left: 8px;
    position: absolute;
    display: flex;
    gap: 8px;
  }
}
</style>
