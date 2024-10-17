<script setup lang="ts">
import { useSlots } from 'vue'
import { ElTag } from 'element-plus'

import { CustomIcon } from '@/components'
import { getUuid } from '@/lib/lib_utils'

import type { Emits } from './CustomTagInfo'
import { version, props as tagProps } from './CustomTagInfo'

const scopedId = getUuid(version)

const props = defineProps(tagProps)

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
  <div
    class="tag-container"
    :class="[scopedId, `tag-size-${props.size}`]"
  >
    <ElTag
      :type="props.type"
      :hit="props.hit"
      :closable="props.closeable"
      :round="props.round"
      :color="props.color"
      :effect="props.effect"
      class="custom-tag"
      @click="onClick"
    >
      <template #default>
        <div v-if="hasSlot('default')">
          <slot></slot>
        </div>
        <div v-else-if="props.iconName.length > 0 || props.label.length > 0" class="tag-group">
          <CustomIcon
            v-if="props.iconName.length > 0"
            class="icon"
            :class="`icon-${iconMove}`"
            :size="props.size"
            :type="props.iconType"
            :name="props.iconName"
          />
          <span
            v-if="props.label.length > 0"
            class="tag-label"
            :class="`tag-label-size-${props.size}`"
          >{{ props.label }}</span>
        </div>
        <CustomIcon
          v-else
          class="icon"
          :class="`icon-${iconMove}`"
          :size="props.size"
          :type="props.iconType"
          name="bookmark"
        />
      </template>
    </ElTag>
  </div>
</template>

<style lang="scss" scoped>
:deep(.custom-tag) {
  &.el-tag {
    padding: 4px 8px !important;
    height: fit-content;
    display: inline-block;
    align-content: center;
  }
}

div[class*="__CustomTag"] :deep(.tag-container) {

  &.tag-size {
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

@mixin icon-transform($class-name, $style, $hover-style) {
  .icon-#{$class-name} {
    transform: $style;
  }
  &:hover .icon-#{$class-name} {
    transform: $hover-style;
  }
}

.tag {
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

  &-group {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  &-label-size {
    &-large {
      font-size: 1.3em;
    }
    &-default {
      font-size: 1.1em;
    }
    &-small {
      font-size: 1em;
    }
  }
}
</style>
