<script setup lang="ts">
import { useSlots, ref, computed } from 'vue'
import { ElButton } from 'element-plus'

import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue' // 系統組件
import { getUuid, hasOwnProperty, isEmpty } from '@/lib/lib_utils' // 工具

import type { Emits } from './CustomButtonInfo'
import { version, props as buttonProps } from './CustomButtonInfo'

const scopedId = getUuid(version)

const props = defineProps(buttonProps)

const emit = defineEmits(['click'])
const onClick: Emits['click'] = ($event: Event) => {
  emit('click', $event)
}

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const btnHover = ref<boolean>(!props.hoverDisplay)
const setHover = (isHover: boolean) => btnHover.value = isHover
const btnContentClass = computed(() => {
  if (isEmpty(props.label) && !hasSlot('default')) return 'hidden'
  if (!props.hoverDisplay) return 'display'
  if (btnHover.value) return 'display'
  else return 'hidden'
})

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
    :native-type="props.nativeType"
    :autoInsertSpace="props.autoInsertSpace"
    :color="props.color"
    class="button button-container"
    :style="props.style"
    :class="[scopedId, `button-size-${props.size ?? 'default'}`, btnContentClass]"
    @click="onClick"
    @mouseover="setHover(true)"
    @mouseleave="setHover(false)"
  >
    <template v-if="hasSlot('icon') || (!props.loading && props.iconName.length > 0)" #icon>
      <CustomIcon
        class="icon"
        :class="`icon-${iconMove}`"
        :size="props.iconSize"
        :type="props.iconType"
        :x-type="props.iconXType"
        :name="props.iconName"
        :style="{ color: props.textColor }"
      >
        <slot name="icon"></slot>
      </CustomIcon>
    </template>
    <template v-if="hasSlot('loading')" #loading>
      <slot name="loading"></slot>
    </template>

    <template v-if="props.label.length > 0 || hasSlot('default')" #default>
      <div class="button-content" :class="btnContentClass">
        <slot>
          <span class="button-label" :style="{ color: props.textColor }">
            {{ props.label }}
          </span>
        </slot>
      </div>
    </template>
  </ElButton>
</template>

<style lang="scss" scoped>
:global(.el-button > span:not(class)){
  display: contents !important;
}

button[class*="__CustomButton"] {
  // 圖示
  .icon {
    transition-duration: 0.3s;
  }
  @mixin icon-transform($class-name, $style, $hover-style) {
    .icon-#{$class-name} {
      transform: $style;
    }
    &:hover .icon-#{$class-name} {
      transform: $hover-style;
    }
  }
  @include icon-transform(scale, scale(1.01), scale(1.25));
  @include icon-transform(rotate, rotateZ(0), rotateZ(-90deg));
  @include icon-transform(translate, translateX(0), translateX(-4px));

  &.el-button {
    width: fit-content;
    height: fit-content;

    align-items: center;
    padding: 8px 12px;

    transition-property: gap;
    transition-duration: 0.5s;
    gap: 6px;
    &.hidden {
      gap: 0px;
      transition-duration: 0.3s;
    }

    &.is-circle {
      padding: 8px;
    }

    &+.el-button {
      margin-left: 0 !important;
    }
  }

  &.button {
    @mixin button-size($btn-height, $label-size) {
      height: $btn-height;

      :slotted(.button-label) {
        font-size: $label-size;
      }
    }
    &-size-large {
      @include button-size(36px, 1em)
    }
    &-size-default {
      @include button-size(32px, 0.9em)
    }
    &-size-small {
      @include button-size(28px, 0.8em)
    }
  }
}



.button-content {
  // position: absolute;
  overflow: hidden;
  transition-property: max-width margin-left;
  transition-duration: 0.5s;
  &.display {
    max-width: 500px;
  }
  &.hidden {
    width: 0px;
    max-width: 0px;
  }
}
</style>
