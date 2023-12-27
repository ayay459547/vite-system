import checkSystemVersionDiff from './checkSystemVersion'

/**
 * localStorage 刪除換新
 *
 * 處發時機:
 * 如果第一次使用系統
 * 如果系統版本更換
 */
const { isChange, system, systemVersion } = checkSystemVersionDiff()

if (isChange) {
  console.log('init localStorage')

  localStorage.clear()
  localStorage.setItem('system', system)
  localStorage.setItem('version', systemVersion)
}
