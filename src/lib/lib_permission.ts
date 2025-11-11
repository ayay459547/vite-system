// 是否給所有權限
const isAllPermissionData = (import.meta as any).env.VITE_API_ALL_PERMISSION

export type ChangePermission<Res> = (currentPermission: number, diffPermission: number) => Res

// 系統所有權限種類 (2進制)
export enum PermissionEnum {
  Read = 1 << 0,
  Create = 1 << 1,
  Update = 1 << 2,
  Delete = 1 << 3,
  Execute = 1 << 4
}

export const totalPermission = Object.values(PermissionEnum).reduce((total, value) => {
  return total + (typeof value === 'number' ? value : 0)
}, 0)

export const defaultPermission = isAllPermissionData === 'true' ? totalPermission : 0

export type Permission = {
  read: boolean
  create: boolean
  update: boolean
  delete: boolean
  execute: boolean
}

/**
 * @author Caleb
 * @description 取得權限
 * @param {Number} permissionTotal 當前權限
 * @returns {Permission}
 */
export const getPermission = (permissionTotal: number): Permission => {
  return {
    read: hasPermission(permissionTotal, PermissionEnum.Read),
    create: hasPermission(permissionTotal, PermissionEnum.Create),
    update: hasPermission(permissionTotal, PermissionEnum.Update),
    delete: hasPermission(permissionTotal, PermissionEnum.Delete),
    execute: hasPermission(permissionTotal, PermissionEnum.Execute)
  }
}

/**
 * @author Caleb
 * @description 判斷是否有權限
 * @param {Number} currentPermission 當前權限
 * @param {Number} diffPermission 想要比較的權限
 * @returns {Boolean} 經過 及閘 判斷
 */
export const hasPermission: ChangePermission<boolean> = (
  currentPermission: number,
  diffPermission: number
): boolean => {
  return (currentPermission & diffPermission) > 0
}

/**
 * @author Caleb
 * @description 新增權限
 * @param {Number} currentPermission 當前權限
 * @param {Number} diffPermission 想要新增的權限號碼總和
 * @returns {Number} 經過 或閘 合併
 */
export const createPermission: ChangePermission<number> = (
  currentPermission: number,
  diffPermission: number
): number => {
  return currentPermission | diffPermission
}

/**
 * @author Caleb
 * @description 更新權限
 * @param {Number} currentPermission 當前權限
 * @param {Number} diffPermission 想要更新的權限號碼總和
 * @returns {Number}
 */
export const updatePermission: ChangePermission<number> = (
  currentPermission: number,
  diffPermission: number
): number => {
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
export const deletePermission: ChangePermission<number> = (
  currentPermission: number,
  diffPermission: number
): number => {
  // 互斥或閘 只能刪除單一權限
  // return currentPermission ^ diffPermission
  return currentPermission & ~diffPermission
}
