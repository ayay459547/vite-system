<script setup lang="ts">
import {
  CustomSwitch,
  CustomInput,
  CustomPopover,
  CustomButton,
  CustomBadge
} from '@/components'
import type { InputType, Options } from '@/components'
import { computed, type PropType } from 'vue'
import { isEmpty } from '@/lib/lib_utils'

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
  }
})

const emit = defineEmits([
  'update:modelValue',
  'update:active',
  'change',
  'clear'
])

const inpuValue = computed({
  get () {
    return props.modelValue
  },
  set (value: ModelValue) {
    emit('update:modelValue', value)
  }
})

const isActive = computed({
  get () {
    return props.active
  },
  set (value: boolean) {
    emit('change', inpuValue.value)
    emit('update:active', value)
  }
})

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
    hiddenLabel: true
  }
})

</script>

<template>
  <div class="search">
    <!-- 只顯示搜尋按鈕 -->
    <template v-if="props.search">
      <div class="search-title">
        <label>{{ props.label }}</label>

        <CustomPopover
          :width="250"
          trigger="hover"
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
              @change="emit('change', inpuValue)"
            />
          </div>
          <template #reference>
            <div>
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
        @change="emit('change', inpuValue)"
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
