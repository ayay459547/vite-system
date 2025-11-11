<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'

import { CustomButton, CustomModal } from '@/components/feature'
import { SimpleTable } from '@/components/table'
import { useSimpleTableSetting } from '@/lib/lib_columns'
import LicensesData from '@/licenses.json'

const columnSetting = {
  indx: {
    label: '#',
    table: { width: 60 }
  },
  name: {
    label: 'Package Name',
    table: { minWidth: 300 }
  },
  publisher: {
    label: 'Publisher',
    table: { width: 200 }
  },
  licenses: {
    label: 'Licenses',
    table: { width: 180 }
  },
  repository: {
    label: 'Repository',
    table: { minWidth: 300 }
  },
  url: {
    label: 'Url',
    table: { minWidth: 200 }
  },
  email: {
    label: 'Email',
    table: { minWidth: 200 }
  }
}


const { tableColumns } = useSimpleTableSetting(columnSetting, 'table')
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
        <SimpleTable
          :table-columns="tableColumns"
          :table-data="tableData"
        >
          <template #column-licenses="{ data }">
            <strong class="text-primary">{{ data }}</strong>
          </template>
        </SimpleTable>
      </div>
    </CustomModal>

    <CustomButton
      label="Licenses"
      type="primary"
      icon-x-type="tabler"
      icon-name="License"
      text
      @click="isShowLicenses = !isShowLicenses"
    />
  </div>
</template>

<style lang="scss" scoped></style>
