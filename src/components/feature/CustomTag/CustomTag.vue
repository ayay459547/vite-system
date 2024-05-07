<script setup lang="ts">
import { ElTag } from 'element-plus'

import { CustomIcon } from '@/components'
import { getUuid } from '@/lib/lib_utils'

import { version, ElType, ElSize, FontIconType, props as tagProps } from './CustomTagInfo'

const scopedId = getUuid('__i-tag__')

const props = defineProps(tagProps)

const emit = defineEmits(['click'])
const onClick = ($event: Event) => {
  emit('click', $event)
}
</script>

<template>
  <div
    class="__tag-container"
    :class="`CustomTag_${version} ${scopedId} size-${ElSize[props.size]}`"
  >
    <ElTag
      :type="ElType[props.type]"
      :hit="props.hit"
      :closable="props.closeable"
      :round="props.round"
      :color="props.color"
      :effect="props.effect"
      @click="onClick"
    >
      <template v-if="props.label.length > 0" #default>
        <div class="__tag-group" :class="`size-${ElSize[props.size]}`">
          <CustomIcon
            v-if="props.iconName.length > 0"
            class="icon"
            :class="`icon-${iconMove}`"
            :size="ElSize[props.size]"
            :type="FontIconType[props.iconType]"
            :name="props.iconName"
          />
          <span class="__tag-label">{{ props.label }}</span>
        </div>
      </template>
    </ElTag>
  </div>
</template>

<style lang="scss" scoped>
:deep(.__tag-container) {
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
.__tag {
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
