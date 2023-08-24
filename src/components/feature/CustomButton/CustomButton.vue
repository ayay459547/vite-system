<script setup lang="ts">
import type { PropType } from 'vue'
import { ElButton } from 'element-plus'

import type { IconType } from '@/components'
import { CustomIcon } from '@/components'

export type ButtonType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
export type ButtonSize = 'large'| 'default'| 'small'

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
    default: ''
  },
  size: {
    type: String as PropType<ButtonSize>,
    required: false,
    default: 'default'
  },
  type: {
    type: String as PropType<ButtonType>,
    required: false,
    default: 'default'
  },
  text: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  plain: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  round: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  circle: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  loading: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  color: {
    type: String as PropType<string |  undefined>,
    required: false,
    default: undefined
  },
  iconType: {
    type: String as PropType<IconType>,
    required: false,
    default: 'fas'
  },
  iconName: {
    type: String as PropType<string>,
    required: false,
    default: ''
  },
  iconMove: {
    type: String as PropType<'none' | 'translate'| 'rotate' | 'scale'>,
    required: false,
    default: 'none'
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