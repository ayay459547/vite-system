import type { Custom } from './CustomUploadInfo'

export const fileTypeMap = {
  image: ['image/png', 'image/jpeg'],
  word: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  excel: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  powerpoint: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  zip: ['', 'application/x-zip-compressed'],
  json: ['application/json']
}

/**
 * 取得所有檔案類型
 * @param fileTypeList 類型名稱
 * @returns {Array} 所有檔案類型
 */
export const getFileTypeList = (fileTypeList: Custom.FileType[]): string[] => {
  return fileTypeList.reduce((res, fileType) => {
    return [...res, ...fileTypeMap[fileType]]
  }, [])
}

// 取得圖示
export const getIcon = (fileType: string) => {
  switch (fileType) {
    case 'word':
      return 'file-word'
    case 'excel':
      return 'file-excel'
    case 'powerpoint':
      return 'file-powerpoint'
    case 'pdf':
      return 'file-pdf'
    case 'csv':
      return 'file-csv'
    case 'audio':
      return 'file-audio'
    case 'video':
      return 'file-video'
    case 'code':
      return 'file-code'
    case 'image':
      return 'file-image'
    case 'zip':
      return 'file-zipper'
    default:
      return 'file'
  }
}
// 取得顏色
export const getIconClass = (fileType: string) => {
  switch (fileType) {
    case 'image':
      return 'text-danger'
    case 'excel':
      return 'text-success'
    case 'word':
      return 'text-primary'
    case 'powerpoint':
      return 'text-warning'
    case '':
    default:
      return 'text-info'
  }
}