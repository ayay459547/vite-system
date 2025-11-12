<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, ref } from 'vue'

import type { LogicRestriction } from '@/types/types_logicRestriction/logicRestriction'
import type { Restrictions } from '@/types/types_logicRestriction/restrictions'

import LogicRestrictionTemplate from '../../Template/LogicRestrictionTemplate.vue'
import RestrictionsTemplate from '../../Template/RestrictionsTemplate.vue'

const props = defineProps({
  type: {
    type: String as PropType<string | 'logicRestriction' | 'restrictions'>,
    default: ''
  },
  maintainRestrictionType: {
    type: String as PropType<string>,
    default: ''
  },
  logicRestriction: {
    type: Object as PropType<LogicRestriction | null>,
    default: null
  },
  restrictions: {
    type: Array as PropType<Restrictions>,
    default: () => []
  }
})

const emit = defineEmits(['remove'])

const LogicRestrictionTemplateRef = ref<InstanceType<typeof LogicRestrictionTemplate>>()
const RestrictionsTemplateRef = ref<InstanceType<typeof RestrictionsTemplate>>()

// 使用物件結構 初始化
const init = () => {
  if (props.type === 'logicRestriction' && props.logicRestriction) {
    LogicRestrictionTemplateRef.value.initUseLogicRestriction(props.logicRestriction)

  } else if (props.type === 'restrictions' && props.logicRestriction) {
    RestrictionsTemplateRef.value.initUseRestrictions(props.restrictions)
  }
}

onMounted(() => {
  init()
})

// 使用 LogicRestriction 格式的資料 初始化
const initUseLogic = (logicData: LogicRestriction | Restrictions) => {
  if (props.type === 'logicRestriction') {
    LogicRestrictionTemplateRef.value.initUseLogicRestriction(logicData as LogicRestriction)

  } else if (props.type === 'restrictions') {
    RestrictionsTemplateRef.value.initUseRestrictions(logicData as Restrictions)
  }

}
// 取得 LogicRestriction 格式的資料
const getLogicFormat = (): LogicRestriction | Restrictions => {
  if (props.type === 'logicRestriction' && props.logicRestriction) {
    return LogicRestrictionTemplateRef.value.getLogicRestrictionFormat()

  } else if (props.type === 'restrictions' && props.logicRestriction) {
    return RestrictionsTemplateRef.value.getRestrictionsFormat()
  }
}

defineExpose({
  initUseLogic,
  getLogicFormat,
  submitLogic: () => {
    if (props.type === 'logicRestriction') {
      return LogicRestrictionTemplateRef.value.submitLogicRestriction()

    } else if (props.type === 'restrictions') {
      return RestrictionsTemplateRef.value.submitRestrictions()
    }
  }
})

</script>

<template>
  <div class="fill">
    <LogicRestrictionTemplate
      ref="LogicRestrictionTemplateRef"
      v-if="props.type === 'logicRestriction'"
      :maintainRestrictionType="props.maintainRestrictionType"
      isRemove
      @remove="emit('remove')"
    >
      <slot></slot>
    </LogicRestrictionTemplate>
    <RestrictionsTemplate
      ref="RestrictionsTemplateRef"
      v-else-if="props.type === 'restrictions'"
      :maintainRestrictionType="props.maintainRestrictionType"
      isRemove
      @remove="emit('remove')"
    ></RestrictionsTemplate>
  </div>
</template>

<style lang="scss" scoped></style>
