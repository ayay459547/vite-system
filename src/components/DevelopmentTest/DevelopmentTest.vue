<script setup lang="ts">
import { PropType } from 'vue'
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useLocaleStore } from '@/stores/stores_locale'
import {
  CustomButton,
  CustomButtonGroup,
  CustomPopover,
  CustomIcon,
  FormInput
} from '@/components'
import { useDraggable, useResizeObserver } from '@/lib/lib_hook'
import { isEmpty, hasOwnProperty, deepClone } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'
import { formatDatetime } from '@/lib/lib_format'

// excel
import type { ExcelColumn, Worksheet } from '@/lib/lib_files'
import { createWorkbook, downloadWorkbook } from '@/lib/lib_files'

const props = defineProps({
  langMap: {
    type: Object as PropType<any>
  }
})

const developmentTestRef = ref<HTMLElement | null>(null)
const getInitPosition = () => {
  return {
    x: window.innerWidth - 160,
    y: window.innerHeight - 120
  }
}
const { x, y, style, isDragging } = useDraggable(developmentTestRef, {
  initialValue: getInitPosition()
})

const _isVisible = ref(false)
const isVisible = computed({
  set (v: boolean) {
    _isVisible.value = v
  },
  get () {
    // 拖拉不要顯示
    return _isVisible.value && !isDragging.value
  }
})

useResizeObserver(document.querySelector('body #app'), () => {
  const { x: initX, y: initY } = getInitPosition()
  x.value = initX
  y.value = initY
})

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

/**
 * 替換頁面文字
 * 截圖 做簡報
 */
const regExpText = ref('')
const newText = ref('')
const replaceText = () => {
  // 定義正規表達式，用來匹配需要替換的文本
  const regex = new RegExp(regExpText.value, 'g')

  // 遍歷所有文本節點
  const walker: TreeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )

  let node: Node | null = null

  node = walker.nextNode()
  while (!isEmpty(node)) {
    if (node.nodeType === Node.TEXT_NODE) {
      // 替換文本
      node.textContent = node.textContent.replace(regex, `${newText.value}`)
    }
    node = walker.nextNode()
  }
}

// 紀錄頁面 使用的翻譯
const i18nUsageRecord = {}

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

const i18nTitle = '下載 i18n 使用紀錄'
const customDownloadExcel = () => {
  try {
    const workbook = createWorkbook()

    for (let routeName in i18nUsageRecord) {
      const worksheet = workbook.addWorksheet(routeName, {
        views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
      })

      const excelColumns = createHeader(worksheet)
      worksheet.columns = excelColumns

      const tableData = Object.values(i18nUsageRecord[routeName])
      createRows(worksheet, tableData)
    }

    downloadWorkbook(
      workbook,
      `${i18nTitle}_${formatDatetime(new Date(), 'YYYY-MM-DD_HHmmss')}`
    )
  } catch (e) {
    console.log(e)

    console.log(i18nTitle, i18nUsageRecord)
  }
}

defineExpose({
  addI18nUsageRecord: (record: any) => {
    const { routeName, i18nKey, i18nModule } = record

    if (
      isEmpty(routeName) ||
      isEmpty(i18nKey) ||
      i18nModule === defaultModuleType // 非模組翻譯 不提供下載
    ) return

    if(!hasOwnProperty(i18nUsageRecord, routeName)) {
      i18nUsageRecord[routeName] = {}
    }

    const i18nKeyList = Array.isArray(i18nKey) ? i18nKey : [i18nKey]
    i18nKeyList.forEach(_i18nKey => {
      if(!hasOwnProperty(i18nUsageRecord[routeName], _i18nKey)) {
        const langInfo = deepClone({}, props.langMap[_i18nKey])

        i18nUsageRecord[routeName][_i18nKey] = {
          i18nKey: _i18nKey,
          i18nModule,
          ...langInfo
        }
      }
    })
  }
})

</script>

<template>
  <div
    ref="developmentTestRef"
    class="development-btn"
    :style="style"
  >
    <CustomPopover
      :visible="isVisible"
      :width="460"
      :offset="6"
      trigger="click"
      placement="top"
      popper-style="z-index: 9999;"
    >
      <div class="development-container">
        <div class="development-header">
          <b>工具</b>
          <CustomButton
            icon-name="xmark"
            text
            @click="isVisible = false"
          />
        </div>

        <div class="development-body">
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

          <!-- 替換文字 -->
          <div class="flex-column-center i-ga-xs i-py-md">
            <FormInput
              v-model="regExpText"
              placeholder="要替換的文字(RegExp)"
              clearable
            />
            <CustomIcon name="arrow-down"/>
            <FormInput
              v-model="newText"
              placeholder="替換後的文字"
              clearable
            />
            <CustomButton
              icon-name="language"
              label="替換"
              type="warning"
              plain
              size="large"
              style="width: 100%;"
              @click="replaceText"
            />
          </div>
        </div>
      </div>
      <template #reference>
        <CustomButton
          icon-name="screwdriver-wrench"
          label="工具"
          round
          type="primary"
          @click="isVisible = !isVisible"
        />
      </template>
    </CustomPopover>
  </div>
</template>

<style lang="scss" scoped>
.development {
  &-btn {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: fit-content;
    height: fit-content;
  }
  &-container{
    width: 100%;
    height: 30vh;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: auto;
  }
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
