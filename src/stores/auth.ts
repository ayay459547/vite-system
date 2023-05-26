// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
	const userName = 'USER'

	const toKen = ref<string>('')

	const setToken = (token: string) => {
		toKen.value = token
		localStorage.setItem('token', token)
	}
	const getToken = () => {
		return localStorage.getItem('token')
	}
	const clearToken = () => {
		toKen.value = ''
		localStorage.removeItem('token')
	}

	const isLogin = computed(() => {
		return toKen.value
	})

	const checkStatus = () => {
		return new Promise<boolean>(resolve => {
			setTimeout(() => {
				resolve(false)
			}, 1000)
		})
	}

	// 權限
  const permission = {
		execute: 1 << 0,
		add: 1 << 1,
		update: 1 << 2,
		delete: 1 << 3
	}

  return {
		userName,
		// Token
		toKen,
		setToken,
		getToken,
		clearToken,

		isLogin,
		checkStatus,

		// 權限相關
		permission
	}
})
