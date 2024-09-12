import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Types {
  type FileType = 'file' | 'image' | 'excel' | 'word' | 'powerpoint' | 'zip'
  interface Info {
    src?: string
    fileSize?: string
    fileType?: string
    fileTarget?: File
    excel?: any[]
    properties?: any
  }
  interface FileInfo extends Partial<File>, Types.Info {
    uuid: string
  }
  type FilesInfo = Array<Types.FileInfo>
  type UploadFile = File
}

export declare namespace Props {
  // type Type = FileType
  type Overwrite = boolean
  type Multiple = boolean
  type LimitCount = number | null
  type LimitType = Types.FileType | Array<Types.FileType>
}

export const props = {
  // type: {
  //   type: String as PropType<Props.Type>,
  //   required: false,
  //   default: 'file',
  //   description: '上傳類型'
  // },
  overwrite: {
    type: Boolean as PropType<Props.Overwrite>,
    required: false,
    default: false,
    description: '是否再上傳清空原來的檔案'
  },
  multiple: {
    type: Boolean as PropType<Props.Multiple>,
    required: false,
    default: false,
    description: '是否可上傳多個檔案'
  },
  limitCount: {
    type: [Number, null] as PropType<Props.LimitCount>,
    required: false,
    default: null,
    description: '限制檔案數量'
  },
  limitType: {
    type: [Array, String] as PropType<Props.LimitType>,
    required: false,
    default: null,
    description: '限制檔案類型'
  }
}

export declare namespace Emits {
  type File = (files: Types.FilesInfo, targetList: Types.UploadFile[]) => void | any
}

export declare namespace Expose {
  type GetFormData = () => FormData
  type GetFiles = () => Types.FilesInfo
}
