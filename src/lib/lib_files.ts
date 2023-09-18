import { tipLog, round } from '@/lib/lib_utils'

/**
 * @author Caleb
 * @description 將bytes做轉換
 * @param {Number} bytes 檔案大小
 * @returns {String} format後的檔案大小
 */
export const byteConvert = (bytes: number): string => {
  if (isNaN(bytes)) return ''

  const symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const exp = (() => {
    /**
     * 對數運算 (換底公式)
     * log 2 (bytes) = log 2 (bytes) / log 2 2
     */
    const _exp = Math.floor(Math.log(bytes) / Math.log(2))
    return round(_exp, 0)
  })()

  const i = Math.floor(exp / 10)
  const unit = symbols[i]

  const size = ((i) => {
    const _size = bytes / Math.pow(2, 10 * i)
    return round(_size, 2)
  })(i)

  return `${size}${unit}`
}

/**
 * @author Caleb
 * @description 讀取檔案類型
 * @param {File} file
 * @returns {String} 類型
 */
export const getFileType = (file: File): string => {
  const {
    name,
    type
    // size,
    // lastModified,
    // lastModifiedDate,
    // webkitRelativePath
  } = file

  if (type.startsWith('image/')) return 'image'

  const regexp = /\.\w*$/
  const fileType = name.match(regexp)[0] ?? ''

  switch (fileType.toLocaleLowerCase()) {
    case '.xlsx':
      return 'excel'
    case '.docx':
      return 'word'
    case '.pptx':
      return 'powerpoint'
    case '.zip':
    case '.7z':
      return 'zip'
    default:
      return fileType.substring(1)
  }
}

/**
 * @author Caleb
 * @description 讀取圖片檔
 * @param {File} file
 * @returns {String} 圖片網址
 */
export const readImage = async (file: File): Promise<string> => {
  const { name, type } = file

  if (!type.startsWith('image/')) {
    tipLog('上傳並非圖片檔', [type, name])
    return ''
  }

  // 確認圖片是否存在用的
  const img = document.createElement('img') as any
  img.style.display = 'none'
  document.body.appendChild(img)

  const reader = new FileReader()
  return new Promise((resolve) => {
    reader.onload = (event) => {
      const imgSrc = event.target.result as string
      img.setAttribute('src', imgSrc)
      resolve(imgSrc)

      setTimeout(() => {
        img.remove()
      }, 1000)
    }
    reader.readAsDataURL(file)
  })
}

