<script setup lang="ts">
import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { type PropType, computed, ref, reactive, onMounted, nextTick, inject } from 'vue'
// import type Node from 'element-plus/es/components/tree/src/model/node'
import { isEmpty } from '@/lib/lib_utils' // 工具
import { type Group, getGroupList } from './api'
import { FormCheckbox, FormRadio } from '@/components/input'
import { CustomTree } from '@/components/feature'

const props = defineProps({
  type: {
    type: String as PropType<'checkbox' | 'radio'>,
    default: 'checkbox'
  },
  required: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  groups: {
    type: Array as PropType<string[]>,
    default: () => {
      return []
    },
    description: 'checkbox 初始化資料'
  },
  parent: {
    type: String as PropType<string>,
    default: '',
    description: 'radio 初始化資料'
  },
  disabledList: {
    type: Array as PropType<number[]>,
    default: () => {
      return []
    },
    description: '不能選擇的 groupId'
  }
})

const useHook = inject('useHook') as UseHook
const { i18nTranslate, swal } = useHook({
  i18nModule: 'nodoc_common'
})

// 單選
const radioValue = ref('')
const getRadioValue = computed(() => (groupId: number) => {
  return `${groupId}` === radioValue.value ? `${groupId}` : ''
})
const setRadioValue = (groupId: number) => {
  radioValue.value = `${groupId}`
}
const onRadioChange = () => {
  if (isValidate.value) {
    isValidate.value = false
  }
}

// 複選
const checkMap = reactive({})
const getCheckValue = computed(() => (groupId: number) => {
  if (typeof checkMap[groupId] === 'boolean') return checkMap[groupId]
  return false
})

const setCheckValue = (value: boolean, groupId: number) => {
  checkMap[groupId] = value
}
// 子節點都要打勾
const onCheckChange = (value: boolean, data: Group) => {
  const { id, parent = {}, children = [] } = data

  if (isValidate.value) {
    isValidate.value = false
  }

  if (!isEmpty(id)) {
    setCheckValue(value, id)
  }

  // 父節點一個
  if (!isEmpty(parent) && !value) {
    onCheckChange(value, parent as Group)
  }

  // 子節點多個
  if (!isEmpty(children)) {
    children.forEach(group => {
      onCheckChange(value, group)
    })
  }
}

const treeRef = ref<InstanceType<typeof CustomTree>>()

const defaultProps = {
  children: 'children',
  label: 'fullName'
}

const groupTreeData = ref<Group[]>([])

const isLoading = ref(true)

const maxGroupId = ref(0)

// 重構成有父節點
const refactorGroup = (groupList: Group[], checkList: string[]): Group[] => {
  const res = []

  const _refactorGroup = (
    _groupList: Group[],
    parent: any | null,
    _res: any[],
    isCheck: boolean
  ): void => {
    _groupList.forEach(_groupItem => {
      const { id, fullName, description, children } = _groupItem

      if (id > maxGroupId.value) {
        maxGroupId.value = id
      }

      const _isCheck = checkList.includes(`${id}`)
      // 自身有 或是 父節點有
      checkMap[id] = _isCheck || isCheck

      const len = _res.push({
        id,
        fullName,
        description,
        children: [],
        parent
      })

      if (!isEmpty(children)) {
        _refactorGroup(
          children,
          { id, fullName, description, parent },
          _res[len - 1].children,
          _isCheck
        )
      }
    })
  }

  _refactorGroup(groupList, null, res, false)

  return res
}

const groupList = ref<Group[]>([])

// 第一次初始化 要先取得群組資料
// 第二次開始 就不用
async function* generator() {
  const { status, msg, data: resGroupList } = await getGroupList()
  if (status !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }

  groupList.value = resGroupList
  yield
}
const gen = generator()

const init = async () => {
  isLoading.value = true
  await gen.next()

  await nextTick()
  const treeData = refactorGroup(groupList.value, props.groups ?? [])
  groupTreeData.value = treeData

  radioValue.value = props.parent ?? ''

  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

onMounted(() => {
  init()
})

const isValidate = ref(false)

defineExpose({
  init,
  getRadioValue(): string {
    // parent
    return radioValue.value ?? ''
  },
  // 如果有父節點 以父節點為主
  getCheckedValue() {
    const idList = []

    const _getCheckedValue = (nodeList: Group[]) => {
      for (const nodeItem of nodeList) {
        const { id, children } = nodeItem

        if (typeof checkMap[id] === 'boolean' && checkMap[id]) {
          idList.push(`${id}`)
          continue
        }

        if (!isEmpty(children)) {
          _getCheckedValue(children)
        }
      }
    }

    _getCheckedValue(groupTreeData.value)

    if (props.required && idList.length <= 0) {
      isValidate.value = true
    }
    return idList
  },
  // 取的最大的id
  getMaxGroupId(): number {
    return maxGroupId.value
  }
})
</script>

<template>
  <div v-loading="isLoading" class="tree-wrapper">
    <label class="tree-label">
      <span v-show="props.required" class="tree-prefix text-danger">*</span>

      <span>{{ i18nTranslate('group', 'nodoc_common') }}</span>
    </label>

    <CustomTree
      ref="treeRef"
      class="tree-container"
      :data="groupTreeData"
      default-expand-all
      node-key="id"
      highlight-current
      :props="defaultProps"
    >
      <template #default="{ node, data }">
        <div class="tree-node" :class="isValidate ? 'tree-error' : ''">
          <template v-if="props.type === 'checkbox'">
            <FormCheckbox
              :disabled="props.disabledList.includes(data.id)"
              :model-value="getCheckValue(data.id)"
              @update:model-value="setCheckValue($event, data.id)"
              @change="onCheckChange($event, data)"
              @click.stop
            />
            <span>{{ node.label }}</span>
          </template>
          <template v-else-if="props.type === 'radio'">
            <FormRadio
              :disabled="props.disabledList.includes(data.id)"
              :options="[{ label: node.label, value: `${data.id}` }]"
              :model-value="getRadioValue(data.id)"
              @update:model-value="setRadioValue(data.id)"
              @change="onRadioChange"
              @click.stop
            >
              <span>{{ node.label }}</span>
            </FormRadio>
          </template>
          <span v-else>{{ node.label }}</span>
        </div>
      </template>
    </CustomTree>

    <div v-show="isValidate" class="text-danger tree-required">
      {{ i18nTranslate('required') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

$tree-danger: #f56c6c;

:deep(.tree-container) {
  .tree-error .el-checkbox__inner {
    border: 1px solid $tree-danger;
    background-color: color.adjust($tree-danger, $lightness: 20%);
  }

  span {
    font-size: 1.2em;
    font-weight: 100 !important;
  }
}

.tree {
  &-wrapper {
    width: 100%;
    height: fit-content;
    position: relative;
  }
  &-label {
    margin-bottom: 8px;
    display: block;
  }
  &-prefix {
    display: inline-block;
    position: absolute;
    left: -10px;
    top: 0;
  }

  &-node {
    display: flex;
    gap: 6px;
    align-items: center;
    cursor: pointer;

    & span {
      cursor: pointer;
    }
  }

  &-required {
    padding-top: 12px;
  }
}
</style>
