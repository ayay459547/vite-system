import checkSystemVersionDiff from './checkSystemVersion'

/**
 * 如果系統版本更換 localStorage 刪除換新
 */
const { isChange } = checkSystemVersionDiff()

if (isChange) {
  console.log('init localStorage')
  localStorage.clear()
  localStorage.setItem('token', '')
}