<script setup lang="ts">
import { computed, ref, inject, onMounted, nextTick } from 'vue'
import type { UseHook } from '@/types/types_hook' // 全域功能類型
import CustomPopover from '@/components/feature/CustomPopover/CustomPopover.vue'
import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'
import CustomInput from '@/components/input/CustomInput/CustomInput.vue'
import CustomEmpty from '@/components/feature/CustomEmpty/CustomEmpty.vue'

import { ElPagination } from 'element-plus'
import { ElRadioGroup, ElRadio } from 'element-plus'

import type { DataOption } from '@/lib/lib_idb'
import {setDataOptions, getDataOptions } from '@/lib/lib_idb'

import { isEmpty, getUuid } from '@/lib/lib_utils' // 工具
import dayjs from 'dayjs'

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook()

const props = defineProps({
  dbKey: {
    type: String,
    required: true,
    description: 'IndexDB:DataOptions對應的key'
  },
  getCurData: {
    type: Function,
    required: true,
    description: `
      () => value
      提供給DataLoader取得現有檔案的函式
      DataLoader會在儲存時使用getCurData取得value
      將value作為option儲存在db
    `
  },
  default: {
    // required: true
  }
})

const emit = defineEmits(['load', 'save'])

const dataOptions = ref<Array<DataOption>>([])

const defaultOptionKey = ref('')
const activeOptionKey = ref('')
const getOptionByKey = (key: string) => dataOptions.value.find(option => option.key === key)
const getOptionPageByKey = (key: string) => {
  const optionIndex = dataOptions.value.findIndex(option => option.key === key)
  const page = optionIndex > 0 ? Math.ceil(optionIndex / 10) : 1
  return page
}
const getCurTime = () => dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')

const autoSave = ref(false)

const createDefault = async () => {
  const key = 'prevSearch' // getUuid()
  const date = getCurTime()
  const value = props.default ?? props.getCurData()

  await nextTick()

  const option = { key, name: i18nTranslate('filter-last'), date, value }
  dataOptions.value.push(option)
  defaultOptionKey.value = 'prevSearch'
  activeOptionKey.value = 'prevSearch'
  autoSave.value = false
  await updateDB()
}


const init = async () => {
  const resData = await getDataOptions(props.dbKey)
  // 沒有設定過的檔案
  if(isEmpty(resData)) await createDefault()
  else {
    const {
      options = [],
      defaultOptionKey: _defaultOptionKey = null,
      autoSave: _autoSave = false
    } = resData

    dataOptions.value = options
    defaultOptionKey.value = _defaultOptionKey
    activeOptionKey.value = _defaultOptionKey
    autoSave.value = _autoSave
  }

  await nextTick()
  const page = getOptionPageByKey(defaultOptionKey.value)
  updatePage(page)

  const prevSearchOption = getOptionByKey('prevSearch')
  prevSearchOption.name =  i18nTranslate('filter-last')
  const defaultOption = getOptionByKey(defaultOptionKey.value)

  setTimeout(() => {
    loadOption(defaultOption)
  }, 300)
}

onMounted(async () => {
  await init()
})


const dataName = ref('')
// Load DataOption
const loadOption = (option:DataOption) => {
  if(option.key !== 'prevSearch') dataName.value = option.name
  emit('load', option.value)
  activeOptionKey.value = option.key
}
// Remove DataOption
const removeOption = async (option:DataOption) =>  {
  if(defaultOptionKey.value === option.key) defaultOptionKey.value = 'prevSearch'
  if(activeOptionKey.value === option.key) {
    activeOptionKey.value = 'prevSearch'
    dataName.value = ''
  }

  const spliceIndex = dataOptions.value.findIndex(_option => _option.key === option.key)
  dataOptions.value.splice(spliceIndex, 1)

  await updateDB()
}
const defaultChange = async (option:DataOption) =>  {
  defaultOptionKey.value = option.key
  await updateDB()
}

// Save DataOption
const saveOption = async (inputName?: string) => {
  const name = isEmpty(inputName) ? i18nTranslate('setting', 'system') : inputName
  const sameNameOption = dataOptions.value.find(option => option.name === name)
  const key = sameNameOption ? sameNameOption.key : getUuid()
  const date = getCurTime()
  const value = props.getCurData()

  if(sameNameOption) {
    sameNameOption.value = value
    sameNameOption.date = date
  }
  else {
    const option = { key, name, date, value }
    dataOptions.value.push(option)
    activeOptionKey.value = key
  }

  await updateDB()
  dataName.value = name
  activeOptionKey.value = key
  const page = getOptionPageByKey(key)
  updatePage(page)
  emit('save')
}

const updateDB = async () => {
  const dbValue = {
    defaultOptionKey: defaultOptionKey.value,
    autoSave: autoSave.value,
    options: [...dataOptions.value]
  }

  await setDataOptions(props.dbKey, dbValue)
}

// Data Options 顯示
const pageSize = 10
const currentPage = ref<number>(1)
const optionsAmount = computed<number>(() => dataOptions.value.length)
const displayOptions = computed<Array<DataOption>>(() => {
  const startIndex = (currentPage.value - 1) * pageSize
  const endIndex = startIndex + pageSize
  const options = Array.from(dataOptions.value)
  return options.slice(startIndex, endIndex)
})
const updatePage = (newPageIndex:number) => currentPage.value = newPageIndex

// css
const poperStyle = `
  padding: 2px;
  width: 440px;
  height: fit-content;
  display: flex;
  flex-direction: column;
`
const saveBtnHover = ref(false)
const getActiveClass = option => {
  if(activeOptionKey.value === option.key) return 'active'
  return ''
}

const autoSaveExpose = async () =>  {
  const value = props.getCurData()
  const date = getCurTime()

  await nextTick()
  if(autoSave.value) {
    const activeOption = getOptionByKey(activeOptionKey.value)
    activeOption.value = value
    activeOption.date = date
  }

  const prevSearchOption =  getOptionByKey('prevSearch')
  prevSearchOption.value = value
  prevSearchOption.date = date

  await updateDB()
}

defineExpose({
  autoSave: autoSaveExpose,
  init
})

</script>

<template>
  <div class="_data-access-container">
    <CustomPopover
    :offset="5"
    placement="bottom-start"
    :popperStyle="poperStyle"
  >
    <template #default>
      <div class="loader-option-container">
        <div class="loader-header">
          <div class="loader-header-default"> {{ i18nTranslate('default') }} </div>
          <div class="loader-header-name"> {{ i18nTranslate('setting-name') }} </div>
          <div class="loader-header-date"> {{ i18nTranslate('last-updateTime') }} </div>
          <div class="loader-header-remove"> {{ i18nTranslate('delete') }} </div>
        </div>
        <div class="loader-body">
          <template v-for="option in displayOptions" :key="option.key">
            <div
              class="loader-option-item"
              :class="getActiveClass(option)"
              @click.stop="loadOption(option)"
            >
              <div class="loader-option-default" @click.stop="defaultChange(option)">
                <ElRadioGroup v-model="defaultOptionKey">
                  <ElRadio :value="option.key"/>
                </ElRadioGroup>
              </div>
              <div class="loader-option-name">
                {{ option.name }}
              </div>
              <div class="loader-option-date">
                {{ option.date }}
              </div>
              <div class="loader-option-remove" @click.stop="removeOption(option)">
                <CustomButton
                  type="danger"
                  text
                  size="small"
                  :disabled="option.key==='prevSearch'"
                  icon-name="trash"
                />
              </div>
            </div>
          </template>

          <template v-if="optionsAmount <= 0">
            <CustomEmpty/>
          </template>
        </div>
        <div class="loader-footer">
          <ElPagination  v-if="optionsAmount > 0"
            background
            layout="prev, pager, next"
            :total="optionsAmount"
            :page-size="pageSize"
            :current-page="currentPage"
            @update:current-page="updatePage"
          />
        </div>
      </div>
    </template>

    <template #reference>
      <CustomButton
        type="primary"
        :label="i18nTranslate('setting-load')"
        icon-name="folder"
      />
    </template>
    </CustomPopover>
    <div class="_data-access-save-container"
      @mouseover="saveBtnHover = true"
      @mouseleave="saveBtnHover = false"
    >
      <div class="_data-access-save-btn">
        <CustomButton
          type="success"
          :label="i18nTranslate('setting-save', 'system')"
          icon-name="save"
          @click="saveOption(dataName)"
        />
      </div>
      <div class="_data-access-save-input">
        <CustomInput
          v-model="dataName"
          :placeholder="`${i18nTranslate('setting-placeholder', 'system')}`"
          hiddenLabel
          direction="row"
          clearable
          @keyup.enter="saveOption(dataName)"
        />
      </div>
    </div>
    <div class="_data-access-auto">
      <CustomInput
        v-model="autoSave"
        :label="i18nTranslate('filter-enable-autoSave')"
        hiddenLabel
        type="checkbox"
        @change="updateDB()"
      />
    </div>
  </div>

</template>

<style lang="scss" scoped>
$loader-row-height: 32px;


._data-access {
  &-container {
    display: flex;
    flex: row;
    gap: 8px;
  }

  &-save {
    &-container {
      display: flex;
      flex: row;
    }
    &-input {
      width: 200px;
      transition-property: max-width;
      transition-duration: 1s;

      &.display {
        max-width: 400px;
      }
      &.hidden {
        max-width: 0px;
      }
    }
  }


}



.loader {
  &-option-container {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--el-border-color);
    min-height: 300px;
  }
  &-body {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: calc(10 * $loader-row-height);
  }
  &-header {
    width: 100%;
    height: $loader-row-height;
    background-color: var(--vxe-ui-table-header-background-color);
    display: flex;
    align-items: center;
    justify-content: start;
    // text-align: center;
    font-weight: bold;
    border-bottom: 1px solid var(--el-border-color);
    &-name {
      border-left: 1px solid var(--el-border-color);
      flex: 1;
      padding: 8px;
    }
    &-date {
      border-left: 1px solid var(--el-border-color);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 140px;
    }
    &-remove {
      border-left: 1px solid var(--el-border-color);
      width: 60px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &-default {
      border-left: 1px solid var(--el-border-color);
      width: 60px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  &-footer {
    display: flex;
    justify-content: center;
    height: $loader-row-height;
  }

  &-option {
    &-item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--el-border-color);
      width: 100%;
      height: $loader-row-height;

      cursor: pointer;

      transition-duration: 0.2s;
      &.active {
        background-color: var(--vxe-ui-table-row-hover-radio-checked-background-color);
      }
      &:hover {
        background-color: var(--el-color-primary-light-9);
      }

    }
    &-name {
      flex: 1;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 8px;
    }
    &-date {
      text-align: center;
      width: 140px;
    }
    &-remove {
      display: flex;
      width: 60px;
      justify-content: center;
    }
    &-default {
      display: flex;
      width: 60px;
      justify-content: center;
    }
  }
}

</style>
