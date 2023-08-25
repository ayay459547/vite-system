import { computed } from 'vue'
import { defineStore } from 'pinia'

export const useEnvStore = defineStore('env', () => {
  const env = computed(() => {
    return (import.meta as any).env
  })

  return {
    env,
    mode: env.value.MODE,
    system: env.value.VITE_API_SYSTEM_TYPE,
    version: env.value.VITE_API_VERSION,
    baseUrl: env.value.VITE_API_BASE_URL
  }
})
