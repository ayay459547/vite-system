<script setup lang="ts">
import { useSlots } from 'vue'
import { ElButton } from 'element-plus'

import { CustomIcon } from '@/components'
import { getUuid } from '@/lib/lib_utils'

import { ElType, ElSize, FontIconType, version, props as buttonProps } from './CustomButtonInfo'

const scopedId = getUuid('__i-button__')

const props = defineProps(buttonProps)

const emit = defineEmits(['click'])
const onClick = ($event: Event) => {
  emit('click', $event)
}

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <div
    class="__button-container"
    :class="`CustomButton_${version} ${scopedId} size-${ElSize[props.size]}`"
  >
    <ElButton
      :type="ElType[props.type]"
      :text="props.text"
      :size="props.size"
      :plain="props.plain"
      :round="props.round"
      :circle="props.circle"
      :disabled="props.disabled"
      :color="props.color"
      :dark="props.dark"
      :loading="props.loading"
      :style="props.style"
      @click="onClick"
    >
      <template v-if="!props.loading && props.iconName.length > 0" #icon>
        <CustomIcon
          class="icon"
          :class="`icon-${iconMove}`"
          :size="ElSize[props.iconSize]"
          :type="FontIconType[props.iconType]"
          :name="props.iconName"
          :style="{ color: props.textColor }"
        />
      </template>

      <template v-if="props.label.length > 0 || hasSlot('default')" #default>
        <slot>
          <span
            class="__button-label"
            :class="`size-${ElSize[props.iconSize]}`"
            :style="{ color: props.textColor }"
          >
            {{ props.label }}
          </span>
        </slot>
      </template>
    </ElButton>
  </div>
</template>

<style lang="scss" scoped>
:deep(.__button-container) {
  .el-button {
    align-items: center;
  }
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
.__button {
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
