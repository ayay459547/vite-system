<script setup lang="ts">
import type { PropType } from 'vue'
import { ElTag } from 'element-plus'

import type { IconType } from '@/components'
import { CustomIcon } from '@/components'

export type TagType = 'default' | 'success' | 'info' | 'warning' | 'danger'
export type TagSize = 'large'| 'default'| 'small'
export type TagEffect = 'dark' | 'light' | 'plain'

enum ElType {
  default = '',
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
  type: {
    type: String as PropType<TagType>,
    required: false,
    default: 'default'
  },
  closable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  disableTransitions: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  hit: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  color: {
    type: String as PropType<string |  undefined>,
    required: false,
    default: undefined
  },
  size: {
    type: String as PropType<TagSize>,
    required: false,
    default: 'default'
  },
  effect: {
    type: String as PropType<TagEffect>,
    required: false,
    default: 'light'
  },
  round: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
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
  <div class="tag-wrapper">
    <div class="tag-container" :class="`size-${ElSize[props.size]}`">
      <ElTag
        :type="ElType[props.type]"
        :hit="props.hit"
        :closable="props.closable"
        :round="props.round"
        :color="props.color"
        :effect="props.effect"
        @click="onClick"
      >
        <template v-if="props.label.length > 0" #default>
          <div
            class="tag-group"
            :class="`size-${ElSize[props.size]}`"
          >
            <CustomIcon
              v-if="props.iconName.length > 0"
              class="icon"
              :class="`icon-${iconMove}`"
              :size="ElSize[props.size]"
              :type="FontIconType[props.iconType]"
              :name="props.iconName"
            />
            <span class="tag-label">{{ props.label }}</span>
          </div>
        </template>
      </ElTag>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.tag-container) {
  &.size {
    &-large {
      .el-tag {
        height: 36px;
        gap: 4px;
      }
    }
    &-default {
      .el-tag {
        height: 32px;
        gap: 2px;
      }
    }
    &-small {
      .el-tag {
        height: 28px;
        gap: 0px;
      }
    }
  }
}
.tag {
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

  &-group {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  &-label {
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