<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onMounted } from 'vue'

const props = defineProps({
  label: {
    type: String as PropType<string>,
    required: false,
    default: '(文字)',
    description: '文字'
  }
})
const showLabel = ref('')
const count = ref(0)
onMounted(() => {
  showLabel.value = props.label
})

const emit = defineEmits([
  'label-click'
])
const onLabelClick = () => {
  emit('label-click', showLabel.value)
}
defineExpose({
  count,
  addCount: () => count.value++
})
</script>

<template>
  <div class="i-pa-md border-info flex-row i-ga-md" v-on:click="onLabelClick">
    <span>
      <slot name="label">{{ showLabel }}</slot>
    </span>
    <span>
      <slot :count="count">{{ count }}</slot>
    </span>
  </div>
</template>

<style lang="scss" scoped></style>
