<script setup lang="ts">
import type { PropType } from 'vue'

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

enum iconType {
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
    type: String as PropType<'large'| 'default'| 'small'>,
    required: false,
    default: 'default'
  },
  type: {
    type: String as PropType<'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'>,
    required: false,
    default: 'default'
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
  color: {
    type: String as PropType<string | null>,
    required: false,
    default: null
  },
  iconType: {
    type: String as PropType<'fas' | 'far' | 'fab'>,
    required: false,
    default: 'fas'
  },
  iconName: {
    type: String as PropType<string>,
    required: false,
    default: ''
  }
})

const emit = defineEmits(['click'])
const onClick = ($event: Event) => {
  emit('click', $event)
}

</script>

<template>
  <div class="button-container">
    <el-button
      :size="ElSize[props.size]"
      :type="ElType[props.type]"
      :plain="props.plain"
      :round="props.round"
      :circle="props.circle"
      :disabled="props.disabled"
      :color="props.color"
      @click="onClick"
    >
      <template v-if="props.iconName.length > 0" #icon>
        <AdvantIcon
          :type="iconType[props.iconType]"
          :name="props.iconName"
        />
      </template>
      <slot>
        <span class="button-label">{{ props.label }}</span>
      </slot>
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.button {
  &-container {
    width: fit-content;
    height: fit-content;
  }
  &-label {
    display: inline-block;
    padding-top: 2px;
  }
}
</style>