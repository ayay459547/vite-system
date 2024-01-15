import type { PropType } from 'vue'

import { getUuid } from '@/lib/lib_utils'

export const version = '1.0.0'

export const scopedId = getUuid('__i-upload__')

export type FileType = '' | 'image' | 'excel' | 'word' | 'powerpoint' | 'zip'

export interface Info {
  src?: string
  fileSize?: string
  fileType?: string
  fileTarget?: File
  excel?: any[]
  properties?: any
}
export interface FileInfo extends Partial<File>, Info {
  uuid: string
}
export type FilesInfo = Array<FileInfo>

export const props = {
  type: {
    type: String as PropType<FileType>,
    required: false,
    default: '',
    description: '上傳類型'
  },
  overwrite: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否再上傳清空原來的檔案'
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可上傳多個檔案'
  },
  limitCount: {
    type: [Number, null] as PropType<number | null>,
    required: false,
    default: null,
    description: '限制檔案數量'
  },
  limitType: {
    type: [Array, String] as PropType<FileType[] | FileType>,
    required: false,
    default: null,
    description: '限制檔案類型'
  }
}

export const fileTypeMap = {
  image: ['image/png', 'image/jpeg'],
  word: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  excel: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  powerpoint: [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ],
  zip: [
    '',
    'application/x-zip-compressed'
  ],
  json: [
    'application/json'
  ]
}
