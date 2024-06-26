const system = (import.meta as any).env.VITE_API_SYSTEM_TYPE
const systemVersion = (import.meta as any).env.VITE_API_VERSION

/**
 * 重新設置 cookie
 *
 * 處發時機:
 * 如果第一次使用系統
 * 如果系統版本更換
 */
const checkSystemVersionDiff = () => {
  const localSystem = localStorage.getItem('system')
  const localVersion = localStorage.getItem('version')

  const isChange = [
    [null, undefined, ''].includes(localSystem),
    [null, undefined, ''].includes(localVersion),
    localSystem !== system,
    localVersion !== systemVersion
  ].some(isCheck => isCheck)

  return {
    isChange,
    system,
    systemVersion
  }
}

export default checkSystemVersionDiff
