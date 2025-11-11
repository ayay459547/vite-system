import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * stores_colorTone
 * 色調
 */
import { useDark, useToggle } from '@vueuse/core'

import { useEventBus } from '@/lib/lib_hook' // 自訂Composition API
import { setLocalStorage, getLocalStorage } from '@/lib/lib_storage'
/**
 * 布局
 */
export type LayoutType = string | 'layout1' | 'layout2' | 'layout3'

export const useLayoutStore = defineStore('Layout', () => {
  // 色調
  const colorToneBus = useEventBus<string>('colorTone')
  const isDark = useDark({
    storageKey: 'color-tone',
    valueDark: 'dark',
    valueLight: 'light'
  })
  const toggleDark = useToggle(isDark)
  const setColorTone = (colorTone: string) => {
    const __isDark__ = colorTone === 'dark'
    toggleDark(__isDark__)
    colorToneBus.emit('colorToneChange', colorTone)
  }

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
  const layout = ref<LayoutType>('layout1')
  const setLayout = (layoutType: LayoutType) => {
    layout.value = layoutType
    setLocalStorage('layout', layoutType)
  }

  /**
   * 初始化
   *
   * 布局以 localStorage 上的為主
   */
  const initLayout = () => {
    console.log('🍍 stores_layout initLayout()')
    const layoutLocale = getLocalStorage('layout')
    if ([null, undefined, ''].includes(layoutLocale)) {
      setLocalStorage('layout', 'layout1')
    }
    layout.value = getLocalStorage('layout') as LayoutType
  }
  initLayout()

  return {
    // 色調
    isDark,
    setColorTone,

    // 布局格式
    layoutOptions,
    layout,
    setLayout,
    mode: 'dark'
  }
})
