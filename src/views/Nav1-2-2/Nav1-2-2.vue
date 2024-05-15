<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'

import { ElCard } from 'element-plus'

import { CustomTimeLine, CustomTag, CustomButton } from '@/components'

import { awaitTime, scrollToEl } from '@/lib/lib_utils'

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
    label: 'Custom hollow',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    hollow: true,
    placement: 'top'
  },
  {
    label: 'Custom hollow',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    hollow: false,
    placement: 'top'
  },
  {
    label: 'Custom hollow',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    hollow: true
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

const options1 = ref([])
const testPushOptions = async () => {
  options1.value.splice(0)
  awaitTime(1000)

  for (let i = 0; i < options.length; i++) {
    await awaitTime(300)
    console.log(i, ' => ', options[i])
    options1.value.push(options[i])

    await nextTick()
    const allCard = document.querySelectorAll('.test-card')
    const lastEl = allCard[allCard.length - 1]
    scrollToEl(lastEl, { behavior: 'auto' })
  }
}

onMounted(() => {
  testPushOptions()
})

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
      <CustomTimeLine :options="options1">
        <template #default="{ label }">
          <ElCard>
            <h3 class="test-card">{{ label }}</h3>
            <h4>Update Github template</h4>
            <p>Tom committed 2018/4/2 20:46</p>
          </ElCard>
        </template>
      </CustomTimeLine>

      <CustomButton label="再一次" @click="testPushOptions"/>

      <CustomTimeLine :options="options2">
        <template #default="{ label }">
          <ElCard>
            <h3>{{ label }}</h3>
          </ElCard>
        </template>
      </CustomTimeLine>
    </div>

    <div class="flex-column i-ga-md">
      <CustomTag label="test" />
      <CustomTag label="test2" type="danger" icon-name="user" icon-move="translate" />
      <CustomTag label="test3" type="success" />
      <CustomTag label="test4" type="info" />
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
