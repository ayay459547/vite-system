import { tipLog } from '@/lib/lib_utils'
import { nextTick } from 'vue'

/**
 * @author Caleb
 * @description 讀取檔案類型
 * @param {File} file
 * @returns {String} 類型
 */
export const getFileType = (file: File): string => {
  const {
    name
    // size,
    // type,
    // lastModified,
    // lastModifiedDate,
    // webkitRelativePath
  } = file

  const regexp = /\.\w*$/
  const fileType = name.match(regexp)[0] ?? ''

  switch (fileType) {
    case '.xlsx':
      return 'excel'
    case '.docx':
      return 'word'
    case '.png':
    case '.jpg':
      return 'image'
    default:
      return fileType.substr(1)
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

  if (type && !type.startsWith('image/')) {
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

