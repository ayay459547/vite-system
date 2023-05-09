// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
	// 權限設定
  const permission = {
		execute: 1 << 0,
		add: 1 << 1,
		update: 1 << 2,
		delete: 1 << 3
	}

	type ChangePermission<Res> = (currentPermission: number, diffPermission: number) => Res

	/**
	 * @author Caleb
	 * @description 判斷是否有權限
	 * @param currentPermission 當前權限
	 * @param diffPermission 想要比較的權限
	 * @returns {Boolean} 經過 及閘 判斷
	 */
	const hasPermission: ChangePermission<boolean> = (currentPermission, diffPermission): boolean => {
		return (currentPermission & diffPermission) > 0
	}

	/**
	 * @author Caleb
	 * @description 新增權限
	 * @param currentPermission 當前權限
	 * @param diffPermission 想要新增的權限號碼總和
	 * @returns {Number} 經過 或閘 合併
	 */
	const addPermission: ChangePermission<number> = (currentPermission, diffPermission): number  => {
		return currentPermission | diffPermission
	}

	/**
	 * @author Caleb
	 * @description 更新權限
	 * @param currentPermission 當前權限
	 * @param diffPermission 想要更新的權限號碼總和
	 * @returns {Number} 經過 互斥或閘 更新
	 */
	const updatePermission: ChangePermission<number> = (currentPermission, diffPermission): number  => {
		if (currentPermission === 0) return
		return diffPermission
	}

	/**
	 * @author Caleb
	 * @description 刪除權限
	 * @param currentPermission 當前權限
	 * @param diffPermission 想要刪除的權限號碼總和
	 * @returns {Number} 經過 先取反再做即閘 刪除
	 */
	const deletePermission: ChangePermission<number> = (currentPermission, diffPermission): number  => {
		// 互斥或閘 只能刪除單一權限
		// return currentPermission ^ diffPermission
		return currentPermission & (~diffPermission)
	}

  return {
		permission,
		hasPermission,
		addPermission,
		updatePermission,
		deletePermission
	}
})
