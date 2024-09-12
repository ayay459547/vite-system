<script setup lang="tsx">
import { inject, computed, ref, useSlots } from 'vue'

import type { UseHook } from '@/declare/hook'
import { CustomButton, CustomPopover } from '@/components'
import { isEmpty, getUuid } from '@/lib/lib_utils'
import { object_reduce } from '@/lib/lib_object'

// @ts-ignore
import styles from './SimpleFilter.module.scss'

import { version, props as simpleFilterProps } from './SimpleFilterInfo'

const props = defineProps(simpleFilterProps)
const emit = defineEmits(['reset', 'submit'])
const slots = useSlots()

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook()

const scopedId = getUuid('__i-simple-filter__')

const columnList = computed(() => {
  return object_reduce<any[]>(props.columns, (res: any[], curr: any) => {
    res.push(curr)

    return res
  }, [])
})

const getSlot = (key: string, column: Record<string, any>) => {
  if (!isEmpty(slots[`filter-${key}`])) {
    return slots[`filter-${key}`]({
      key,
      prop: key,
      label: column.label,
      column
    })
  }
  if (!isEmpty(slots['filter-all'])) {
    return slots['filter-all']({
      key,
      prop: key,
      label: column.label,
      column
    })
  }
  return null
}

const isVisible = ref(false)

defineExpose({
  setIsVisible(visible: boolean) {
    isVisible.value = visible
  }
})

const SimpleFilterTemplate = () => (
  <div class={[`SimpleFilter_${version}`, `${scopedId}`, styles['__i-simple-filter__']]}>
    <CustomPopover
      visible={isVisible.value}
      placement={props.placement}
      width={props.width}
      popper-style='padding: 0px;'
    >
      {{
        // v-slot:default
        default: () => (
          <div
            class={styles['filter-container']}
            // v-click-outside={(e: MouseEvent) => {
            //   isVisible.value = false
            //   e.stopPropagation()
            // }}
          >
            <div class={styles['filter-header']}>
              <CustomButton
                iconName='close'
                text
                onClick={(e: MouseEvent) => {
                  isVisible.value = false
                  e.stopPropagation()
                }}
              />
            </div>

            <div class={`${styles['filter-body']} ${props.class}`}>
              {columnList.value.length > 0
                ? columnList.value
                    .map(column => {
                      const { key } = column

                      return getSlot(key, column)
                    })
                    .filter(item => !isEmpty(item))
                : 'empty'}
            </div>

            <div class={styles['filter-footer']}>
              <CustomButton
                iconName='chevron-left'
                iconMove='translate'
                label={i18nTranslate('return')}
                onClick={(e: MouseEvent) => {
                  isVisible.value = false
                  e.stopPropagation()
                }}
              />
              <CustomButton
                iconName='arrow-rotate-left'
                iconMove='rotate'
                type='warning'
                label={i18nTranslate('reset')}
                onClick={(e: MouseEvent) => {
                  emit('reset')
                  e.stopPropagation()
                }}
              />
              <CustomButton
                iconName='search'
                iconMove='scale'
                type='success'
                label={i18nTranslate('search')}
                onClick={(e: MouseEvent) => {
                  // isVisible.value = false
                  emit('submit')
                  e.stopPropagation()
                }}
              />
            </div>
          </div>
        ),
        // v-slot:reference
        reference: () => (
          <CustomButton
            iconName='filter'
            type='primary'
            label={i18nTranslate('filter')}
            onClick={(e: MouseEvent) => {
              isVisible.value = !isVisible.value
              e.stopPropagation()
            }}
          />
        )
      }}
    </CustomPopover>
  </div>
)

</script>

<template>
  <SimpleFilterTemplate />
</template>
