// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ref, computed, onBeforeMount, reactive } from 'vue'
import type { AuthData } from './api'
import { getUserData, getRoutesPermission } from './api'
import { permission } from '@/lib/permission'

export const useAuthStore = defineStore('auth', () => {
	// 確認使用者狀態
	// const checkAuthStatus = async () => {
	// 	return await new Promise((resolve) => {
	// 		setTimeout(() => {
	// 			resolve(true)
	// 		}, 1000)
	// 	})
	// }

	/**
	 * token 相關
	 * token會帶動使用者資料
	 */
	const token = ref('')
	const getToken = () => {
		return localStorage.getItem('token')
	}
	const setToken = (newToken: string) => {
		token.value = newToken
		localStorage.setItem('token', newToken)
	}
	const clearToken = () => {
		token.value = ''
		localStorage.removeItem('token')
	}
	// 登入狀態 看token
	const isLogin = computed(() => {
		return token.value.length > 0
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
	 * 使用 token 初始化使用者資料
	 */
	const initUserData = async () => {
		const _token = getToken()

		if (_token) {
			setToken(_token)
			const { data: userData } = await getUserData(_token)
			setAuthData(userData)
		} else {
			clearToken()
			clearAuthData()
		}
	}

	/**
	 * 使用者 id 取的資料
	 * 路由權限
	 * key(string): permissions(number)
	 */
	const routesPermission = reactive(new Map())

	const initRoutesPermission = async () => {
		routesPermission.clear()

		const { data: permissionList } = await getRoutesPermission(authData.value.id)

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

	/**
	 * 初始化系統使用者
	 * 初始化系統路由
	 */
	const initSystem = async () => {
		await initUserData()
		await initRoutesPermission()
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
		initSystem
	}
})
