import type { PropType } from 'vue'

import { fileTypeMap } from '@/lib/lib_files'

export const version = '__CustomUpload_1.0.0__'

export interface Types {
  fileType: (keyof typeof fileTypeMap)
  info: {
    src?: string
    fileSize?: string
    fileType?: string
    fileTarget?: File
    excel?: any[]
    properties?: any
  }
  fileInfo: Partial<File> & Types['info'] & {
    uuid: string
  }
  filesInfo: Array<Types['fileInfo']>
  uploadFile: File
}

export interface Props {
  overwrite: boolean
  multiple: boolean
  limitCount: number | null
  limitType: Types['fileType'] | Array<Types['fileType']>
}

export const props = {
  overwrite: {
    type: Boolean as PropType<Props['overwrite']>,
    required: false,
    default: false,
    description: '是否再上傳清空原來的檔案'
  },
  multiple: {
    type: Boolean as PropType<Props['multiple']>,
    required: false,
    default: false,
    description: '是否可上傳多個檔案'
  },
  limitCount: {
    type: [Number, null] as PropType<Props['limitCount']>,
    required: false,
    default: null,
    description: '限制檔案數量'
  },
  limitType: {
    type: [Array, String] as PropType<Props['limitType']>,
    required: false,
    default: null,
    description: '限制檔案類型'
  }
}

export interface Emits {
  file: (files: Types['filesInfo'], targetList: Types['uploadFile'][]) => void | any
}

export interface Expose {
  getFormData: () => FormData
  getFiles: () => Types['filesInfo']
}
