<script setup lang="ts">
import {
  ElRow,
  ElCol,
  ElStatistic,
  ElCalendar
} from 'element-plus'
import { ref } from 'vue'
import { CustomIcon } from '@/components'

const value = ref(new Date())

</script>

<template>
  <div class="container">
    <div>
      <ElRow>
        <ElCol :span="6">
          <ElStatistic title="Daily active users" :value="268500" />
        </ElCol>
        <ElCol :span="6">
          <ElStatistic :value="138">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Ratio of men to women
                <CustomIcon name="venus" class="i-ml-xs"/>
              </div>
            </template>
            <template #suffix>/100</template>
          </ElStatistic>
        </ElCol>
        <ElCol :span="6">
          <ElStatistic title="Total Transactions" :value="172000" />
        </ElCol>
        <ElCol :span="6">
          <ElStatistic title="Feedback number" :value="562">
            <template #suffix>
              <CustomIcon name="comments" class="i-ml-md"/>
            </template>
          </ElStatistic>
        </ElCol>
      </ElRow>
    </div>

    <div class="i-mt-md">
      <ElCalendar v-model="value" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 12px 16px;
}
.Elcol {
  text-align: center;
}
</style>
