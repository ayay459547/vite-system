import checkSystemVersionDiff from './checkSystemVersion.ts'
import { removeCookie } from '@/lib/lib_cookie.ts'

/**
 * cookie 刷新
 *
 * 處發時機:
 * 如果第一次使用系統
 * 如果系統版本更換
 */
const { isChange } = checkSystemVersionDiff()

if (isChange) {
  console.log('init cookie')

  removeCookie('token')
}
