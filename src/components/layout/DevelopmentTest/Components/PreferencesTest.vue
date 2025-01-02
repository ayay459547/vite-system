<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, onUnmounted, inject } from 'vue'
import { storeToRefs } from 'pinia'

import { useEventBus } from '@/lib/lib_hook' // 自訂Composition API
import { useLocaleStore } from '@/stores/stores_locale'
import { useLayoutStore } from '@/stores/stores_layout'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { CustomButton, CustomButtonGroup } from '@/components' // 系統組件
import { isEmpty } from '@/lib/lib_utils' // 工具
import { formatDatetime } from '@/lib/lib_format' // 格式化
import { defaultModuleType } from '@/i18n/i18n_setting'

// excel
import type { ExcelColumn, Worksheet } from '@/lib/lib_files'
import { createWorkbook, downloadWorkbook } from '@/lib/lib_files'

const props = defineProps({
  i18nUsageRecord: {
    type: Object as PropType<any>
  }
})

const useHook = inject('useHook') as UseHook 
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
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
const i18nBus = useEventBus<string>('i18n')

const changeLang = (lang?: string) => {
  if (!isEmpty(lang)) {
    localeStore.setSystemLocale(lang)
    i18nBus.emit('langChange', lang)
  } else {
    let lang = 'zhTw'
    switch (systemLocale.value) {
      case 'zhTw':
        lang = 'zhCn'
        break
      case 'zhCn':
        lang = 'en'
        break
      case 'en':
      default:
        lang = 'zhTw'
        break
    }
    localeStore.setSystemLocale(lang)
    i18nBus.emit('langChange', lang)
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


const layoutStore = useLayoutStore()
const { isDark, layout } = storeToRefs(layoutStore)
// 色系
const colorToneBus = useEventBus<string>('colorTone')
const changeTone = (mode?: string) => {
  const colorTone = isDark.value ? 'light' : 'dark'

  if (
    (mode === 'dark' && !isDark.value) ||
    (mode === 'light' && isDark.value)
  ) {
    layoutStore.toggleDark()
    colorToneBus.emit('colorToneChange', colorTone)
  } else {
    layoutStore.toggleDark()
    colorToneBus.emit('colorToneChange', colorTone)
  }
}

// 布局
const changeLayout = (layoutType?: string) => {
  if (layoutType) {
    layoutStore.setLayout(layoutType)
  } else {
    switch (layout.value) {
      case 'layout1':
        layoutStore.setLayout('layout2')
        break
      case 'layout2':
        layoutStore.setLayout('layout3')
        break
      case 'layout3':
        layoutStore.setLayout('layout1')
        break
    }
  }
}

// 以鍵盤切換
const onKeyup = (event: KeyboardEvent) => {
  if(event.key === '*') {
    changeLang() // 語系
  } else if (event.key === '/') {
    changeTone() // 色系
  } else if (event.key === '+') {
    changeLayout() // 布局
  }
  event.preventDefault()
}
onMounted(() => {
  window.addEventListener('keyup', onKeyup)
})
onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup)
})

</script>

<template>
  <div class="flex-column i-ga-md">
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

    <div class="flex-row i-ga-md">
      <CustomButtonGroup type="warning">
        <CustomButton
          label="淺色"
          plain
          @click="changeTone('light')"
        />
        <CustomButton
          label="深色"
          plain
          @click="changeTone('dark')"
        />
      </CustomButtonGroup>
    </div>

    <div class="flex-row i-ga-md">
      <CustomButtonGroup type="info">
        <CustomButton
          v-for="layout in layoutStore.layoutOptions"
          :label="`${i18nTranslate('layout')} ${layout.label}`"
          plain
          :key="layout.value"
          @click="changeLayout(layout.value)"
        />
      </CustomButtonGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
