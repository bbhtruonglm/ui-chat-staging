/**Dữ liệu đầu vào cho việc dịch văn bản */
export interface TextTranslateInput {
  /**văn bản cần dịch */
  text: string
  /**ngôn ngữ nguồn */
  from: string
  /**ngôn ngữ đích */
  to: string
  /**id trang */
  page_id: string
  /**id khách hàng */
  client_id?: string
}

/**Dữ liệu văn bản đầu ra */
export interface TextOutput {
  /**văn bản đã dịch */
  text?: string
}


/**nguồn tin nhắn */
export interface SourceChat {
  /**tin nhắn đến từ đâu */
  type: 'PAGE' | 'CLIENT'
  /**nội dung tin nhắn */
  content: string
}

/**Dữ liệu đầu vào cho việc tạo câu trả lời */
export interface GenAnswerInput {
  /**nguồn câu chat */
  source?: SourceChat[]
  /**câu chat hiện tại */
  current?: string
  /**id trang */
  page_id: string
  /**id khách hàng */
  client_id?: string
}

/**loại quota */
export type QuotaType =
  | 'PAGE'
  | 'STAFF'
  | 'FAU'
  | 'CLIENT'
  | 'AI_TEXT'
  | 'AI_IMAGE'
  | 'AI_SOUND'
  | 'AI_VIDEO'