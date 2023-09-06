import type { Hook } from '@/declare/hook'
import type { PropType } from 'vue'
import { defineComponent, inject, computed, ref } from 'vue'
import type { PopoverPlacement } from '@/components'
import { CustomButton, CustomPopover } from '@/components'
import styles from './SimpleFilter.module.scss'
import { isEmpty } from '@/lib/lib_utils'

const SimpleFilter = defineComponent({
  name: 'SimpleFilter',
  props: {
    columns: {
      type: Object as PropType<Record<string, any>>,
      required: true
    },
    placement: {
      type: String as PropType<PopoverPlacement>,
      default: 'left'
    }
  },
  emits: ['reset', 'submit'],
  setup (props, { slots, emit }) {
    const hook: Hook = inject('hook')
    const { i18nTranslate } = hook()

    const columnList = computed(() => {
      return (props.columns as any).$reduce((res, curr) => {
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
      return (
        <div>{ column.label }</div>
      )
    }

    const isVisible = ref(false)

    return () => (
      <div class={styles['simple-filter']}>
        <CustomPopover
          visible={isVisible.value}
          placement={props.placement}
          width="65vw"
          popper-style="padding: 0px;"
        >
          {{
            // v-slot:default
            default: () => (
              <div
                class={styles['filter-container']}
                v-click-outside={(e: MouseEvent) => {
                  isVisible.value = false
                  e.stopPropagation()
                }}
              >
                <div class={styles['filter-list']}>
                  {
                    columnList.value.map(column => {
                      const { key } = column

                      return (
                        <div class={`${styles['filter-item']}`}>
                          { getSlot(key, column) }
                        </div>
                      )
                    })
                  }
                </div>

                <div class={styles['filter-btn']}>
                  <CustomButton
                    iconName='close'
                    iconMove='scale'
                    label={i18nTranslate('close')}
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
                    iconName='check'
                    iconMove='scale'
                    type='success'
                    label={i18nTranslate('confirm')}
                    onClick={(e: MouseEvent) => {
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
  }
})

export default SimpleFilter
