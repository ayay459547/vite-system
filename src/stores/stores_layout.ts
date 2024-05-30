import { computed, onBeforeMount, ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * stores_colorTone
 * 色調
 */
import { useDark, useToggle } from '@vueuse/core'

/**
 * 布局
 */
export type LayoutType = 'layout1' | 'layout2'

export const useLayoutStore = defineStore('layout', () => {
  onBeforeMount(() => {
    init()
  })

  // 色調
  const isDark = useDark({
    storageKey: 'colorTone',
    valueDark: 'dark',
    valueLight: ''
  })
  const toggleDark = useToggle(isDark)

  /**
   * 初始化
   *
   * 布局以 localStorage 上的為主
   */
  const init = () => {
    initLayout()
    initLayout1()
  }

  // 切換 layout 選項
  const options: Array<{
    label: string
    value: LayoutType
  }> = [
    { label: '1', value: 'layout1' },
    { label: '2', value: 'layout2' }
  ]

  // 當前 layout
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
  const initLayout = () => {
    const layoutLocale = localStorage.getItem('layout')
    if ([null, undefined, ''].includes(layoutLocale)) {
      localStorage.setItem('layout', 'layout1')
    }
    layout.value = localStorage.getItem('layout')
  }

  // layout1 設定
  const _isNavOpen = ref('false')
  const isNavOpen = computed({
    set: (isOpen: boolean) => {
      const temp = isOpen ? 'true' : 'false'
      _isNavOpen.value = temp
      localStorage.setItem('isNavOpen', temp)
    },
    get: () => {
      return _isNavOpen.value === 'true'
    }
  })

  let timeoutId: NodeJS.Timeout | null
  const _isNavHover = ref('false')
  const isNavHover = computed({
    set: (isHover: boolean) => {
      if (timeoutId) {
        clearInterval(timeoutId)
      }
      const temp = isHover ? 'true' : 'false'
      _isNavHover.value = temp
      localStorage.setItem('isNavHover', temp)

      // hover 一段時間 自動取消
      if (isHover) {
        timeoutId = setTimeout(() => {
          _isNavHover.value = 'false'
          localStorage.setItem('isNavHover', 'false')
        }, 2500)
      }
    },
    get: () => {
      return _isNavHover.value === 'true'
    }
  })
  const initLayout1 = () => {
    const isNavOpenLocale = localStorage.getItem('isNavOpen')
    if ([null, undefined, ''].includes(isNavOpenLocale)) {
      localStorage.setItem('isNavOpen', 'false')
    }
    _isNavOpen.value = localStorage.getItem('isNavOpen')

    const isNavHoverLocale = localStorage.getItem('isNavHover')
    if ([null, undefined, ''].includes(isNavHoverLocale)) {
      localStorage.setItem('isNavHover', 'false')
    }
    _isNavHover.value = localStorage.getItem('isNavHover')
  }

  return {
    // 色調
    isDark,
    toggleDark,

    // 布局
    layout,
    currentLayout,
    options,
    mode: 'dark',

    // layout1 設定
    isNavOpen,
    isNavHover
  }
})
