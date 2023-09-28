<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import { CustomDrawer, CustomButton } from '@/components'
import { ref, inject, useSlots } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  columns: {
    type: Object as PropType<Record<string, any>>,
    default: () => {
      return {}
    },
    required: false
  },
  class: {
    type: String as PropType<string>,
    default: ''
  },
})

const isShow = ref(false)

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const emit = defineEmits(['reset', 'submit'])

const onResetClick = () => {
  emit('reset')
}

const onSubmitClick = () => {
  emit('submit')
  isShow.value = false
}

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

</script>

<template>
  <div class="group-search">
    <CustomButton
      :label="i18nTranslate('filter')"
      icon-name="filter"
      type='primary'
      @click="isShow = true"
    />

    <CustomDrawer v-model="isShow">
      <template #header>
        <div class="group-header">
          <label>{{ i18nTranslate('search') }}</label>
        </div>
      </template>

      <template #default>
        <div :class="props.class">
          <template v-for="(column, key) in props.columns" :key="key">
            <template v-if="hasSlot(`search-${column.key}`)">
              <slot
                :name="`search-${column.key}`"
                :label="column.label"
                :key="key"
                :prop="key"
                :column="column"
              ></slot>
            </template>
            <template v-else-if="hasSlot('search-all')">
              <slot
                name="search-all"
                :label="column.label"
                :key="key"
                :prop="key"
                :column="column"
              ></slot>
            </template>

          </template>
        </div>
      </template>

      <template #footer>
        <div class="group-footer">
          <CustomButton
            icon-name='chevron-left'
            icon-move='translate'
            :label="i18nTranslate('return')"
            @click="isShow = false"
          />
          <CustomButton
            icon-name='arrow-rotate-left'
            icon-move='rotate'
            type='warning'
            :label="i18nTranslate('reset')"
            @click="onResetClick"
          />
          <CustomButton
            icon-name='search'
            icon-move='scale'
            type='success'
            :label="i18nTranslate('search')"
            @click="onSubmitClick"
          />
        </div>
      </template>
    </CustomDrawer>
  </div>
</template>

<style lang="scss" scoped>
.group {
  &-search {
    width: fit-content;
    height: fit-content;
  }
  &-header {
    width: 100%;
  }
  &-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

</style>
