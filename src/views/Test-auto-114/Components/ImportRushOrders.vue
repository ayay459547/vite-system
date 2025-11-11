<script setup lang="ts">
import { ref, inject, nextTick } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { CustomUpload, CustomButton, CustomCollapse, SimpleTable, CustomEmpty } from '@/components' // 系統組件
import { downloadFile, isEmpty, getProxyData } from '@/lib/lib_utils' // 工具
import { useSimpleTableSetting } from '@/lib/lib_columns'

import { type UploadFileRes, uploadFile, updateInsertRushOrder } from './api'
import { previewColumnSetting, checkColumnSetting } from './columns'

// 插單匯入範例.xlsx
import path from '@/assets/file/ExcelToBar.xlsx?url'

const collapseActive = ref([])
const collapseOptions = [
  { label: '預覽插單結果', value: 'preview' },
  { label: '驗證結果', value: 'check' }
]

const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: 'system'
})

const isDisabled = ref(true)
const uploadRef = ref()

const onFileChange = (files: any[], targetList: File[]) => {
  if (!isEmpty(getProxyData(files)) && targetList.length > 0) {
    isDisabled.value = false
  } else {
    isDisabled.value = true
  }
}

const isLoading = ref(false)

const submitFilesData = async () => {
  if (uploadRef.value) {
    const formData = uploadRef.value.getFormData()

    if (!isEmpty(formData)) {
      isLoading.value = true

      formData.append('action', 'InsertRushOrder')

      const { status, msg, data: resData } = await uploadFile(formData)

      if (status === 'success') {
        swal({
          icon: 'success',
          title: i18nTranslate('update-success'),
          showCancelButton: false
        })
      } else {
        swal({
          icon: 'error',
          title: i18nTranslate('update-failed'),
          text: msg,
          showCancelButton: false
        })
      }

      if (!isEmpty(resData)) {
        await ininResData(resData)
      }

      collapseActive.value = ['preview', 'check']

      await nextTick()
      setTimeout(() => {
        isLoading.value = false
      }, 300)
    }
  }
}

// 預覽
const machineMap = ref(new Map<string, Array<any>>())
const { tableColumns: previewTableColumns } = useSimpleTableSetting(previewColumnSetting, 'table')

// 驗證
const lossTableData = ref([])
const conflictTableData = ref([])
const sameErpTableData = ref([])
const { tableColumns: checkTableColumns } = useSimpleTableSetting(checkColumnSetting, 'table')

// 上傳檔案後 初始化資料
const ininResData = async (resData: UploadFileRes) => {
  machineMap.value.clear()

  const {
    targetMachine,
    expectedResults,
    lossList,
    conflictList,
    sameErpList
    // finishErpList
  } = resData

  const { expectedOverrideRes = [] } = expectedResults

  // 預覽插單結果
  targetMachine.forEach(machineId => {
    machineMap.value.set(machineId, [])
  })

  expectedOverrideRes.forEach(infoItem => {
    const { machine, process, cust, erpNo, seq, memo } = infoItem

    const newInfo = {
      key: `${erpNo}-${cust}-${process}`,
      process,
      cust,
      erpNo,
      seq,
      memo
    }
    if (machineMap.value.has(machine)) {
      const oldList = machineMap.value.get(machine)
      machineMap.value.set(machine, [...oldList, newInfo])
    } else {
      machineMap.value.set(machine, [newInfo])
    }
  })

  // 未建立基本資料
  lossTableData.value = lossList.map(lossItem => {
    const { machine, process, cust, erpNo, seq, memo, note } = lossItem
    return {
      key: `${machine}-${erpNo}-${cust}-${process}`,
      machine,
      process,
      cust,
      erpNo,
      seq,
      memo,
      note,
      dataForm: 'excel提供'
    }
  })
  // 與當前插單設定衝突
  conflictTableData.value = conflictList.map(conflictItem => {
    const { machine, process, cust, erpNo, seq, memo, note } = conflictItem
    return {
      key: `${machine}-${erpNo}-${cust}-${process}`,
      machine,
      process,
      cust,
      erpNo,
      seq,
      memo,
      note,
      dataForm: 'excel提供'
    }
  })
  // 插單重複設定
  sameErpTableData.value = sameErpList.map(sameErpItem => {
    const { machine, process, cust, erpNo, seq, memo, note } = sameErpItem
    return {
      key: `${machine}-${erpNo}-${cust}-${process}`,
      machine,
      process,
      cust,
      erpNo,
      seq,
      memo,
      note,
      dataForm: 'excel提供'
    }
  })

  await nextTick()
}

defineExpose({
  submit: async () => {
    const insertRushOrderList = []
    machineMap.value.forEach((infoList, machineId) => {
      insertRushOrderList.push({
        machineId,
        rushOrders: infoList.map(infoItem => {
          const { process, erpNo, seq, memo } = infoItem
          return {
            processId: process,
            // custId: cust,
            erpNo,
            sequence: seq,
            memo
          }
        }),
        updateBy: 'importExcel_aat'
      })
    })
    console.log('insertRushOrderList => ', insertRushOrderList)
    const status = await updateInsertRushOrder(insertRushOrderList)
    return status
  }
})
</script>

<template>
  <div v-loading="isLoading" class="import-wrapper">
    <div class="import-container">
      <CustomUpload ref="uploadRef" type="excel" overwrite @file="onFileChange" />

      <div class="fill-x flex-row content-between">
        <CustomButton
          label="下載範例"
          type="info"
          plain
          size="large"
          icon-name="file-excel"
          @click="downloadFile(path, '插單匯入範例.xlsx')"
        />

        <CustomButton
          :label="i18nTranslate('upload')"
          type="success"
          icon-name="check"
          size="large"
          :disabled="isDisabled"
          @click="submitFilesData"
        />
      </div>

      <div>
        <CustomCollapse v-model="collapseActive" :options="collapseOptions">
          <template #preview>
            <div class="import-preview">
              <template v-if="machineMap.size > 0">
                <div
                  v-for="[machineId, infoList] in machineMap"
                  :key="machineId"
                  class="import-preview-machine"
                >
                  <label class="text-primary title">{{ machineId }}</label>
                  <SimpleTable :table-data="infoList" :table-columns="previewTableColumns">
                    <template #column-operations="{ rowIndex }">
                      <CustomButton
                        type="danger"
                        icon-name="trash-can"
                        text
                        @click="infoList.splice(rowIndex, 1)"
                      />
                    </template>
                  </SimpleTable>
                </div>
              </template>
              <CustomEmpty v-else />
            </div>
          </template>
          <template #check>
            <div class="import-check">
              <template
                v-if="lossTableData.length + conflictTableData.length + sameErpTableData.length > 0"
              >
                <div
                  v-for="checkItem in [
                    { key: 'lose', label: '未建立基本資料', tableData: lossTableData },
                    { key: 'conflict', label: '與當前插單設定衝突', tableData: conflictTableData },
                    { key: 'sameErp', label: '插單重複設定', tableData: sameErpTableData }
                  ]"
                  :key="checkItem.key"
                  class="import-preview-check"
                >
                  <label
                    :class="[checkItem.tableData.length > 0 ? 'text-danger' : 'text-info', 'title']"
                    >{{ checkItem.label }}</label
                  >

                  <SimpleTable
                    :table-data="checkItem.tableData"
                    :table-columns="checkTableColumns"
                  ></SimpleTable>
                </div>
              </template>
              <CustomEmpty v-else />
            </div>
          </template>
        </CustomCollapse>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.import {
  &-wrapper {
    width: 100%;
    height: 100%;
    padding: 16px;
  }
  &-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    height: fit-content;
    gap: 16px;
  }

  &-preview,
  &-check {
    width: 100%;
    min-height: 100px;
    height: fit-content;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &-machine,
    &-check {
      .title {
        font-size: 1.2em;
      }
    }
  }
}
</style>
