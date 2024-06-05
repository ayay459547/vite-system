/**
 * 格式化成 hh:mm
 * @param {string}time
 * @returns {string} hh:mm
 */
export const timeFormat = (time: string): string => {
  const [_hour, _minutes] = time.split(':')
  return `${_hour}`.padStart(2, '0') + ':' + `${_minutes}`.padStart(2, '0')
}
