import { useMessageStore } from '@/stores'

import type { FileTypeInfo } from '@/service/interface/app/message'
import type { Cb } from '@/service/interface/function'

/**các kiểu tệp fb cho phép khi upload */
export const FB_VALID_FILE_TYPE = ['audio', 'file', 'image', 'video']

/**phân tích file type của FB từ minetype */
export const getFbFileType = (mine_type: string): FileTypeInfo => {
    /**kiểu của file phân tích được */
    let type = mine_type?.split('/')?.[0]

    /**kết quả */
    let result: FileTypeInfo

    // nếu không tìm thấy kiểu phù hợp thì fix kiểu mặc định
    if (!FB_VALID_FILE_TYPE.includes(type)) result = 'file'
    else result = type as FileTypeInfo

    return result
}

/**chuyển đổi img src thành file upload được */
export const srcImageToFile = (src: string, proceed: Cb<File>) => fetch(src)
    .then(r => r.blob())
    .then(blob => proceed(
        null,
        new File([blob], 'image.jpg', { type: blob.type }))
    )
    .catch(proceed)

/**xử lý dữ liệu trên máy tính */
export const handleFileLocal = (file: File) => {
    const messageStore = useMessageStore()

    /**kiểu fb của file */
    const TYPE = getFbFileType(file.type)

    if (TYPE !== 'image')
        return messageStore.upload_file_list.push({ source: file, type: TYPE })

    // render hình ảnh để hiển thị preview
    const READER = new FileReader()
    READER.onload = $event => messageStore.upload_file_list.push({
        source: file,
        type: TYPE,
        preview: $event.target?.result
    })
    READER.readAsDataURL(file)
}