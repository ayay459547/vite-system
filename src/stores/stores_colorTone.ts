/**
 * stores_colorTone
 * 色調
 */
import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'

export const useColorToneStore = defineStore('colorTone', () => {
  const isDark = useDark({
    storageKey: 'colorTone',
    valueDark: 'dark',
    valueLight: 'light'
  })
  const toggleDark = useToggle(isDark)

  return {
    isDark,
    toggleDark
  }
})
