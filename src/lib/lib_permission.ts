const mode = (import.meta as any).env.MODE

export type ChangePermission<Res> = (currentPermission: number, diffPermission: number) => Res

// 系統所有權限種類 (2進制)
export const permission = {
  read: 1 << 0,
  create: 1 << 1,
  update: 1 << 2,
  delete: 1 << 3,
  execute: 1 << 4
}

export const totlaPermission = (
  permission.read +
  permission.create +
  permission.update +
  permission.delete +
  permission.execute
)

/**
 * 預設權限
 * 開發: 給全部
 * 打包: 0
 */
export const defaultPermission = (mode === 'development') ? totlaPermission : 0

export type Permission = {
  read: boolean
  create: boolean
  update: boolean
  delete: boolean
  execute: boolean
}
export const getPermission = (permissionTotal: number): Permission => {
  return {
    read: hasPermission(permissionTotal, permission.read),
    create: hasPermission(permissionTotal, permission.create),
    update: hasPermission(permissionTotal, permission.update),
    delete: hasPermission(permissionTotal, permission.delete),
    execute: hasPermission(permissionTotal, permission.execute)
  }
}

/**
 * @author Caleb
 * @description 判斷是否有權限
 * @param {Number} currentPermission 當前權限
 * @param {Number} diffPermission 想要比較的權限
 * @returns {Boolean} 經過 及閘 判斷
 */
export const hasPermission: ChangePermission<boolean> = (currentPermission: number, diffPermission: number): boolean => {
  return (currentPermission & diffPermission) > 0
}

/**
 * @author Caleb
 * @description 新增權限
 * @param {Number} currentPermission 當前權限
 * @param {Number} diffPermission 想要新增的權限號碼總和
 * @returns {Number} 經過 或閘 合併
 */
export const createPermission: ChangePermission<number> = (currentPermission: number, diffPermission: number): number  => {
  return currentPermission | diffPermission
}

/**
 * @author Caleb
 * @description 更新權限
 * @param {Number} currentPermission 當前權限
 * @param {Number} diffPermission 想要更新的權限號碼總和
 * @returns {Number} 經過 互斥或閘 更新
 */
export const updatePermission: ChangePermission<number> = (currentPermission: number, diffPermission: number): number  => {
  if (typeof diffPermission === 'number') return diffPermission
  return currentPermission
}

/**
 * @author Caleb
 * @description 刪除權限
 * @param {Number} currentPermission 當前權限
 * @param {Number} diffPermission 想要刪除的權限號碼總和
 * @returns {Number} 經過 先取反再做及閘 刪除
 */
export const deletePermission: ChangePermission<number> = (currentPermission: number, diffPermission: number): number  => {
  // 互斥或閘 只能刪除單一權限
  // return currentPermission ^ diffPermission
  return currentPermission & (~diffPermission)
}
