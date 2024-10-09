<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CustomIcon } from '@/components'
type Mark = {
  isActive: boolean,
  name: string
  color: string
}

const props = defineProps({
  ganttData: {
    type: Object,
    required: true
  }
  // marks: {
  //   type: Array<Mark>,
  //   required: true
  // }
})
const emit = defineEmits(['change'])

const getColorStyle = (mark:Mark) => {
  if(mark.isActive) return { 'background-color': mark.color}
  else return {}
}
const getTextClass = (mark:Mark) => {
  if(mark.isActive) return 'isActive'
  else return 'unActive'
}
const setMarkActive = (mark:Mark) => {
  mark.isActive = !mark.isActive
  // console.log(props.marks)
  emit('change')
}

</script>

<template>
  <div class="mark-container">
    <CustomIcon
      class="mark-header-icon"
      size="small"
      name="tags"
    />
    <template v-for="(item,index) in props.ganttData.marks" :key="index">
      <div class="mark-item" @click="setMarkActive(item)">
        <div class="mark-item-color" :style="getColorStyle(item)"></div>
        <div class="mark-item-text" :class="getTextClass(item)">
          <span> {{ item.name }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.mark {
  &-container {
    display: flex;
    padding: 8px;
    gap: 8px;
  }
  &-header {
    &-icon {
      display: flex;
      align-self: center;
      color: rgb(73, 73, 73)
    }
  }

  &-item {
    display: flex;
    padding: 4px;
    gap: 4px;
    cursor: pointer;

    &-color {
      width: 12px;
      height: 12px;
      margin: 2px;
      border: 1px solid lightgray;
    }
    &-text {
      align-self: center;
      text-align: center;
      font-size: 14px;
      &.isActive {
        color:black
      }
      &.unActive {
        color: gray
      }
    }
  }

}


</style>