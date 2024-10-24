<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { ElDescriptions, ElDescriptionsItem, ElTag, ElSteps, ElStep } from 'element-plus'

import { isEmpty } from '@/lib/lib_utils' // 工具

import { getData } from './api'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const userData = ref()

const isLoading = ref(false)

const init = async (userId: number) => {
  isLoading.value = true

  const resData = await getData(userId)

  userData.value = resData

  isLoading.value = false
}

const address = computed(() => {
  if (isEmpty(userData.value)) return ''
  const { street = '', suite = '', city = '', zipcode = '' } = userData.value?.address ?? {}

  return `${street} ${suite} ${city} ${zipcode}`
})

onMounted(() => {
  const { userId = 0 } = props?.data ?? {}

  init(userId)
})
</script>

<template>
  <div v-loading="isLoading" class="detal flex-column i-ga-lg">
    <ElDescriptions title="User Information" direction="vertical" :column="4" border>
      <ElDescriptionsItem label="Username">{{ userData?.name ?? '' }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Telephone">{{ userData?.phone ?? '' }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Email" :span="2">{{ userData?.email ?? '' }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Website">
        <ElTag size="small">{{ userData?.website ?? '' }}</ElTag>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Address">{{ address }}</ElDescriptionsItem>
    </ElDescriptions>

    <div>
      <label>Steps-Test</label>
      <ElSteps :space="200" :active="1" finish-status="success" class="i-mt-sm">
        <ElStep title="Done" />
        <ElStep title="Processing" />
        <ElStep title="Step 3" />
      </ElSteps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detal {
  width: 100%;
  height: fit-content;
  padding: 16px;
}
</style>
../columns
