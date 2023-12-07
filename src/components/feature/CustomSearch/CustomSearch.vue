<script setup lang="ts">
import {
  CustomSwitch,
  CustomInput,
  CustomPopover,
  CustomButton,
  CustomBadge
} from '@/components'

import type { InputType, Options } from '@/components'
import { type PropType, computed, nextTick } from 'vue'
import { isEmpty, getUuid } from '@/lib/lib_utils'

import { useCustomSearchStore } from '@/stores/stores_CustomSearch'
import { storeToRefs } from 'pinia'

type ModelValue = any
const props = defineProps({
  modelValue: {
    type: [Array, String, Number, Boolean, null, undefined] as PropType<ModelValue>,
    default: false,
    description: '綁定值 v-model="..." '
  },
  active: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: `是否啟用
      是: 拿到顯示的值
      否: 拿到 null `
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    default: 300,
    description: '寬度'
  },
  search: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否只顯示搜尋按鈕'
  },
  type: {
    type: String as PropType<InputType>,
    default: 'text',
    description: '輸入框類型'
  },
  label: {
    type: String as PropType<string>,
    default: '',
    description: '文字'
  },
  options: {
    type: Array as PropType<Options>,
    default () {
      return []
    },
    description: '選項'
  },
  clearable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否顯示清除按鈕'
  },
  remote: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '選項是否來自函數'
  },
  remoteMethod: {
    type: Function as PropType<Function>,
    required: false,
    description: '函數取的選項'
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否多選'
  },
  multipleLimit: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    description: '多選限制最多幾個'
  },
  maxCollapseTags: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
    description: '多選顯示標籤數量'
  },
  filterable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可輸入文字過濾'
  },
  format: {
    type: String as PropType<string>,
    required: false,
    default: 'YYYY-MM-DD'
  },
  valueFormat: {
    type: String as PropType<string>,
    required: false,
    default: 'YYYY-MM-DD'
  },
  onlyNumber: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否只能輸入數字'
  },
  round: {
    type: [Number, null] as PropType<number | null>,
    required: false,
    default: null,
    description: `
      onlyNumber 必須為 true
      取小數點到第幾位
    `
  },
  max: {
    type: [Number, null] as PropType<number | null>,
    required: false,
    default: null,
    description: `
      onlyNumber 必須為 true
      最大值
    `
  },
  min: {
    type: [Number, null] as PropType<number | null>,
    required: false,
    default: null,
    description: `
      onlyNumber 必須為 true
      最小值
    `
  }
})

const emit = defineEmits([
  'update:modelValue',
  'update:active',
  'change',
  'blur',
  'clear',
  'open',
  'close'
])

const inpuValue = computed({
  get () {
    return props.modelValue
  },
  set (value: ModelValue) {
    emit('update:modelValue', value)
  }
})
const onInputChange = (inpuValue: ModelValue) => {
  onVisibleClick(false)
  emit('change', inpuValue)
}

const isActive = computed({
  get () {
    return props.active
  },
  set (value: boolean) {
    onVisibleClick(false)
    emit('change', inpuValue.value)
    emit('update:active', value)
  }
})

const scopedId = `__search__${getUuid()}`

const customSearchStore = useCustomSearchStore()
const { activeScopedId } = storeToRefs(customSearchStore)

const resizeEvent = () => {
  onVisibleClick(false)
}
const openListenerSize = () => {
  window.addEventListener('resize', resizeEvent, { once: true })
}

const isVisible = computed({
  get () {
    const _isVisible = scopedId === activeScopedId.value
    if (_isVisible) {
      openListenerSize()
    } else {
      window.removeEventListener('resize', resizeEvent )
    }

    return _isVisible
  },
  set (v: boolean) {
    if (v) {
      customSearchStore.setActiveScopedId(scopedId)
    } else {
      customSearchStore.clearActiveScopedId()
    }
  }
})

const onVisibleClick = (_isVisible: boolean) => {
  if (_isVisible) {
    emit('open')
  } else {
    emit('close')
  }
  isVisible.value = _isVisible
}

const isDot = computed(() => {
  return !isEmpty(inpuValue.value) && isActive.value
})

const bindAttributes = computed(() => {
  return {
    type: props.type,
    options: props.options,
    clearable: props.clearable,
    remote: props.remote,
    remoteMethod: props.remoteMethod,
    multiple: props.multiple,
    multipleLimit: props.multipleLimit,
    maxCollapseTags: props.maxCollapseTags,
    filterable: props.filterable,
    format: props.format,
    valueFormat: props.valueFormat,
    disabled: !isActive.value,
    hiddenLabel: true,
    onlyNumber: props.onlyNumber,
    round: props.round,
    max: props.max,
    min: props.min
  }
})

defineExpose({
  async validate () {
    await nextTick()
    return { valid: true }
  },
  getDom () {
    return document.querySelector(`.${scopedId}`)
  }
})

</script>

<template>
  <div class="search" :class="`${scopedId}`">
    <!-- 只顯示搜尋按鈕 -->
    <template v-if="props.search">
      <div class="search-title">
        <label>{{ props.label }}</label>

        <CustomPopover
          :visible="isVisible"
          :width="props.width"
          placement="top"
        >
          <div>
            <div class="search-title">
              <label>{{ props.label }}</label>
              <CustomSwitch v-model="isActive" />
            </div>

            <CustomInput
              v-model="inpuValue"
              v-bind="bindAttributes"
              @clear="emit('clear')"
              @blur="emit('blur')"
              @change="onInputChange"
            />
          </div>
          <template #reference>
            <div @click="onVisibleClick(!isVisible)">
              <CustomBadge v-if="isDot" is-dot>
                <CustomButton
                  icon-name="magnifying-glass"
                  circle
                  text
                />
              </CustomBadge>
              <CustomButton
                v-else
                icon-name="magnifying-glass"
                circle
                text
              />
            </div>
          </template>
        </CustomPopover>
      </div>
    </template>
    <!-- 直接全部顯示 -->
    <template v-else>
      <div class="search-title">
        <label>{{ props.label }}</label>
        <CustomSwitch v-model="isActive" />
      </div>

      <CustomInput
        v-model="inpuValue"
        v-bind="bindAttributes"
        @clear="emit('clear')"
        @blur="emit('blur')"
        @change="onInputChange"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.search {
  width: 100%;
  min-width: fit-content;
  height: fit-content;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 0 2px;
  }
}
</style>
