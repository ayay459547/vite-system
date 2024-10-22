<script setup lang="ts">
import { useSlots } from 'vue'
import { ElButton } from 'element-plus'

import { CustomIcon } from '@/components'
import { getUuid } from '@/lib/lib_utils'

import type { Emits } from './CustomButtonInfo'
import { version, props as buttonProps } from './CustomButtonInfo'

const scopedId = getUuid(version)

const props = defineProps(buttonProps)

const emit = defineEmits(['click'])
const onClick: Emits.Click = ($event: Event) => {
  emit('click', $event)
}

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <ElButton
    :size="props.size"
    :type="props.type"
    :plain="props.plain"
    :text="props.text"
    :bg="props.bg"
    :link="props.link"
    :round="props.round"
    :circle="props.circle"
    :loading="props.loading"
    :loading-icon="props.loadingIcon"
    :disabled="props.disabled"
    :icon="props.icon"
    :dark="props.dark"
    :autofocus="props.autofocus"
    :autoInsertSpace="props.autoInsertSpace"
    :color="props.color"
    class="button-container"
    :style="props.style"
    :class="[scopedId, `button-size-${props.size ?? 'default'}`]"
    @click="onClick"
  >
    <template v-if="hasSlot('icon') || (!props.loading && props.iconName.length > 0)" #icon>
      <slot name="icon">
        <CustomIcon
          class="icon"
          :class="`icon-${iconMove}`"
          :size="props.iconSize"
          :type="props.iconType"
          :x-type="props.iconXType"
          :name="props.iconName"
          :style="{ color: props.textColor }"
        />
      </slot>
    </template>
    <template v-if="hasSlot('loading')" #loading>
      <slot name="loading"></slot>
    </template>

    <template v-if="props.label.length > 0 || hasSlot('default')" #default>
      <slot>
        <span class="button-label" :class="`button-label-size-${props.iconSize}`" :style="{ color: props.textColor }">
          {{ props.label }}
        </span>
      </slot>
    </template>
  </ElButton>
</template>

<style lang="scss" scoped>
:global(button[class*="__CustomButton"].el-button) {
  align-items: center;
  line-height: inherit;
}
:global(button[class*="__CustomButton"].el-button > span) {
  display: contents
}

:global(.el-button) {
  &+.el-button {
    margin-left: 0 !important;
  }
}

@mixin icon-transform($class-name, $style, $hover-style) {
  .icon-#{$class-name} {
    transform: $style;
  }
  &:hover .icon-#{$class-name} {
    transform: $hover-style;
  }
}

button[class*="__CustomButton"] {
  &.button {
    &-container {
      width: fit-content;
      height: fit-content;

      .icon {
        transition-duration: 0.3s;
      }
      @include icon-transform(scale, scale(1.01), scale(1.25));
      @include icon-transform(rotate, rotateZ(0), rotateZ(-90deg));
      @include icon-transform(translate, translateX(0), translateX(-4px));
    }

    // 按鈕大小
    &-size-large {
      height: 36px;
      gap: 4px;
    }
    &-size-default {
      height: 32px;
      gap: 2px;
    }
    &-size-small {
      height: 28px;
      gap: 0px;
    }

    // 文字大小
    &-label {
      display: inline-block;

      &-size-large {
        font-size: 1.2em;
      }
      &-size-default {
        font-size: 1em;
      }
      &-size-small {
        font-size: 0.95em;
      }
    }
  }
}
</style>
