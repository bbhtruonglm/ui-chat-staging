import { chatbox } from '@/service/api/chatbox/common'

import type { AttachmentInfo, InputGetUrlAttachment } from '@/service/interface/app/message'
import type { Cb } from '@/service/interface/function'
import type { FileInfo, GetFileInput, FromFile, UpdateFileInfo, FolderInfo, GetFolderInput, UpdateFolderInput, CreateFolderInput } from '@/service/interface/app/album'

/**đọc dữ liệu file của tin nhắn */
export const get_url_attachment = (
    body: InputGetUrlAttachment,
    proceed: Cb<AttachmentInfo[]>
) => chatbox({
    uri: `${$env.host.n6_static}/app/facebook/attachment/get_url_attachment`,
    body
}, proceed)

/**upload file lên server lấy link, sau 30s file sẽ tự bị xoá */
export const upload_temp_file = (
    body: FormData,
    proceed: Cb<string>
) => chatbox({
    uri: `${$env.host.n6_static}/app/upload/file/upload_temp_file`,
    body,
    form: true
}, proceed)
/**upload file lên server vĩnh viễn */
export const upload_file = (
    body: FormData,
    proceed: Cb<{ type?: string, url?: string }>
) => chatbox({
    uri: `${$env.host.n6_static}/app/upload/file/upload_file`,
    body,
    form: true
}, proceed)

/**đọc danh sách tập tin */
export const read_file_album = (
    body: GetFileInput,
    proceed: Cb<FileInfo[]>
) => chatbox({
    uri: `${$env.host.n6_static}/app/album/file/read_file`,
    body,
}, proceed)

/**đọc danh sách thư mục */
export const read_folder_album = (
    body: GetFolderInput,
    proceed: Cb<FolderInfo[]>
) => chatbox({
    uri: `${$env.host.n6_static}/app/album/folder/read_folder`,
    body,
}, proceed)

/**cập nhật thư mục */
export const update_folder_album = (
    body: UpdateFolderInput,
    proceed: Cb
) => chatbox({
    uri: `${$env.host.n6_static}/app/album/folder/update_folder_info`,
    body,
}, proceed)

/**xoá thư mục */
export const delete_folder_album = (
    body: FromFile,
    proceed: Cb
) => chatbox({
    uri: `${$env.host.n6_static}/app/album/folder/delete_folder`,
    body,
}, proceed)
/**tạo mới thư mục */
export const create_folder_album = (
    body: CreateFolderInput,
    proceed: Cb
) => chatbox({
    uri: `${$env.host.n6_static}/app/album/folder/create_new_folder`,
    body,
}, proceed)

/**xoá tập tin */
export const delete_file_album = (
    body: UpdateFileInfo,
    proceed: Cb
) => chatbox({
    uri: `${$env.host.n6_static}/app/album/file/delete_file`,
    body,
}, proceed)

/**upload file album */
export const upload_file_album = (
    qs: FromFile,
    body: FormData,
    proceed: Cb<FileInfo>
) => chatbox({
    uri: `${$env.host.n6_static}/app/album/file/upload_file`,
    qs,
    body,
    form: true
}, proceed)