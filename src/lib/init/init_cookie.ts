import checkSystemVersionDiff from './checkSystemVersion'
import { setCookie } from '@/lib/cookie'

/**
 * cookie 刷新
 *
 * 處發時機:
 * 如果第一次使用系統
 * 如果系統版本更換
 */
const { isChange, system, systemVersion } = checkSystemVersionDiff()

if (isChange) {
  console.log('init cookie')

  setCookie('stystem', system)
  setCookie('version', systemVersion)
}