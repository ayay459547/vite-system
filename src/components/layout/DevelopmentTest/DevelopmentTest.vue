<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, computed } from 'vue'

import { CustomTabs, CustomButton, CustomPopover } from '@/components/feature' // 系統組件: 功能
import { useDraggable, useResizeObserver } from '@/lib/lib_hook' // 自訂Composition API
import { isEmpty, hasOwnProperty, deepClone } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/declare/declare_i18n'

import ReplaceText from './Components/ReplaceText/ReplaceText.vue'
import PreferencesTest from './Components/PreferencesTest.vue'
import IndexedDBTest from './Components/IndexedDBTest.vue'
import UtilsTest from './Components/UtilsTest.vue'

const props = defineProps({
  i18nLangMap: {
    type: Object as PropType<any>
  }
})

const developmentTestRef = ref<HTMLDivElement>()
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
  get: () => {
    // 拖拉不要顯示
    return _isVisible.value && !isDragging.value
  },
  set: (v: boolean) => {
    _isVisible.value = v
  }
})

useResizeObserver(document.querySelector('body #app') as any, () => {
  const { x: initX, y: initY } = getInitPosition()
  x.value = initX
  y.value = initY
})

// 紀錄頁面 使用的翻譯
const i18nUsageRecord: Record<string, any> = {}

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
        const langInfo = deepClone({}, props.i18nLangMap[_i18nKey])

        i18nUsageRecord[routeName][_i18nKey] = {
          i18nKey: _i18nKey,
          i18nModule,
          ...langInfo
        }
      }
    })
  }
})

const tab = ref('PreferencesTest')
const tabs = [
  { label: '偏好設定', value: 'PreferencesTest' },
  { label: '文字替換', value: 'ReplaceText' },
  { label: 'iDB', value: 'IndexedDBTest' },
  { label: '其他', value: 'UtilsTest' }
]

</script>

<template>
  <div ref="developmentTestRef" class="development-btn" :style="style">
    <CustomPopover
      :visible="isVisible"
      :width="650"
      :offset="6"
      trigger="click"
      placement="top"
      popper-style="z-index: 9999;"
    >
      <div class="development-container">
        <div class="development-header">
          <b>工具</b>
          <CustomButton icon-name="xmark" text @click="isVisible = false" />
        </div>

        <div class="development-body">
          <CustomTabs v-model="tab" :options="tabs" />

          <KeepAlive>
            <Transition name="fade" mode="out-in">
              <PreferencesTest v-if="tab === 'PreferencesTest'" :i18n-usage-record="i18nUsageRecord" />
              <ReplaceText v-else-if="tab === 'ReplaceText'" />
              <IndexedDBTest v-else-if="tab === 'IndexedDBTest'" />
              <UtilsTest v-else />
            </Transition>
          </KeepAlive>
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
    border-radius: 18px;
    box-shadow: 0px 0px 6px 6px #9c9c9c;
  }
  &-container{
    width: 100%;
    height: 40vh;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
