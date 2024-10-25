<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useLocaleStore } from '@/stores/stores_locale'
import { CustomButton, CustomButtonGroup } from '@/components' // 系統組件
import { isEmpty } from '@/lib/lib_utils' // 工具
import { formatDatetime } from '@/lib/lib_format' // 格式化

// excel
import type { ExcelColumn, Worksheet } from '@/lib/lib_files'
import { createWorkbook, downloadWorkbook } from '@/lib/lib_files'

const props = defineProps({
  i18nUsageRecord: {
    type: Object as PropType<any>
  }
})

// excel
const createHeader = (worksheet: Worksheet) => {
  const columnKeyList = ['i18nKey', 'zhTw', 'zhCn', 'en', 'i18nModule']

  return columnKeyList.reduce<Partial<ExcelColumn>[]>((res, columnKey, columnIndex) => {
    res.push({
      header: columnKey,
      key: columnKey,
      style: {
        alignment: {
          horizontal: 'left',
          vertical: 'top'
        }
      },
      width: 40
    })

    worksheet.getColumn(columnIndex + 1).alignment = {
      horizontal: 'left',
      vertical: 'top'
    }

    return res
  }, [])
}
const createRows = (worksheet: Worksheet, tableData: any[]) => {
  tableData.forEach(rowData => {
    worksheet.addRow(rowData)
  })
}

// 語言
const localeStore = useLocaleStore()
const { systemLocale } = storeToRefs(localeStore)
const changeLang = (lang?: string) => {
  if (!isEmpty(lang)) {
    localeStore.setSystemLocale(lang)
  } else {
    switch (systemLocale.value) {
      case 'zhTw':
        localeStore.setSystemLocale('zhCn')
        break
      case 'zhCn':
        localeStore.setSystemLocale('en')
        break
      case 'en':
        localeStore.setSystemLocale('zhTw')
        break
      default:
        localeStore.setSystemLocale('zhTw')
        break
    }
  }
}

const i18nTitle = '下載 i18n 使用紀錄'
const customDownloadExcel = () => {
  try {
    const workbook = createWorkbook()

    for (let routeName in props.i18nUsageRecord) {
      const worksheet = workbook.addWorksheet(routeName, {
        views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
      })

      const excelColumns = createHeader(worksheet)
      worksheet.columns = excelColumns

      const tableData = Object.values(props.i18nUsageRecord[routeName])
      createRows(worksheet, tableData)
    }

    downloadWorkbook(
      workbook,
      `${i18nTitle}_${formatDatetime(new Date(), 'YYYY-MM-DD_HHmmss')}`
    )
  } catch (e) {
    console.log(e)

    console.log(i18nTitle, props.i18nUsageRecord)
  }
}

// 以鍵盤切換語系
const onKeyup = (event: KeyboardEvent) => {
  if(event.key === '*') {
    changeLang()
    event.preventDefault()
  }
}
onMounted(() => {
  window.addEventListener('keyup', onKeyup)
})
onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup)
})

</script>

<template>
  <div>
    <div class="flex-row i-ga-md">
      <CustomButton
        icon-name="globe"
        :label="i18nTitle"
        type="primary"
        plain
        @click="customDownloadExcel"
      />

      <CustomButtonGroup type="success">
        <CustomButton
          label="繁體中文"
          plain
          @click="changeLang('zhTw')"
        />
        <CustomButton
          label="簡體中文"
          plain
          @click="changeLang('zhCn')"
        />
        <CustomButton
          label="英文"
          plain
          @click="changeLang('en')"
        />
      </CustomButtonGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
