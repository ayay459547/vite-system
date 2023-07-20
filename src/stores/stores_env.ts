import { computed } from 'vue'
import { defineStore } from 'pinia'

export const useEnvStore = defineStore('env', () => {
  const env = computed(() => {
    return (import.meta as any).env
  })
  const mode = computed(() => {
    return env.value.MODE
  })
  const system = computed(() => {
    return env.value.VITE_API_SYSTEM_TYPE
  })
  const version = computed(() => {
    return env.value.VITE_API_VERSION
  })
  const baseUrl = computed(() => {
    return env.value.VITE_API_BASE_URL
  })

  return {
    system,
    version,
    baseUrl,
    mode,
    env
  }
})
