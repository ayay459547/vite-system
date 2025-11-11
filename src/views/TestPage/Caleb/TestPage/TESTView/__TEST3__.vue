<script setup lang="ts">
import { ref, reactive } from 'vue'

import { CustomInput } from '@/components/input'
import { CustomButton } from '@/components/feature'
import { getUuid } from '@/lib/lib_utils'

const todoList = reactive([])

const inputValue = ref('')
const addItem = () => {
  todoList.push({
    key: getUuid(),
    value: ref(inputValue.value)
  })
}
const removeItem = (removeIndex: number) => {
  todoList.splice(removeIndex, 1)
}
</script>

<template>
  <div class="i-page flex-column i-ga-md" style="width: 1000px;">
    <ul>
      <li
        v-for="(todoItem, todoIndex) in todoList"
        :key="todoItem.key"
        class="flex-row-center content-between i-ga-md"
      >
        <div class="flex-row-center i-ga-md flex-1">
          <span>#{{ todoIndex + 1 }}</span>
          <CustomInput v-model="todoItem.value" hidden-label class="flex-1" />
          <span class="flex-1">{{ todoItem.value }}</span>
        </div>
        <CustomButton type="danger" text icon-name="trash-can" @click="removeItem(todoIndex)"/>
      </li>
    </ul>

    <div class="flex-row i-ga-md">
      <CustomInput v-model="inputValue" hidden-label @change="addItem"/>
      <CustomButton type="primary" icon-name="plus" label="新增" @click="addItem"/>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
