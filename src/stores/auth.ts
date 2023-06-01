// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ref, computed, onBeforeMount } from 'vue'
import { getRoutesPermission } from './api'

export const useAuthStore = defineStore('auth', () => {
	const userId = 1
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
		return toKen.value.length > 0
	})

	const checkStatus = () => {
		return new Promise<boolean>(resolve => {
			setTimeout(() => {
				resolve(false)
			}, 1000)
		})
	}

	onBeforeMount(async () => {
		const routesPermission = await getRoutesPermission(1)

		console.log('routesPermission => ', routesPermission)
	})

  return {
		userId,
		userName,
		// Token
		toKen,
		setToken,
		getToken,
		clearToken,

		isLogin,
		checkStatus
	}
})
