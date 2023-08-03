<script setup lang="ts">
import { CustomTimeLine } from '@/components'
import { ElCard } from 'element-plus'

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
</template>

<style lang="scss" scoped>
.nav1-1-5 {
  width: 100%;
  height: 100%;
  padding: 32px;
}
</style>