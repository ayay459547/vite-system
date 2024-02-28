<script setup lang="ts">
import { ElCard } from 'element-plus'

import { CustomButton } from '@/components'

</script>

<template>
  <div class="nav1-1-5">
    <div class="test-card grid-col-xs-24 grid-col-md-16">
      <ElCard
        v-for="n in 5"
        :key="n"
        :body-style="{ padding: '0px' }"
      >
        <img
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image"
        />
        <div style="padding: 12px">
          <div class="flex-column i-ga-xs i-pb-md">
            <span>Yummy hamburger - {{ n }}</span>
            <time class="time">{{ `2023-08-${n}` }}</time>
          </div>
          <CustomButton
            label="Operating"
            icon-name="wheat-awn"
            text
          />
        </div>
      </ElCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav1-1-5 {
  width: 100%;
  height: 100%;
  padding: 32px;
}
.test-card {
  display: flex;
  max-width: 100%;
  width: fit-content;
  height: fit-content;
  flex-wrap: wrap;
  gap: 24px 16px;
}
</style>
