<script setup lang="ts">
import { reactive, onMounted, inject, nextTick } from 'vue'

import type { UseHook } from '@/declare/hook'
import { CustomButton } from '@/components'
import { getUuid, scrollToEl } from '@/lib/lib_utils'

import MachineRushOrderList from './MachineRushOrderList.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})
const machineList = reactive([])

const onCreateClick = async () => {
  const dataId = getUuid()
  machineList.push(dataId)

  await nextTick()
  setTimeout(() => {
    const el = document.querySelector(`.machine-${dataId}`)
    scrollToEl(el)
  }, 100)
}
const onResetClick = () => {
  init()
}

const init = () => {
  machineList.splice(0)
  const dataId = getUuid()
  machineList.push(dataId)
}

const onRemove = ($event: number) => {
  machineList.splice($event, 1)
}

onMounted(() => {
  init()
})

</script>

<template>
  <div class="rush-order">
    <div class="rush-order-list">
      <div
        v-for="(dataId, dataIndex) in machineList"
        :key="dataId"
        class="rush-order-item"
        :class="`machine-${dataId}`"
      >
        <MachineRushOrderList
          :uuid="dataId"
          :index="dataIndex"
          @remove="onRemove"
        />
      </div>
    </div>

    <div class="rush-order-btn">
      <CustomButton
        :label="i18nTranslate('reset')"
        icon-name="arrow-rotate-left"
        @click="onResetClick"
      />
      <CustomButton
        :label="`${i18nTranslate('create')}${i18nTranslate('machine')}`"
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
    flex-direction: column;
    gap: 24px;
    padding: 8px 12px;
  }
  &-item {
    width: 100%;
    height: fit-content;
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
