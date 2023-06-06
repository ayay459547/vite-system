// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ref, computed, onBeforeMount, reactive } from 'vue'
import type { AuthData } from './api'
import { getUserData, getRoutesPermission } from './api'
import { permission } from '@/lib/permission'

// token
import { v4 as uuidv4 } from 'uuid'


export const useAuthStore = defineStore('auth', () => {
	/**
	 * token 相關
	 * token 會帶動使用者資料
	 */
	const getToken = () => {
		const token = localStorage.getItem('token')
		if (token) {
			return JSON.parse(token)
		} else {
			return null
		}
	}
	const setToken = (userId: number) => {
		const _token = {
			uid: uuidv4(),
			today: new Date(),
			userId
		}
		const token = JSON.stringify(_token)
		localStorage.setItem('token', token)
	}
	const clearToken = () => {
		localStorage.removeItem('token')
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

			if (token) {
				const { userId } = token
				setToken(userId)

				setTimeout(() => {
					resolve(userId)
				}, 1000)
			} else {
				clearToken()
				clearAuthData()

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

	const isFinishInit = ref(false)
	/**
	 * 初始化系統使用者
	 * 初始化系統路由
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
