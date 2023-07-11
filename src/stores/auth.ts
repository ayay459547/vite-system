// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ref, computed, onBeforeMount, reactive } from 'vue'
import type { AuthData } from './api'
import { getUserData, getRoutesPermission } from './api'
import { permission } from '@/lib/permission'

import { getRouterLeafLayer } from '@/lib/routes'
import routes from '@/router/routes'

import { setCookie, getCookie, removeCookie } from '@/lib/cookie'

// token
import { v4 as uuidv4 } from 'uuid'
import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'

interface Token {
	uid: string
	date: Date
	userId: number
}
const privateKey = (import.meta as any).env.VITE_API_PRIVATE_KEY

export const useAuthStore = defineStore('auth', () => {
	/**
	 * token 相關
	 * token 會帶動使用者資料
	 */
	const getToken = (): Token | null => {
		const token = getCookie('token')
		if (['', null, undefined].includes(token)) return null

		const _token = AES.decrypt(token, privateKey).toString(Utf8)
		return JSON.parse(_token) as Token
	}
	const setToken = (userId: number) => {
		const _token = JSON.stringify({
			uid: uuidv4(),
			date: new Date(),
			userId
		})

		setCookie(
			'token',
			AES.encrypt(_token, privateKey).toString()
		)
	}
	const clearToken = () => {
		removeCookie('token')
	}

	// 登入狀態 看使用者資料
	const isLogin = computed(() => {
		return authData.value.id > 0
	})

	/**
	 * 使用者資料相關
	 * 使用者資料會帶動權限
	 */
	const authData = ref<AuthData>({
		id: null,
		name: null
	})
	const setAuthData = (auth: AuthData) => {
		authData.value = auth
	}
	const clearAuthData = () => {
		authData.value = {
			id: null,
			name: null
		}
	}

	/**
	 * 確認狀態 目前是前端做
	 * 有可能串後端 api
	 */
	const checkAuthStatus = async (): Promise<number> => {
		return await new Promise((resolve) => {
			const token = getToken()

			if (token !== null) {
				const { userId } = token
				setToken(userId)

				setTimeout(() => {
					resolve(userId)
				}, 1000)
			} else {
				clearToken()
				clearAuthData()
				clearRoutesPermission()

				setTimeout(() => {
					resolve(0)
				}, 1000)
			}
		})
	}

	/**
	 * 使用 token 初始化使用者資料
	 */
	const initUserData = async (userId: number) => {
		const { data: userData } = await getUserData(userId)
		setAuthData(userData)
	}

	/**
	 * 使用者 id 取的資料
	 * 路由權限
	 * key(string): permissions(number)
	 */
	const routesPermission = reactive(new Map())

	const initRoutesPermission = async (userId: number) => {
		routesPermission.clear()

		const { data: permissionList } = await getRoutesPermission(userId)

		permissionList.forEach(permissionItem => {
			/**
       * 依據 api 取得的路由權限
       * 設定 權限的總和
       */
			let _permission = 0
			if (permissionItem.readPermissions) {
				_permission += permission.read
			}
			if (permissionItem.createPermissions) {
				_permission += permission.create
			}
			if (permissionItem.updatePermissions) {
				_permission += permission.update
			}
			if (permissionItem.deletePermissions) {
				_permission += permission.delete
			}
			if (permissionItem.executePermissions) {
				_permission += permission.execute
			}
			routesPermission.set(permissionItem.routerName, _permission)
		})
	}
	// 將所有路由權限變為 0
	const clearRoutesPermission = () => {
		const permissionList = getRouterLeafLayer(routes, [1, 2, 3], false)

		permissionList.forEach(permissionItem => {
			routesPermission.set(permissionItem.name, 0)
		})
	}

	const isFinishInit = ref(false)
	/**
	 * 初始化系統使用者
	 * 初始化系統路由權限
	 */
	const initSystem = async () => {
		isFinishInit.value = false

		const userId = await checkAuthStatus()
		if (userId > 0) {
			await initUserData(userId)
			await initRoutesPermission(userId)
		}

		isFinishInit.value = true
	}

	onBeforeMount(() => {
		initSystem()
	})

  return {
		getToken,
		setToken,
		clearToken,
		isLogin,

		authData,
		routesPermission,
		initSystem,
		isFinishInit
	}
})
