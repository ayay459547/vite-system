<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'

import { CustomButton, CustomModal } from '@/components/feature'
import { VxeTable, VxeColumn } from '@/components/table'
import LicensesData from '@/licenses.json'

const tableData = ref([])

onBeforeMount(() => {
  const __tableData__ = []
  let indx = 0
  for (const libName in LicensesData) {
    const libInfo = LicensesData[libName]
    __tableData__.push({
      ...libInfo,
      indx: indx += 1,
      name: libName
    })
  }
  tableData.value = __tableData__
})

const isShowLicenses = ref()

</script>

<template>
  <div>
    <CustomModal
      v-model="isShowLicenses"
      title="Licenses"
      width-size="large"
      height-size="large"
      hidden-footer
      click-outside
    >
      <div class="fill i-pa-md">
        <VxeTable
          :border="true"
          show-overflow
          show-header-overflow
          show-footer-overflow
          :column-config="{resizable: true}"
          :scroll-y="{enabled: true, gt: 0}"
          :data="tableData"
        >
          <VxeColumn field="indx" title="#" width="60"></VxeColumn>
          <VxeColumn field="name" title="Package Name"></VxeColumn>
          <VxeColumn field="publisher" title="Publisher"></VxeColumn>
          <VxeColumn field="licenses" title="Licenses"></VxeColumn>
          <VxeColumn field="repository" title="Repository"></VxeColumn>
          <VxeColumn field="url" title="Url"></VxeColumn>
          <VxeColumn field="email" title="Email"></VxeColumn>
        </VxeTable>
      </div>
    </CustomModal>

    <CustomButton
      label="Licenses"
      type="info"
      icon-x-type="tabler"
      icon-name="License"
      text
      @click="isShowLicenses = !isShowLicenses"
    />
  </div>
</template>

<style lang="scss" scoped></style>
