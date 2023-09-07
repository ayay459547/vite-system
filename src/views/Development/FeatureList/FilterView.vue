<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onBeforeMount, computed } from 'vue'
import {
  CustomInput,
  CustomSelect,
  SimpleFilter
} from '@/components'
import { getOptions } from './api'

const props = defineProps({
  columns: {
    type: Object as PropType<any>,
    required: true
  },
  forms: {
    type: Object as PropType<any>,
    required: true
  },
  ableds: {
    type: Object as PropType<any>,
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
      width="65vw"
      class="grid-row"
      placement="left-end"
      :columns="props.columns"
      @reset="emit('reset')"
      @submit="emit('submit')"
    >
      <template #filter-all="{ prop }">
        <CustomInput
          class="grid-col-xs-24 grid-col-md-8"
          v-model="filterValue[prop]"
          v-bind="props.columns[prop]"
        />
      </template>
      <template #filter-mode="{ prop }">
        <CustomInput
          class="grid-col-xs-24 grid-col-md-8"
          v-model="filterValue[prop]"
          v-bind="props.columns[prop]"
          :options="modeOptions"
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