import { computed, onBeforeMount, ref } from 'vue'
import { defineStore } from 'pinia'

export type LayoutType = 'layout1' | 'layout2'

export const useLayoutStore = defineStore('layout', () => {
  onBeforeMount(() => {
    init()
  })

  /**
   * 初始化語言
   * 以 cookie 上的為主
   */
  const init = () => {
    const cookieLocale = localStorage.getItem('layout')

    if ([null, undefined, ''].includes(cookieLocale)) {
      localStorage.setItem('layout', 'layout1')
    }

    layout.value = localStorage.getItem('layout')
  }

  const layout = ref('layout1')

  const currentLayout = computed({
    set: (type: LayoutType) => {
      layout.value = type
      localStorage.setItem('layout', type)
    },
    get: () => {
      return layout.value
    }
  })

  const options: Array<{
    label: string
    value: LayoutType
  }> = [
    { label: '1', value: 'layout1' },
    { label: '2', value: 'layout2' }
  ]

  return {
    layout,
    currentLayout,
    options,
    mode: 'dark'
  }
})
