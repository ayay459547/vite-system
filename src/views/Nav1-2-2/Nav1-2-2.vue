<script setup lang="ts">
import { ElCard } from 'element-plus'

import { CustomTimeLine, CustomTag } from '@/components'

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

const options2 = [
  {
    label: 'Danger',
    timestamp: '2018-04-12 20:46',
    size: 'large',
    type: 'danger',
    placement: 'top'
  },
  {
    label: '#0bbd87',
    timestamp: '2018-04-03 20:46',
    color: '#0bbd87',
    placement: 'top'
  },
  {
    label: 'Danger',
    timestamp: '2018-04-12 20:46',
    size: 'large',
    type: 'danger',
    hollow: true,
    placement: 'top'
  },
  {
    label: 'Success',
    timestamp: '2018-04-03 20:46',
    type: 'success',
    placement: 'top'
  },
  {
    label: 'Empty',
    timestamp: '2018-04-03 20:46',
    size: 'large',
    type: '',
    placement: 'top'
  },
  {
    label: 'Primary',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    hollow: true,
    placement: 'top'
  },
  {
    label: 'Info',
    timestamp: '2018-04-03 20:46',
    type: 'info',
    placement: 'top'
  }
]

</script>

<template>
  <div class="nav-1-2-2">
    <div class="flex-row i-ga-xxl">
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

      <CustomTimeLine :options="options2">
        <template #default="{ label }">
          <ElCard>
            <h3>{{ label }}</h3>
          </ElCard>
        </template>
      </CustomTimeLine>
    </div>

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
  flex-direction: column;
  gap: 32px;
}
</style>
