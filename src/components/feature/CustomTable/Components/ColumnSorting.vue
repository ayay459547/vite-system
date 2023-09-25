<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import type { PropType } from 'vue'
import type { Sort } from '@/components'
import { CustomBadge } from '@/components'
import { isEmpty } from '@/lib/lib_utils'

const props = defineProps({
  column: {
    type: Object as PropType<any>,
    required: true,
    description: '欄位的設定'
  },
  prop: {
    type: String as PropType<string>,
    required: true,
    description: '欄位的key'
  }
})

const emit = defineEmits(['change'])

const isShow = ref(false)
const sortingData = reactive<Sort>({
  key: null,
  order: null
})

const onSortClick = (type: string) => {
  console.log(type)
  switch (type) {
    case 'asc':
      if (sortingData.order === 'ascending') {
        sortingData.order = null
      } else {
        sortingData.order = 'ascending'
      }
      break
    case 'desc':
      if (sortingData.order === 'descending') {
        sortingData.order = null
      } else {
        sortingData.order = 'descending'
      }
      break
    case '':
    default:
      if (sortingData.order === 'ascending') {
        sortingData.order = 'descending'
      } else if (sortingData.order === 'descending') {
        sortingData.order = null
      } else if (sortingData.order === null) {
        sortingData.order = 'ascending'
      }
      break
  }
  emit('change', sortingData)

  console.log(sortingData.key, sortingData.order)
}

const onAscClick = () => {
  onSortClick('asc')
}
const onDescClick = () => {
  onSortClick('desc')
}

// 'ascending' | 'descending'
onMounted(() => {
  const { column, prop } = props
  sortingData.key = prop
  sortingData.order = null

  isShow.value = !(column?.isOperations ?? false)
})

</script>

<template>
  <div v-if="isShow" class="sort-wrapper" @click="onSortClick('')">
    <CustomBadge value="n" :hidden="isEmpty(sortingData.order)">
      <div class="sort-container">
        <i
          class="sort-asc"
          :class="{ 'is-active': sortingData.order === 'ascending' }"
          @click.stop="onAscClick"
        ></i>
        <i
          class="sort-desc"
          :class="{ 'is-active': sortingData.order === 'descending' }"
          @click.stop="onDescClick"
        ></i>
      </div>
    </CustomBadge>
  </div>
</template>

<style lang="scss" scoped>
.sort {
  &-wrapper {
    padding: 8px 4px 0 0;
    display: inline-block;
    cursor: pointer;
    transform: translate(0, 2px);
  }
  &-container {
    width: 24px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    vertical-align: middle;
    overflow: initial;
    position: relative;
    gap: 3px;
    transform: translate(0, -2px);
  }

  &-asc,
  &-desc {
    width: 0;
    height: 0;
    display: inline-block;
    padding-top: -2px;
    border: solid 6px transparent;
  }
  &-asc {
    border-bottom-color: #a8abb2;
    &.is-active {
      border-bottom-color: #409eff;
    }
  }
  &-desc {
    border-top-color: #a8abb2;
    &.is-active {
      border-top-color: #409eff;
    }
  }
}

</style>
