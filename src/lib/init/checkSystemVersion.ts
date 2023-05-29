import { getCookie } from '@/lib/cookie'

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
  const cookieSystem = getCookie('stystem')
  const cookieVersion = getCookie('version')

  if (
    [null, undefined, ''].includes(cookieSystem) ||
    [null, undefined, ''].includes(cookieVersion)
  ) {
    return {
      isChange: true,
      system,
      systemVersion
    }
  }

  if (
    (cookieSystem !== system) ||
    (cookieVersion !== systemVersion)
  ) {
    return {
      isChange: true,
      system,
      systemVersion
    }
  }

  return {
    isChange: false,
    system,
    systemVersion
  }
}

export default checkSystemVersionDiff