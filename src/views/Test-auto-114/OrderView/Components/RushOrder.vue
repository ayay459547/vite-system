<script setup lang="ts">
import { reactive, onMounted, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import { CustomButton } from '@/components'
import { getUuid } from '@/lib/lib_utils'

import MachineRushOrderList from './MachineRushOrderList.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})
const machineList = reactive([])

const onCreateClick = () => {
  const dataId = getUuid()
  machineList.push(dataId)
}
const onResetClick = () => {
  init()
}

const init = () => {
  machineList.splice(0)
  const dataId = getUuid()
  machineList.push(dataId)
}

onMounted(() => {
  init()
})

</script>

<template>
  <div class="rush-order">
    <div class="rush-order-list">

      <div
        v-for="machineItem in machineList"
        :key="machineItem"
        class="rush-order-item"
      >
        <MachineRushOrderList />
      </div>
    </div>

    <div class="rush-order-btn">
      <CustomButton
        :label="i18nTranslate('reset')"
        icon-name="arrow-rotate-left"
        @click="onResetClick"
      />
      <CustomButton
        :label="i18nTranslate('create')"
        type="primary"
        icon-name="plus"
        @click="onCreateClick"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rush-order {
  width: 100%;
  height: 100%;
  padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &-list {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  &-item {
    width: 100%;
    height: 500px;
  }

  &-btn {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}
</style>
