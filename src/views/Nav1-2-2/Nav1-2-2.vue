<script setup lang="ts">
import {
  CustomTimeLine,
  CustomTag,
  CustomDivider
} from '@/components'
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
  <div class="nav-1-2-2">
    <h1 class="i-mb-md">nav-1-2-2</h1>
    <CustomDivider />
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

    <div class="flex-column i-ga-md">
      <CustomTag label="test"/>
      <CustomTag
        label="test2"
        type="danger"
        icon-name="user"
        icon-move="translate"
      />
      <CustomTag label="test3" type="success"/>
      <CustomTag label="test4" type="info"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-1-2-2 {
  width: 100%;
  height: 100%;
  padding: 32px;

  display: flex;
  gap: 32px;
}
</style>