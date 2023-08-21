<script setup lang="ts">
import { inject, ref } from 'vue'
import type { Hook } from '@/declare/hook'
import ExcelJs from 'exceljs'
import type { IconType, ButtonSize, TooltipTrigger } from '@/components'
import { getTableSetting } from '@/lib/lib_columns'
import {
  CustomButton,
  CustomModal,
  CustomIcon,
  CustomCheckbox,
  CustomPopover,
  CustomTable,
  CustomTooltip
} from '@/components'
import { downloadStaticFile } from '@/lib/lib_utils'

const hook: Hook = inject('hook')
const { loading } = hook()

function onClick () {
  const workbook = new ExcelJs.Workbook() // 創建試算表檔案
  const sheet = workbook.addWorksheet('工作表範例1') //在檔案中新增工作表 參數放自訂名稱

  sheet.addTable({ // 在工作表裡面指定位置、格式並用columsn與rows屬性填寫內容
    name: 'table名稱',  // 表格內看不到的，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
    ref: 'A1', // 從A1開始
    columns: [{name: '名字'}, {name: '年齡'}, {name: '電話'}],
    rows: [
      ['小明', '20', '0987654321'],
      ['小美', '23', '0912345678'],
      ['小華', '21', '0912345674'],
      ['小綠', '52', '0912345672']
    ]
  })

  // 表格裡面的資料都填寫完成之後，訂出下載的callback function
  // 異步的等待他處理完之後，創建url與連結，觸發下載
  workbook.xlsx.writeBuffer().then((content) => {
  const link = document.createElement('a')
    const blobData = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    })
    link.download = '測試的試算表.xlsx'
    link.href = URL.createObjectURL(blobData)
    link.click()
  })
}

function changeLoading () {
  loading(true, 'loader-test')

  setTimeout(() => {
    loading(false)
  }, 3000)
}

const testIcon: [IconType, string] = ['fas', 'check']
const testType: IconType = 'far'
const testName = 'folder-open'

const size: ButtonSize = 'large'

const modalShow = ref<boolean>(false)

const openModal = () => {
  modalShow.value = true
}
const onModalCancel = () => {
  console.log('取消')
}
const onModalSubmit = () => {
  console.log('確認')
}

const ischeck = ref(false)

const testCheck = (v: boolean) => {
  console.log('test checkbox', v)
}

const columnSetting = {
  date: {
    label: '生日',
    table: {
      width: 150,
      align: 'center'
    }
  },
  name: {
    label: '姓名',
    table: {
      width: 150
    }
  },
  address: {
    label: '地址',
    table: {
      minWidth: 300
    }
  }
}

const tableOptions = {
  title: '測試表單',
  version: '1.0.0',
  settingKey: 'test'
}
const { tableSetting, downloadExcel } = getTableSetting(columnSetting, 'table', tableOptions)

const download = () => {
  downloadExcel(tableData2)
}

const tableData2 = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Caleb',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Peter',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Amy',
    address: 'No. 189, Grove St, Los Angeles'
  }
]

const downloadWord = () => {
  downloadStaticFile('下載word測試.docx')
}

const tooltipPlacement: TooltipTrigger = 'click'
</script>

<template>
  <div class="excel">
    <div class="flex-row i-ga-xxl">
      <CustomButton
        label="ButtonLabel"
        :size="size"
        @click="onClick"
      />
      <CustomButton label="loading-test" type="warning" @click="changeLoading"/>

      <CustomButton label="OpenModal" @click="openModal"/>

      <CustomButton label="下載word" @click="downloadWord"/>

      <CustomModal
        v-model="modalShow"
        title="ModalTitle"
        click-outside
        @cancel="onModalCancel"
        @submit="onModalSubmit"
      >
        <div class="i-pa-xl">
          test-modal
        </div>
      </CustomModal>
    </div>

    <div class="flex-row i-ga-xxl">
      <CustomIcon :icon="['far', 'user']"/>
      <CustomIcon :icon="testIcon"/>

      <CustomIcon type="fas" name="user"/>
      <CustomIcon :type="testType" :name="testName"/>
    </div>

    <div class="flex-row i-ga-xxl">
      <CustomCheckbox
        label="是否確認"
        v-model="ischeck"
        @change="testCheck"
      />

      <CustomPopover>
        <div>Popover 內容1</div>
        <template #reference>
          <CustomButton label="滑鼠點擊 Popover" type="danger"/>
        </template>
      </CustomPopover>

      <CustomPopover
        :width="300"
        title="內容2標題"
        trigger="hover"
        placement="right"
      >
        <div>Popover 內容2</div>
        <template #reference>
          <CustomButton label="滑鼠移入 Popover"/>
        </template>
      </CustomPopover>

      <CustomTooltip>
        <CustomButton label="滑鼠移入 Tooltip" type="primary"/>
        <template #content>
          <div>Tooltip 內容1</div>
        </template>
      </CustomTooltip>

      <CustomTooltip :trigger="tooltipPlacement">
        <CustomButton label="滑鼠點擊 Tooltip" type="success"/>
        <template #content>
          <div>Tooltip 內容2</div>
        </template>
      </CustomTooltip>
    </div>

    <div style="width: 800px; height: 400px;">
      <CustomTable
        :table-data="tableData2"
        v-bind="tableSetting"
        @excel="download"
      >
        <template #header-all="{ column }">{{ column.label }}</template>
      </CustomTable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.excel {
  width: 100%;
  height: fit-content;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>