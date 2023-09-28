// @ts-ignore
import type { Hook } from '@/declare/hook'
import type { PropType } from 'vue'
import { defineComponent, inject, computed, ref } from 'vue'
// @ts-ignore
import type { PopoverPlacement } from '@/components'
import { CustomButton, CustomPopover } from '@/components'
import styles from './SimpleFilter.module.scss'
import { isEmpty } from '@/lib/lib_utils'

const SimpleFilter = defineComponent({
  name: 'SimpleFilter',
  props: {
    columns: {
      type: Object as PropType<Record<string, any>>,
      default: () => {
        return {}
      },
      required: false
    },
    width: {
      type: [String, Number] as PropType<string | number>,
      default: '55vw'
    },
    class: {
      type: String as PropType<string>,
      default: ''
    },
    placement: {
      type: String as PropType<PopoverPlacement>,
      default: 'right-start'
    }
  },
  emits: ['reset', 'submit'],
  setup (props, { slots, emit, expose }) {
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
      return null
    }

    const isVisible = ref(false)

    expose({
      setIsVisible (visible: boolean) {
        isVisible.value = visible
      }
    })

    return () => (
      <div class={styles['simple-filter']}>
        <CustomPopover
          visible={isVisible.value}
          placement={props.placement}
          width={props.width}
          popper-style="padding: 0px;"
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
                  {
                    columnList.value.length > 0 ?
                    columnList.value.map(column => {
                      const { key } = column

                      return getSlot(key, column)
                    }).filter(item => !isEmpty(item)) :
                    'empty'
                  }
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
                      isVisible.value = false
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
  }
})

export default SimpleFilter
