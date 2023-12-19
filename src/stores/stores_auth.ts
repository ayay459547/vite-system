// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { shallowRef, computed, shallowReactive } from 'vue'
import type { AuthData, PermissionData } from './api'
import { getAuthData, getRoutesPermission } from './api'
import { permission } from '@/lib/lib_permission'

import { getRouterLeafLayer } from '@/lib/lib_routes'
import routes from '@/router/routes'
import { getToken, setToken, clearToken } from '@/lib/lib_cookie'

export const useAuthStore = defineStore('auth', () => {
	// 登入狀態 看使用者資料
	const isLogin = computed(() => {
		return authData.value.id > 0
	})

	/**
	 * 使用者資料相關
	 * 使用者資料會帶動權限
	 */
	const authData = shallowRef<AuthData>({
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

				setTimeout(() => {
					resolve(0)
				}, 1000)
			}
		})
	}

	/**
	 * 使用者 id 取的資料
	 * 路由權限
	 * key(string): permissions(number)
	 */
	const routesPermission = shallowReactive(new Map())

	const setRoutesPermission = async (permissionList: PermissionData[]) => {
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

	/**
	 * 初始化系統使用者
	 * 初始化系統路由權限
	 */
	const initSystemData = async () => {
		routesPermission.clear()

		const userId = await checkAuthStatus()

		if (userId > 0) {
			const [
				{ data: authData },
				{ data: permissionList }
			] = await Promise.all([
				// 使用 token 初始化使用者資料
				getAuthData(userId),
				getRoutesPermission(userId)
			])

			setAuthData(authData)
			setRoutesPermission(permissionList)
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
