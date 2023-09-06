<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onBeforeMount, computed } from 'vue'
import {
  CustomInput,
  CustomSelect,
  SimpleFilter
} from '@/components'
import type { TableData } from './api'
import { getOptions } from './api'

const props = defineProps({
  columns: {
    type: Object as PropType<Record<string, any>>,
    required: true
  },
  forms: {
    type: Object as PropType<TableData & any>,
    required: true
  },
  ableds: {
    type: Object as PropType<Record<string, boolean>>,
    required: true
  }
})

const emit = defineEmits(['reset', 'submit', 'update:forms'])

const filterValue = computed({
  get () {
    return props.forms
  },
  set (v) {
    emit('update:forms', v)
  }
})

const modeOptions = ref()

onBeforeMount(() => {
  modeOptions.value = getOptions()
})

</script>

<template>
  <div class="filter">
    <SimpleFilter
      :columns="props.columns"
      @reset="emit('reset')"
      @submit="emit('submit')"
    >
      <template #filter-status="{ prop }">
        <CustomSelect
          v-model="filterValue[prop]"
          v-bind="props.columns[prop]"
        />
      </template>
      <template #filter-mode="{ prop }">
        <CustomSelect
          v-model="filterValue[prop]"
          v-bind="props.columns[prop]"
          :options="modeOptions"
        />
      </template>
      <template #filter-all="{ prop }">
        <CustomInput
          v-model="filterValue[prop]"
          v-bind="props.columns[prop]"
        />
      </template>
    </SimpleFilter>
  </div>
</template>

<style lang="scss" scoped>
.filter {
  width: fit-content;
  height: fit-content;
}
</style>