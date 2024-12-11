<script setup lang="ts">
import { ref } from 'vue'

import { FormInput, CustomIcon, CustomButton } from '@/components'
import {
  getPageSetting,
  setPageSetting,
  delPageSetting,
  clearPageSetting,
  keysPageSetting
} from '@/lib/lib_idb'
import { isEmpty, getProxyData, tipLog } from '@/lib/lib_utils'

const tableKey = 'DevelopmentTest'

const getKey = ref('')
const getValue = ref('')
const getTest = async () => {
  const idbKey = isEmpty(getKey.value) ? tableKey : getProxyData(getKey.value)
  const res = await getPageSetting(idbKey)

  getValue.value = res?.value ?? ''

  tipLog('getTest', ['getPageSetting', res])
}

const setKey = ref('')
const setValue = ref('')
const setTest = async () => {
  const idbKey = isEmpty(setKey.value) ? tableKey : getProxyData(setKey.value)
  const idbData = getProxyData({ value: setValue.value })

  const res = await setPageSetting(idbKey, idbData)

  tipLog('setTest', ['setPageSetting', res])
}

const delKey = ref('')
const delTest = async () => {
  const idbKey = isEmpty(delKey.value) ? tableKey : getProxyData(delKey.value)
  const res = await delPageSetting(idbKey)

  tipLog('delTest', ['delPageSetting', res])
}

const syncInput = (value: string) => {
  getKey.value = value
  setKey.value = value
  delKey.value = value
}

const clearTest = async () => {
  const res = await clearPageSetting()

  tipLog('clearTest', ['clearPageSetting', res])
}
const keysTest = async () => {
  const res = await keysPageSetting()

  tipLog('keysTest', ['keysPageSetting', res])
}

</script>

<template>
  <div class="flex-column i-ga-lg">
    <div class="flex-row align-center i-ga-xs">
      <FormInput
        v-model="getKey"
        placeholder="pageSetting Key"
        clearable
        style="flex: 1;"
        @change="syncInput"
      />
      <div style="flex: 1;">
        <CustomIcon v-if="isEmpty(getValue)" name="question"/>
        {{ getValue }}
      </div>

      <CustomButton
        icon-name="magnifying-glass-chart"
        label="獲取"
        type="primary"
        plain
        size="large"
        @click="getTest()"
      />
    </div>

    <div class="flex-row align-center i-ga-xs">
      <FormInput
        v-model="setKey"
        placeholder="pageSetting Key"
        clearable
        @change="syncInput"
      />
      <FormInput
        v-model="setValue"
        placeholder="pageSetting Value"
        clearable
      />
      <CustomButton
        icon-name="kitchen-set"
        label="設定"
        type="primary"
        plain
        size="large"
        @click="setTest()"
      />
    </div>

    <div class="flex-row align-center i-ga-xs">
      <FormInput
        v-model="delKey"
        placeholder="pageSetting Key"
        clearable
        style="flex: 1;"
        @change="syncInput"
      />

      <CustomButton
        icon-name="trash-can"
        label="刪除"
        type="warning"
        plain
        size="large"
        @click="delTest()"
      />
    </div>

    <div class="flex-row i-ga-xs">
      <CustomButton
        icon-name="database"
        label="刪除表"
        type="danger"
        plain
        size="large"
        @click="clearTest()"
      />
      <CustomButton
        icon-name="table-list"
        label="取得所有的key"
        type="success"
        plain
        size="large"
        @click="keysTest()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
