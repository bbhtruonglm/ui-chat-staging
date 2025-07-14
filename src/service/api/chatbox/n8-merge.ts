import { chatbox } from '@/service/api/chatbox/common'

import type { Cb } from '@/service/interface/function'

/**tạo file dữ liệu khách hàng để có thể tải về */
export const create_download = (
    body: any,
    proceed: Cb
) => chatbox({
    uri: `${$env.host.n8_merge}/v1/service/download_conversation`,
    body
}, proceed)