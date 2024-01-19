import { defineStore } from 'pinia'
import { shallowRef, computed, shallowReactive } from 'vue'

import { permission } from '@/lib/lib_permission'
import { isEmpty } from '@/lib/lib_utils'
import { getRouterLeafLayer } from '@/lib/lib_routes'
import routes from '@/router/routes'
import { getToken, setToken, clearToken } from '@/lib/lib_cookie'
import type { AuthData, PermissionData } from '@/declare/hook'

import { defaultAuthData, getAuthData } from './api'

export const useAuthStore = defineStore('auth', () => {
	// 登入狀態 看使用者資料
	const isLogin = computed(() => {
		return !isEmpty(authData.value?.user?.id)
	})

	/**
	 * 使用者資料相關
	 * 使用者資料會帶動權限
	 */
	const authData = shallowRef<AuthData>(defaultAuthData)
	const setAuthData = (auth: AuthData) => {
		authData.value = auth
	}
	const clearAuthData = () => {
		authData.value = defaultAuthData
	}

	/**
	 * 確認狀態 目前是前端做
	 * 有可能串後端 api
	 */
	const checkAuthStatus = async (): Promise<number | null> => {
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

				setTimeout(() => {
					resolve(null)
				}, 1000)
			}
		})
	}

	/**
	 * 依照使用者 id
	 * 取得權限資料
	 * key(string): permissions(number)
	 */
	const routesPermission = shallowReactive(new Map<string, number>())

	const setRoutesPermission = async (permissionList: PermissionData[]) => {
		permissionList.forEach(permissionItem => {
			const {
				readPermissions,
				createPermissions,
				updatePermissions,
				deletePermissions,
				executePermissions,
				pk
			} = permissionItem

			const { functionID } = pk
			/**
			 * 依據 api 取得的路由權限
			 * 設定 權限的總和
			 */
			let _permission = 0
			if (readPermissions) {
				_permission += permission.read
			}
			if (createPermissions) {
				_permission += permission.create
			}
			if (updatePermissions) {
				_permission += permission.update
			}
			if (deletePermissions) {
				_permission += permission.delete
			}
			if (executePermissions) {
				_permission += permission.execute
			}
			routesPermission.set(functionID, _permission)
		})

	}
	// 將所有路由權限變為 0
	const clearRoutesPermission = () => {
		const permissionList = getRouterLeafLayer(routes, [1, 2, 3], false)

		permissionList.forEach(permissionItem => {
			routesPermission.set(permissionItem.name, 0)
		})
	}

	/**
	 * 初始化系統使用者
	 * 初始化系統路由權限
	 */
	const initSystemData = async () => {
		routesPermission.clear()

		const userId = await checkAuthStatus()

		if (!isEmpty(userId)) {
			// 使用 token 初始化使用者資料
			const authData = await getAuthData(userId)

			const {
				user,
				roleFunction: permissionList
			} = authData

			const authId = user.id

			setAuthData(authData)
			setRoutesPermission(permissionList)

			// 後端取使用者失敗
			if (isEmpty(authId)) {
				clearToken()
			}
		} else {
			clearAuthData()
			clearRoutesPermission()
		}
	}

  return {
		isLogin,    // 路由確認用

		authData,
		routesPermission,
		initSystemData
	}
})
