import { onBeforeMount, ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * stores_colorTone
 * 色調
 */
import { useDark, useToggle } from '@vueuse/core'

/**
 * 布局
 */
export type LayoutType = 'layout1' | 'layout2' | 'layout3'

export const useLayoutStore = defineStore('layout', () => {
  onBeforeMount(() => {
    init()
  })

  // 色調
  const isDark = useDark({
    storageKey: 'color-tone',
    valueDark: 'dark',
    valueLight: 'light'
  })
  const toggleDark = useToggle(isDark)


  // 切換 layout 選項
  const layoutOptions: Array<{
    label: string
    value: LayoutType
  }> = [
    { label: '1', value: 'layout1' },
    { label: '2', value: 'layout2' },
    { label: '3', value: 'layout3' }
  ]
  // 當前 layout
  const layout = ref('layout1')
  const setLayout = (layoutType: LayoutType | string) => {
    layout.value = layoutType
    localStorage.setItem('layout', layoutType)
  }

  /**
   * 初始化
   *
   * 布局以 localStorage 上的為主
   */
  const init = () => {
    const layoutLocale = localStorage.getItem('layout')
    if ([null, undefined, ''].includes(layoutLocale)) {
      localStorage.setItem('layout', 'layout1')
    }
    layout.value = localStorage.getItem('layout')
  }

  return {
    // 色調
    isDark,
    toggleDark,

    // 布局格式
    layoutOptions,
    layout,
    setLayout,
    mode: 'dark'
  }
})
