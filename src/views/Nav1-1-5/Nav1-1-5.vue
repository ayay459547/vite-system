<script setup lang="ts">
import { ElCard } from 'element-plus'

import { CustomTimeLine, CustomButton } from '@/components'

const options = [
  {
    label: 'Custom icon',
    timestamp: '2018-04-12 20:46',
    size: 'large',
    type: 'primary',
    placement: 'top'
  },
  {
    label: 'Custom color',
    timestamp: '2018-04-03 20:46',
    color: '#0bbd87',
    placement: 'top'
  },
  {
    label: 'Custom size',
    timestamp: '2018-04-03 20:46',
    size: 'large',
    type: '',
    placement: 'top'
  },
  {
    label: 'Custom hollow',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    hollow: true,
    placement: 'top'
  },
  {
    label: 'Default node',
    timestamp: '2018-04-03 20:46',
    type: 'info',
    placement: 'top'
  }
]

</script>

<template>
  <div class="nav1-1-5">
    <h1 class="i-mb-md">nav1-1-5</h1>

    <div class="grid-row">
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

      <div class="grid-col-xs-24 grid-col-md-8">
        <CustomTimeLine
          :options="options"
        >
          <template #default="{ label }">
            <ElCard>
              <h3>{{ label }}</h3>
              <h4>Update Github template</h4>
              <p>Tom committed 2018/4/2 20:46</p>
            </ElCard>
          </template>
        </CustomTimeLine>
      </div>
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
