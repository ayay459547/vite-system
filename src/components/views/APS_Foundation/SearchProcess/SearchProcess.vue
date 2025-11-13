<script setup lang="ts">
import type { PropType } from 'vue'
import { inject, onMounted, ref, nextTick, onBeforeMount, computed } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import {
  CustomButton,
  CustomEmpty,
  CustomText
} from '@/components/feature'
import { CustomInput } from '@/components/input'

// 取得站點列表
import { getProcessList } from './api'
import { scrollToEl } from '@/lib/lib_utils' // 工具

const useHook = inject('useHook') as UseHook
const { i18nTranslate, swal } = useHook({
  i18nModule: 'system'
})

const emit = defineEmits(['process'])

const setProcess = (process: string) => {
  emit('process', process)
}

type SearchType = 'no' | 'name' | ''
const props = defineProps({
  type: {
    type: String as PropType<SearchType>,
    required: true,
    description: `
      以 站點編號 或 站點名稱 進行搜尋
      no  : 站點編號
      name: 站點名稱
    `
  }
})

const isLoading = ref(false)

const str = ref('')
const noList = ref([])
const nameList = ref([])
const hoverList = ref([])
const searchSize = ref(30)

// 搜尋站點
const inputRef = ref(null)
const search = async () => {
  // isLoading.value = true
  await nextTick()

  const { status, msg, data: resList } = await getProcessList(str.value, searchSize.value, props.type)
  if (status !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }
  noList.value = resList
  nameList.value = resList
  hoverList.value = noList.value.map(() => false)
  // isLoading.value = false
}

// 搜尋更多數量(+30)的站點
const searchMore = async () => {
  searchSize.value += 30
  await search()

  setTimeout(() => {
    const el = document.querySelector('.process-more')
    if (el) {
      scrollToEl(el)
    }
  }, 30)
}

// 搜尋最少數量(30)的站點
const searchMin = () => {
  searchSize.value = 30
  search()
}

// 是否顯示 "顯示更多"按鈕
const displayMore = computed(() => {
  return searchSize.value <= noList.value.length
})

onBeforeMount(() => {
  search()
})
onMounted(async () => {
  setTimeout(() => {
    inputRef.value.focus()
  }, 100)
})
</script>

<template>
  <div v-loading="isLoading" class="search">
    <!-- 置頂搜尋框 -->
    <div class="search-input">
      <CustomInput
        ref="inputRef"
        v-model="str"
        :placeholder="i18nTranslate('search')"
        hidden-label
        direction="row"
        @input="searchMin"
      />
      <CustomButton
        icon-name="search"
        type="primary"
        @click="searchMin"
      />
    </div>

    <!-- 搜尋結果 -->
    <div v-if="props.type === 'no'" class="search-no">
      <label>{{ `${i18nTranslate('select')} ${i18nTranslate('process-no')}` }}</label>
      <div class="search-list">
        <!-- 站點列表 -->
        <CustomButton
          v-for="no in noList"
          :key="no"
          :label="no"
          type="info"
          class="process-btn"
          plain
          @click="setProcess(no)"
        >
          <CustomText :label="no"></CustomText>
        </CustomButton>
        <!-- 查無資料時顯示 -->
        <CustomEmpty v-if="noList.length === 0" :description="i18nTranslate('search-empty')" />
      </div>

      <!-- 搜尋更多資料 -->
      <CustomButton
        v-show="displayMore"
        type="primary"
        class="process-more"
        plain
        @click="searchMore"
      >
        <CustomText :label="i18nTranslate('display-more')"></CustomText>
      </CustomButton>
    </div>

    <div v-else-if="props.type === 'name'" class="search-name">
      <label>{{ `${i18nTranslate('select')} ${i18nTranslate('process-name')}` }}</label>
      <div class="search-list">
        <!-- 站點列表 -->
        <CustomButton
          v-for="name in noList"
          :key="name"
          :label="name"
          type="info"
          class="process-btn"
          plain
          @click="setProcess(name)"
        >
          <CustomText :label="name"></CustomText>
        </CustomButton>
        <!-- 查無資料時顯示 -->
        <CustomEmpty v-if="nameList.length === 0" :description="i18nTranslate('search-empty')" />
      </div>

      <!-- 搜尋更多資料 -->
      <CustomButton
        v-show="displayMore"
        type="primary"
        class="process-more"
        plain
        @click="searchMore"
      >
        <CustomText :label="i18nTranslate('display-more')"></CustomText>
      </CustomButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &-input {
    background-color: var(--el-bg-color);
    width: inherit;
    height: fit-content;
    display: flex;
    gap: 8px;
  }

  &-list {
    padding-top: 12px;
    columns: 100px;
  }
}

.process {
  &-btn {
    width: 100% !important;
    margin-bottom: 12px;
  }
  &-more {
    width: 100px !important;
    margin-bottom: 12px;
  }
}
</style>
