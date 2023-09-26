<script setup lang="ts">
import type { PropType } from 'vue'
import { ElButton } from 'element-plus'

import type { IconType } from '@/components'
import { CustomIcon } from '@/components'

export type ButtonType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
export type ButtonSize = 'large'| 'default'| 'small'
export type ButtonMove = 'none' | 'translate'| 'rotate' | 'scale'
export type ButtonIconType = 'fas' | 'far' | 'fab'

enum ElType {
  default = '',
  primary = 'primary',
  success = 'success',
  info = 'info',
  warning = 'warning',
  danger = 'danger'
}

enum ElSize {
  large = 'large',
  default = 'default',
  small = 'small'
}

enum FontIconType {
  fas = 'fas',
  far = 'far',
  fab = 'fab'
}

const props = defineProps({
  label: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '文字'
  },
  size: {
    type: String as PropType<ButtonSize>,
    required: false,
    default: 'default',
    description: '大小'
  },
  type: {
    type: String as PropType<ButtonType>,
    required: false,
    default: 'default',
    description: '類型 對應到不同顏色'
  },
  text: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '外型樣式'
  },
  plain: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '外型樣式'
  },
  round: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '外型樣式-圓角'
  },
  circle: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '外型樣式-圓形'
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '不可點擊'
  },
  loading: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '讀取中(無法點擊)'
  },
  color: {
    type: String as PropType<string |  undefined>,
    required: false,
    default: undefined,
    description: '顏色'
  },
  iconType: {
    type: String as PropType<IconType>,
    required: false,
    default: 'fas',
    description: '前綴圖示類型 參考 fontawesome'
  },
  iconName: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '前綴圖示 參考 fontawesome'
  },
  iconMove: {
    type: String as PropType<ButtonMove>,
    required: false,
    default: 'none',
    description: 'hover後 的效果'
  }
})

const emit = defineEmits(['click'])
const onClick = ($event: Event) => {
  emit('click', $event)
}

</script>

<template>
  <div class="button-wrapper">
    <div class="button-container" :class="`size-${ElSize[props.size]}`">
      <ElButton
        :type="ElType[props.type]"
        :text="props.text"
        :plain="props.plain"
        :round="props.round"
        :circle="props.circle"
        :disabled="props.disabled"
        :color="props.color"
        :loading="props.loading"
        @click="onClick"
      >
        <template v-if="!props.loading && props.iconName.length > 0" #icon>
          <CustomIcon
            class="icon"
            :class="`icon-${iconMove}`"
            :size="ElSize[props.size]"
            :type="FontIconType[props.iconType]"
            :name="props.iconName"
          />
        </template>

        <template v-if="props.label.length > 0" #default>
          <slot>
            <span
              class="button-label"
              :class="`size-${ElSize[props.size]}`"
            >
              {{ props.label }}
            </span>
          </slot>
        </template>
      </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.button-container) {
  &.size {
    &-large {
      .el-button {
        height: 36px;
        gap: 4px;
      }
    }
    &-default {
      .el-button {
        height: 32px;
        gap: 2px;
      }
    }
    &-small {
      .el-button {
        height: 28px;
        gap: 0px;
      }
    }
  }
}
.button {
  &-wrapper,
  &-container {
    width: fit-content;
    height: fit-content;

    .icon {
      transition-duration: 0.3s;
      &-scale {
        transform: scale(1.01);
      }
      &-rotate {
        transform: rotateZ(0);
      }
      &-translate {
        transform: translateX(0);
      }
    }

    &:hover {
      .icon {
        &-scale {
          transform: scale(1.25);
        }
        &-rotate {
          transform: rotateZ(-90deg);
        }
        &-translate {
          transform: translateX(-4px);
        }
      }
    }
  }

  &-label {
    display: inline-block;
    padding-top: 2px;
    transform: translateY(-1px);

    &.size-large {
      font-size: 1.3em;
    }
    &.size-default {
      font-size: 1.1em;
    }
    &.size-small {
      font-size: 1em;
    }
  }
}
</style>